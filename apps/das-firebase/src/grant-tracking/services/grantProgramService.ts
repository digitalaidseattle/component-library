import { Configuration as FirebaseConfig, FirestoreService } from "@digitalaidseattle/firebase";
import { read, SSF, utils, WorkBook } from "xlsx";
import { Funder, GrantProgram } from "../types";

const FUNDER_HEADER = "Foundation/ Funder Name";
const PROGRAM_HEADER = "Grant/ Program Name";
const FOCUS_AREAS_HEADER = "Primary Focus Areas";
const POPULATION_FOCUS_HEADER = "Population Focus";
const MISSION_ALIGNMENT_HEADER = "PR Mission Alignment";
const GRANT_RANGE_HEADER = "Grant Range";
// "Operationf" matches the spelling in the source spreadsheet
const OPERATIONAL_SUPPORT_HEADER = "General Operationf Support?";
const APPLICATION_CYCLE_HEADER = "Application Cycle";
const TYPICAL_DEADLINE_HEADER = "Typical Deadline";
const CURRENT_DEADLINE_HEADER = "Current cycle deadline";
const GEOGRAPHIC_SCOPE_HEADER = "Geographic Scope";
const WEBSITE_HEADER = "Website/ Portal";
const REQUIRED_HEADERS = [FUNDER_HEADER, PROGRAM_HEADER];
const HEADER_OFFSET = 2;

export class GrantProgramService extends FirestoreService<GrantProgram> {


    private static instance: GrantProgramService;

    static getInstance() {
        if (!GrantProgramService.instance) {
            GrantProgramService.instance = new GrantProgramService();
        }
        return GrantProgramService.instance;
    }


    constructor() {
        super("grant_programs", FirebaseConfig.getInstance().getClient());
    }

    empty(): GrantProgram {
        return {
            id: null,
            funder_id: null,
            name: '',
            focus_areas: [],
            population_focus: '',
            mission_alignment: '',
            grant_range: '',
            operational_support: '',
            application_cycle: '',
            typical_deadline: '',
            current_deadline: '',
            geographic_scope: '',
            website: ''
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

    // funders are matched to the funder name column (ignoring case) to set funder_id
    async extractPrograms(file: File, funders: Funder[] = []): Promise<GrantProgram[]> {
        const rows = this.readRows(read(await file.arrayBuffer()));
        const headers = this.readHeaders(rows);
        const cell = (row: unknown[], header: string) => row[headers.indexOf(header)];

        const funderIds = new Map(funders.map(funder => [funder.name.trim().toLowerCase(), funder.id]));

        // keep the first row for each funder + program name, ignoring case
        const seen = new Set<string>();
        const programs = rows.slice(HEADER_OFFSET + 1)
            .map(row => ({
                row,
                funderName: this.cellText(cell(row, FUNDER_HEADER)),
                name: this.cellText(cell(row, PROGRAM_HEADER))
            }))
            .filter(({ funderName, name }) => funderName !== '' && name !== '')
            .filter(({ funderName, name }) => {
                const key = `${funderName}|${name}`.toLowerCase();
                if (seen.has(key)) {
                    return false;
                }
                seen.add(key);
                return true;
            })
            .map(({ row, funderName, name }) => ({
                ...this.empty(),
                funder_id: funderIds.get(funderName.toLowerCase()) ?? null,
                name,
                focus_areas: this.cellText(cell(row, FOCUS_AREAS_HEADER))
                    .split(/[,;]/)
                    .map(area => area.trim())
                    .filter(area => area !== ''),
                population_focus: this.cellText(cell(row, POPULATION_FOCUS_HEADER)),
                mission_alignment: this.cellText(cell(row, MISSION_ALIGNMENT_HEADER)),
                grant_range: this.cellCurrency(cell(row, GRANT_RANGE_HEADER)),
                operational_support: this.cellText(cell(row, OPERATIONAL_SUPPORT_HEADER)),
                application_cycle: this.cellText(cell(row, APPLICATION_CYCLE_HEADER)),
                typical_deadline: this.cellDate(cell(row, TYPICAL_DEADLINE_HEADER)),
                current_deadline: this.cellDate(cell(row, CURRENT_DEADLINE_HEADER)),
                geographic_scope: this.cellText(cell(row, GEOGRAPHIC_SCOPE_HEADER)),
                website: this.cellText(cell(row, WEBSITE_HEADER))
            }));
        return programs;
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

    // numeric cells are Excel date serials; text cells (e.g. "Late April") are kept as-is
    private cellDate(value: unknown): string {
        if (typeof value !== 'number') {
            return this.cellText(value);
        }
        const { y, m, d } = SSF.parse_date_code(value);
        return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }

    // numeric cells are dollar amounts; text cells (e.g. "Up to $20,000") are kept as-is
    private cellCurrency(value: unknown): string {
        if (typeof value !== 'number') {
            return this.cellText(value);
        }
        return `$${value.toLocaleString('en-US')}`;
    }
}
