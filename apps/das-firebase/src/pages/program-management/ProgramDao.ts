/**
 *  ProgramDao.tsx
 *
 *  @copyright 2026 Digital Aid Seattle
 *
 */
import { Configuration, FirestoreDao } from "@digitalaidseattle/firebase";
import { Program } from "@digitalaidseattle/program-management";

export class ProgramDao extends FirestoreDao<Program> {
    private static instance: ProgramDao;

    public static getInstance(): ProgramDao {
        if (!this.instance) {
            this.instance = new ProgramDao(
                "programs",
                Configuration.getInstance().client,
                {
                    unmapper: (entity) => {
                        const { id, nodes, ...trimmed } = entity;
                        return trimmed;
                    }
                }
            );
        }
        return this.instance;
    }

}