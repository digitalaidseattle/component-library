/**
 *  ProgramService.tsx
 *
 *  @copyright 2026 Digital Aid Seattle
 *
 */

import { DataAccessObject, getCoreServices, Identifier, QueryModel } from "@digitalaidseattle/core";
import { v4 as uuid } from "uuid";
import { Configuration } from "../Configuration";
import { Node, Profile, Program } from "../types";
import { NodeService } from "./NodeService";

export class ProgramService {

    private static instance: ProgramService;

    public static getInstance(): ProgramService {
        if (!ProgramService.instance) {
            ProgramService.instance = new ProgramService(Configuration.getInstance().programDao);
        }
        return ProgramService.instance;
    }

    dao: DataAccessObject<Program>;

    constructor(dao: DataAccessObject<Program>) {
        this.dao = dao;
    }

    empty(): Program {
        return ({
            id: undefined,
            status: 'active',
            name: '',
            description: '',
            prefix: '',
            next_task_number: 1,
            node_types: ['Epic', 'Feature', 'Story', 'Task', 'Bug'],
            node_statuses: ['Backlog', 'To Do', 'In Progress', 'In Review', 'In QA', 'Done', 'Canceled'],
            nodes: [],
            members: []
        })
    }

    async findActive(): Promise<Program[]> {
        const queryModel: QueryModel = {
            filterModel: {
                items: [
                    {
                        field: 'status',
                        operator: '==',
                        value: 'active'
                    }
                ]
            },
            page: 1,
            pageSize: 100,
            sortField: 'prefix',
            sortDirection: 'asc'
        }
        return this.dao.find(queryModel).then(pageInfo => pageInfo.rows);
    }

    async getAll(): Promise<Program[]> {
        return this.dao.getAll();
    }

    // returns a fully hydrated program with all nodes and their children
    async getById(id: Identifier): Promise<Program | null> {
        const program = await this.dao.getById(id);
        if (program) {
            const allNodes = await NodeService.getInstance().findByProgramId(program.id);
            program.nodes = allNodes.filter(node => !node.parent_id);
            for (const root of program.nodes) {
                root.children = this.getChildren(root, allNodes);
            }
        }
        return program;
    }

    getChildren(root: Node, allNodes: Node[]): Node[] {
        const children = allNodes.filter(node => node.parent_id === root.id);
        for (const child of children) {
            child.children = this.getChildren(child, allNodes);
        }
        return children;
    }

    async insert(program: Program): Promise<Program> {
        const authService = getCoreServices().authService;
        if (authService) {
            const user = await authService.getUser();
            if (user) {
                const now = new Date();
                const tagged = {
                    ...program,
                    created_by: user.email,
                    created_at: now,
                    updated_by: user.email,
                    updated_at: now,
                }
                return this.dao.insert(tagged);
            }
            throw new Error('User not available.')
        }
        throw new Error('Auth service not available.')
    }

    async update(program: Program): Promise<Program> {
        return this.dao.update(program.id!, program);
    }

    async createChild(program: Program, parentId?: string): Promise<Node> {
        const nodeService = NodeService.getInstance();
        if (!parentId) {
            return {
                ...nodeService.empty(),
                program_id: program.id!,
                type: program.node_types[0],
                status: program.node_statuses[0]
            }
        } else {
            const parent = await nodeService.getById(parentId);
            if (parent) {
                const childType = this.getChildType(program, parent);
                if (childType) {
                    return {
                        ...nodeService.empty(),
                        program_id: program.id!,
                        parent_id: parentId,
                        type: childType,
                        status: program.node_statuses[0]
                    }
                }
            }
            throw new Error(`Could not create child for id = ${parentId}`)
        }
    }

    async insertNode(program: Program, node: Node): Promise<Program> {
        const authService = getCoreServices().authService;
        const nodeService = NodeService.getInstance();
        if (authService) {
            const user = await authService.getUser();
            if (user) {
                const now = new Date();
                const taggedNode = {
                    ...node,
                    program_id: program.id!,
                    node_no: `${program.prefix}-${program.next_task_number}`,
                    history: [{ user: user.email, description: `${node.type} created.`, date: now.toISOString() }]
                }
                const updatedNode = await nodeService.insert(taggedNode);
                const updatedProgram = await this.dao.update(program.id!, {
                    ...program,
                    next_task_number: program.next_task_number + 1
                });

                console.log(updatedProgram, updatedNode);
                return updatedProgram;
            }
            throw new Error('User not in session.')
        }
        throw new Error('Auth service not available.')
    }

    getChildType(program: Program, parent: Node | undefined): string | null {
        if (!this.isValid(program)) {
            throw new Error(`program is not valid`);
        }
        if (!parent) {
            if (program.node_types.length > 0) {
                return program.node_types[0]
            }
            return null;  // throw error? no  node_type 
        } else {
            const index = program.node_types.findIndex(type => type === parent.type)
            if (program.node_types.length - 1 === index) {
                return program.node_types[program.node_types.length - 1] // adding child to leaf?
            }
            return program.node_types[index + 1]
        }
    }

    findNode(program: Program, nodeId: string): Node | undefined {
        return NodeService.getInstance().findNodeById(program.nodes, nodeId);
    }

    findNodeByNo(program: Program, nodeNo: string): Node | undefined {
        return NodeService.getInstance().findNodeByNo(program.nodes, nodeNo);
    }

    // TODO consider moving this to a validation service
    isValid(program: Program): boolean {
        if (!program.name) {
            return false;
        }
        if (!program.node_types || program.node_types.length === 0) {
            return false;
        }
        if (!program.node_statuses || program.node_statuses.length === 0) {
            return false;
        }
        return true;
    }

    // expect that program is fully hydrated
    // return root node -> immediate parent
    findAncestors(program: Program, node: Node): Node[] {
        const ancestors: Node[] = [];
        let parentId = node.parent_id;
        while (parentId) {
            const parent = this.findNode(program, parentId as string);
            if (parent) {
                ancestors.push(parent!);
                parentId = parent.parent_id;
            } else {
                throw new Error('Program has a broken node tree.');
            }
        }
        return ancestors.reverse();
    }

}