import {
    Identifier,
    QueryModel
} from "@digitalaidseattle/core";
import {
    Node,
    NodeService,
    Program,
    ProgramService as PMProgramService
} from "@digitalaidseattle/program-management";

import template from "../resources/template.json";


export const ORG_NAME = "VentureEval";

export class ProgramService {

    private static instance: ProgramService;

    public static getInstance(): ProgramService {
        if (!ProgramService.instance) {
            ProgramService.instance = new ProgramService();
        }
        return ProgramService.instance;
    }

    async findByOrganization(organization: string = ORG_NAME): Promise<Program[]> {
        const queryModel: QueryModel = {
            filterModel: {
                items: [
                    {
                        field: 'organization',
                        operator: '==',
                        value: organization
                    }
                ]
            },
            page: 1,
            pageSize: 100,
            sortField: 'prefix',
            sortDirection: 'asc'
        }
        return PMProgramService.getInstance().dao.find(queryModel).then(pageInfo => pageInfo.rows);
    }

    // deletes the program and its node tree
    async deleteProgram(program: Program): Promise<void> {
        const nodeService = NodeService.getInstance();
        const nodes = await nodeService.findByProgramId(program.id);
        for (const root of nodes.filter(node => !node.parent_id)) {
            await nodeService.deleteRecursive(root.id as Identifier);
        }
        await PMProgramService.getInstance().dao.delete(program.id as Identifier);
    }

    // returns an error message for each field that is missing or already used by a program in the organization
    validate(name: string, prefix: string, programs: Program[]): { name?: string, prefix?: string } {
        const errors: { name?: string, prefix?: string } = {};
        const matches = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();
        if (!name.trim()) {
            errors.name = 'Name is required.';
        } else if (programs.some(program => matches(program.name ?? '', name))) {
            errors.name = 'A program with this name already exists.';
        }
        if (!prefix.trim()) {
            errors.prefix = 'Prefix is required.';
        } else if (programs.some(program => matches(program.prefix ?? '', prefix))) {
            errors.prefix = 'A program with this prefix already exists.';
        }
        return errors;
    }

    // creates a program from the evaluation template, including its node tree
    async generateProgram(programName: string, programPrefix: string, organization: string = ORG_NAME): Promise<Program> {
        const errors = this.validate(programName, programPrefix, await this.findByOrganization(organization));
        if (errors.name || errors.prefix) {
            throw new Error([errors.name, errors.prefix].filter(Boolean).join(' '));
        }
        const { id, nodes, ...fields } = structuredClone(template) as unknown as Program;
        const name = programName.trim();
        const prefix = programPrefix.trim();
        const program = await PMProgramService.getInstance().insert({
            ...fields,
            id: undefined,
            organization: organization,
            name: name,
            prefix: prefix,
            next_task_number: 1,
            nodes: []
        } as Program);

        let taskNumber = 1;
        const insertNodes = async (templateNodes: Node[], parentId: Identifier | null) => {
            for (const templateNode of templateNodes) {
                const { id, children, ...nodeFields } = templateNode;
                const inserted = await NodeService.getInstance().insert({
                    ...nodeFields,
                    id: undefined,
                    program_id: program.id!,
                    parent_id: parentId,
                    node_no: `${prefix}-${taskNumber++}`,
                    children: []
                } as Node);
                await insertNodes(children ?? [], inserted.id as Identifier);
            }
        };
        await insertNodes(nodes, null);

        return PMProgramService.getInstance().update({ ...program, next_task_number: taskNumber });
    }


    // returns the program with its node tree: root nodes in nodes, descendants in children
    async getById(id: Identifier): Promise<Program> {
        const program = await PMProgramService.getInstance().dao.getById(id);
        if (!program) {
            throw new Error(`Program not found for id = ${id}`);
        }
        // numeric collation so ABC-2 sorts before ABC-10
        const allNodes = (await NodeService.getInstance().findByProgramId(program.id))
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        const childrenByParent = new Map<Identifier, Node[]>();
        for (const node of allNodes) {
            node.children = [];
            if (node.parent_id) {
                const siblings = childrenByParent.get(node.parent_id) ?? [];
                siblings.push(node);
                childrenByParent.set(node.parent_id, siblings);
            }
        }
        for (const node of allNodes) {
            node.children = childrenByParent.get(node.id as Identifier) ?? [];
        }
        return { ...program, nodes: allNodes.filter(node => !node.parent_id) };
    }
}
