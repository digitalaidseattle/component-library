/**
 *  authService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { saveAs } from 'file-saver';
import { v4 as uuid } from 'uuid';
import { read, utils, write } from "xlsx";

import { Staff } from "./types";
import { StaffDao } from './StaffDao';


class StaffService {

    private static instance: StaffService;

    static getInstance() {
        if (!StaffService.instance) {
            StaffService.instance = new StaffService();
        }
        return StaffService.instance;
    }

    dao: StaffDao;
    constructor() {
        this.dao = StaffDao.getInstance();
    }

    async batchInsert(newStaffData: Staff[]): Promise<Staff[]> {
        return this.dao.batchInsert(newStaffData);
    }

    getAll() {
        return this.dao.getAll();
    }

    async download(fileName: string, data: any): Promise<boolean> {
        const workbook = utils.book_new();

        const sheet = utils.json_to_sheet(data)
        utils.book_append_sheet(workbook, sheet);

        const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, `${fileName}`);
        return true;
    }

    // referenced example at https://docs.sheetjs.com/docs/demos/frontend/react/
    async parse(file: File): Promise<Staff[]> {
        // converts worksheet to an array
        const arrayBuffer = await file.arrayBuffer();

        const workbook = read(arrayBuffer);

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data: Staff[] = utils.sheet_to_json(worksheet);

        // modify excel sheet data
        data.map((employee) => {
            // add id and date fields
            employee.id = uuid();
            employee.created_at = new Date();
            // convert roles string into an array
            employee.roles = employee.roles.toString().split(",");
        })
        return data;
    }

}

const staffService = new StaffService()
export { staffService };

