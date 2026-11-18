import {
    Identifier
} from "@digitalaidseattle/core";
import {
    Node,
    NodeService
} from "@digitalaidseattle/program-management";
 
export class VENodeService extends NodeService {

    async changeAttribute(node: Node, attribute: string, value: string | null): Promise<Node> {
        const updated = await super.changeAssignment(node, attribute, value);

        if (attribute === 'status' && updated.parent_id) {
            const parent = await this.getById(updated.parent_id);
            const children = await this.findByParentId(parent.id as Identifier);

            if (this.allComplete(children)) {
                await this.changeAttribute(parent, 'status', 'Done');
            } else {
                await this.changeAttribute(parent, 'status', 'In Progress');
            }
        }
        return updated;
    }

    allComplete(children: Node[]): boolean {
        return children.length > 0 && children.every(child => child.status === 'Done');
    }
}
