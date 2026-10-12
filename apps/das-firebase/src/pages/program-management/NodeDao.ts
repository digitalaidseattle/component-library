/**
 *  ProfileDao.tsx
 *
 *  @copyright 2026 Digital Aid Seattle
 *
 */

import { Configuration, FirestoreDao } from "@digitalaidseattle/firebase";
import { Node } from "@digitalaidseattle/program-management";

export class NodeDao extends FirestoreDao<Node> {
    private static instance: NodeDao;

    public static getInstance(): NodeDao {
        if (!this.instance) {
            this.instance = new NodeDao(
                "nodes",
                Configuration.getInstance().client,
                {
                    mapper: (json) => {
                        const entity = {
                            ...json,
                            due_date: json.due_date ? new Date(json.due_date) : undefined,
                        }
                        return entity;
                    },
                    unmapper: (entity) => {
                        const { id, children, ...trimmed } = entity;
                        return trimmed;
                    }
                }
            );
        }
        return this.instance;
    }

}