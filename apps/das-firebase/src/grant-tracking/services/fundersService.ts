import { Configuration as FirebaseConfig, FirestoreService } from "@digitalaidseattle/firebase";
import { read, utils, WorkBook } from "xlsx";
import { Funder } from "../types";

const NAME_HEADER = "Foundation/ Funder Name";
const TYPE_HEADER = "Funder Type";
const REQUIRED_HEADERS = [NAME_HEADER, TYPE_HEADER];
const HEADER_OFFSET = 2;

export class FundersService extends FirestoreService<Funder> {


    private static instance: FundersService;

    static getInstance() {
        if (!FundersService.instance) {
            FundersService.instance = new FundersService();
        }
        return FundersService.instance;
    }


    constructor() {
        super("INSTITUTIONS", FirebaseConfig.getInstance().getClient());
    }

    empty(): Funder {
        return {
            id: null,
            type: '',
            name: "",
            description: "",
            email: "",
            phone: "",
            address: "",
            contact: "",
            created_at: new Date(),
            updated_by: "",
        }
    }

    async validateFile(file: File): Promise<{ valid: boolean, errors?: string[] }> {
        if (!file.name.toLowerCase().endsWith('.xlsx')) {
            return { valid: false, errors: [`${file.name} is not an .xlsx file`] };
        }

        let workbook: WorkBook;
        try {
            workbook = read(await file.arrayBuffer());
        } catch {
            return { valid: false, errors: [`${file.name} could not be read as a spreadsheet`] };
        }

        if (workbook.SheetNames.length !== 1) {
            return { valid: false, errors: [`Expected 1 worksheet, found ${workbook.SheetNames.length}`] };
        }

        const headers = this.readHeaders(this.readRows(workbook));
        const missing = REQUIRED_HEADERS.filter(header => !headers.includes(header));
        if (missing.length > 0) {
            return { valid: false, errors: missing.map(header => `Missing column "${header}"`) };
        }
        return { valid: true };
    }

    async extractFunders(file: File): Promise<Funder[]> {
        const rows = this.readRows(read(await file.arrayBuffer()));
        const headers = this.readHeaders(rows);
        const nameColumn = headers.indexOf(NAME_HEADER);
        const typeColumn = headers.indexOf(TYPE_HEADER);

        // keep the first row for each funder name, ignoring case
        const seen = new Set<string>();
        return rows.slice(HEADER_OFFSET + 1)
            .map(row => ({
                name: this.cellText(row[nameColumn]),
                type: this.cellText(row[typeColumn])
            }))
            .filter(({ name, type }) => name !== '' && type !== '')
            .filter(({ name }) => {
                const key = name.toLowerCase();
                if (seen.has(key)) {
                    return false;
                }
                seen.add(key);
                return true;
            })
            .map(({ name, type }) => ({ ...this.empty(), name, type }));
    }

    private readRows(workbook: WorkBook): unknown[][] {
        // header: 1 returns each row as an array of cell values
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        // blankrows: true keeps array indexes aligned with sheet rows so HEADER_OFFSET lands on the header row
        return utils.sheet_to_json<unknown[]>(worksheet, { header: 1, blankrows: true, defval: null });
    }

    private readHeaders(rows: unknown[][]): unknown[] {
        return (rows[HEADER_OFFSET] ?? []).map(h => typeof h === 'string' ? h.trim() : h);
    }

    private cellText(value: unknown): string {
        return value === null || value === undefined ? '' : String(value).trim();
    }
}
