/**
 *  ProgramService.tsx
 *
 *  @copyright 2026 Digital Aid Seattle
 *
 */

import { DataAccessObject, getCoreServices, Identifier } from "@digitalaidseattle/core";
import { Configuration } from "../Configuration";
import { Node } from "../types";
import { ProfileService } from "./ProfileService";


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
            priority: '',
            assignee_id: undefined,
            due_date: new Date(),

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
            filterModel: {
                items: [
                    {
                        field: 'program_id',
                        operator: '==',
                        value: id
                    }
                ]
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

    async changeAttribute(node: Node, attribute: string, value: string): Promise<Node> {
        const user = await getCoreServices().authService?.getUser();
        const newHistory = {
            user: user?.email!,
            description: `Changed "${attribute}" to "${value}".`,
            date: new Date().toISOString(),
        };

        const partial: any = { history: [...node.history, newHistory] };
        partial[attribute] = value;
        return this.dao.update(node.id as Identifier, partial);
    }

    async changeAssignment(node: Node, attribute: string, value: string): Promise<Node> {
        const user = await getCoreServices().authService?.getUser();
        const assignee = await ProfileService.getInstance().getById(value);
        const newHistory = {
            user: user?.email!,
            description: `Changed "Assignee" to "${assignee?.name}".`,
            date: new Date().toISOString(),
        };

        const partial: any = { history: [...node.history, newHistory] };
        partial[attribute] = value;
        return this.dao.update(node.id as Identifier, partial);
    }

    getUrl(node: Node): string {
        return `/programs/${node.program_id}/nodes/${node.node_no}`
    }

    async update(id: Identifier, changes: Partial<Node>): Promise<Node> {
        return this.dao.update(id, changes);
    }

    async updateComment(node: Node, commentIndex: number, newContent: string): Promise<Node> {
        const user = await getCoreServices().authService?.getUser();
        const newHistory = {
            user: user?.email!,
            description: commentIndex === -1 ? 'Comment added.' : 'Comment.updated',
            date: new Date().toISOString(),
        };
        const newComment = {
            user: user?.email!,
            content: newContent,
            date: new Date().toISOString(),
        };

        if (commentIndex > -1) {
            node.comments[commentIndex] = newComment
        }

        const newComments = commentIndex === -1 ? [...node.comments, newComment] : [...node.comments];
        const partial: any = { comments: newComments, history: [...node.history, newHistory] };
        return this.dao.update(node.id as Identifier, partial);
    }


}