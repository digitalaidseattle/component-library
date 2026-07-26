import { DataAccessObject, DataAccessOptions, Identifier, PageInfo, QueryModel } from "@digitalaidseattle/core";
import { Configuration } from "../Configuration";
import { Profile, Program } from "../types";

export class ProgramDao implements DataAccessObject<Program> {
    private static instance: ProgramDao;

    public static getInstance(): ProgramDao {
        if (!ProgramDao.instance) {
            //Fix Me
            ProgramDao.instance = new ProgramDao();
        }
        return ProgramDao.instance;
    }

    constructor() {
    }
    getById(id: Identifier, opts?: DataAccessOptions<Program> | undefined): Promise<Program | null> {
        throw new Error("Method not implemented.");
    }
    batchInsert(entities: Program[], opts?: DataAccessOptions<Program> | undefined): Promise<Program[]> {
        throw new Error("Method not implemented.");
    }
    insert(entity: Program, opts?: DataAccessOptions<Program> | undefined): Promise<Program> {
        throw new Error("Method not implemented.");
    }
    update(id: Identifier, changes: Partial<Program>, opts?: DataAccessOptions<Program> | undefined): Promise<Program> {
        throw new Error("Method not implemented.");
    }
    delete(id: Identifier): Promise<void> {
        throw new Error("Method not implemented.");
    }
    upsert(entity: Program, opts?: DataAccessOptions<Program> | undefined): Promise<Program> {
        throw new Error("Method not implemented.");
    }
    find(queryModel: QueryModel, opts?: DataAccessOptions<Program> | undefined): Promise<PageInfo<Program>> {
        throw new Error("Method not implemented.");
    }
    mapJson(json: any): Program {
        throw new Error("Method not implemented.");
    }

    async getAll(): Promise<Program[]> {
        return [];
    }
}