import { DataAccessObject } from "@digitalaidseattle/core";
import { Configuration } from "../Configuration";
import { Program } from "../types";
import { v4 as uuid } from "uuid";
import { ProgramDao } from "./ProgramDao";
export class ProgramService {

    private static instance: ProgramService;

    public static getInstance(): ProgramService {
        if (!ProgramService.instance) {
            ProgramService.instance = new ProgramService(ProgramDao.getInstance());
        }
        return ProgramService.instance;
    }

    dao: DataAccessObject<Program>;

    constructor(dao: DataAccessObject<Program>) {
        this.dao = dao;
    }

    empty(): Program {
        return ({
            id: uuid(),
            name: 'New Program',
            description: '',
            node_types: ['Epic', 'Feature', 'Story', 'Task', 'Bug'],
            statuses: ['Backlog', 'To Do', 'In Progress', 'In Review', 'In QA', 'Done', 'Canceled'],
            nodes: []
        })
    }

    async getAll(): Promise<Program[]> {
        return this.dao.getAll();
    }
}