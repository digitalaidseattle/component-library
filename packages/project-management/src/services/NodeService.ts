/**
 *  ProgramService.tsx
 *
 *  @copyright 2026 Digital Aid Seattle
 *
 */

import { DataAccessObject, getCoreServices, Identifier } from "@digitalaidseattle/core";
import { Configuration } from "../Configuration";
import { Comment, History, Node } from "../types";


export class NodeService {



    private static instance: NodeService;

    public static getInstance(): NodeService {
        if (!NodeService.instance) {
            NodeService.instance = new NodeService(Configuration.getInstance().nodeDao);
        }
        return NodeService.instance;
    }

    dao: DataAccessObject<Node>;

    constructor(dao: DataAccessObject<Node>) {
        this.dao = dao;
    }

    empty(): Node {

        return ({
            id: undefined,
            program_id: '',
            parent_id: undefined,
            node_no: '',

            name: '',
            type: '',
            status: '',
            description: '',
            assignee_id: undefined,

            children: [],
            comments: [],
            history: []
        })
    }

    async getById(id: Identifier): Promise<Node> {
        const found = await this.dao.getById(id);
        if (found) {
            return found;
        }
        throw new Error(`Node with id ${id} not found.`);
    }

    async insert(node: Node): Promise<Node> {
        const authService = getCoreServices().authService;
        if (authService) {
            const user = await authService.getUser();
            if (user) {
                const now = new Date();
                const decorated = {
                    ...node,
                    created_by: user.email,
                    created_at: now,
                    updated_by: user.email,
                    updated_at: now,
                }
                return this.dao.insert(decorated);
            }
            throw new Error('User not in session.')
        }
        throw new Error('Auth service not available.')
    }

    async findByProgramId(id: Identifier | null | undefined): Promise<Node[]> {
        const queryModel = {
            filter: {
                program_id: id
            },
            page: 1,
            pageSize: 1000,
            sortField: 'parent_id',
            sortDirection: 'asc'
        }
        const pageInfo = await this.dao.find(queryModel);
        return pageInfo.rows;
    }

    findNodeById(nodes: Node[], id: string): Node | undefined {
        for (const node of nodes ?? []) {
            if (node.id === id) {
                return node;
            }
            const found = this.findNodeById(node.children ?? [], id);
            if (found) {
                return found;
            }
        }
        return undefined;
    }

    findNodeByNo(nodes: Node[], node_no: string): Node | undefined {
        for (const node of nodes) {
            if (node.node_no === node_no) {
                return node;
            }
            const found = this.findNodeByNo(node.children ?? [], node_no);
            if (found) {
                return found;
            }
        }
        return undefined;
    }

    getAncestors(nodes: Node[], node: Node): Node[] {
        const ancestors: Node[] = [];
        let currentNode: Node | undefined = node;
        while (currentNode && currentNode.parent_id) {
            const parent = nodes.find(n => n.id === currentNode!.parent_id);
            if (parent) {
                ancestors.push(parent);
                currentNode = parent;
            } else {
                break;
            }
        }
        return ancestors;
    }
}