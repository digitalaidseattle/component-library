import { Configuration as FirebaseConfig, FirestoreService } from "@digitalaidseattle/firebase";
import { VentureDebrief } from "../types";

export class VentureDebriefService extends FirestoreService<VentureDebrief> {

    private static instance: VentureDebriefService;

    static getInstance() {
        if (!VentureDebriefService.instance) {
            VentureDebriefService.instance = new VentureDebriefService();
        }
        return VentureDebriefService.instance;
    }

    constructor() {
        super("venture_debriefs", FirebaseConfig.getInstance().getClient());
    }

    empty(): VentureDebrief {
        return {
            id: null,
            venture_name: '',
            program_id: null,
            evaluation_date: new Date().toISOString().substring(0, 10),
            evaluators: [],
            sign_off: { uxr: false, pdm: false, sa: false },
            domain: '',
            capability_area: '',
            tech_stack: [],
            solution_type: '',
            outcome: '',
            problem_statement: '',
            recommendation: '',
            rationale: [''],
            decisions: [{ decision: '', alternative: '', rationale: '' }],
            debrief_links: [''],
            artifacts: [{ name: '', type: '', link: '' }],
            searched_repository: '',
            search_minutes: null,
            past_evaluation_existed: '',
            past_evaluations_reviewed: '',
            applicable: '',
            applicability_notes: '',
            tags: []
        }
    }

    // fills fields missing from older documents and drops blank list entries
    normalize(debrief: VentureDebrief): VentureDebrief {
        const merged = { ...this.empty(), ...debrief };
        return {
            ...merged,
            rationale: merged.rationale.filter(text => text.trim()),
            debrief_links: merged.debrief_links.filter(link => link.trim()),
            decisions: merged.decisions.filter(d => d.decision.trim() || d.alternative.trim() || d.rationale.trim()),
            artifacts: merged.artifacts.filter(a => a.name.trim() || a.type.trim() || a.link.trim())
        }
    }

    async save(debrief: VentureDebrief): Promise<VentureDebrief> {
        const { id, ...fields } = this.normalize(debrief);
        if (id) {
            await this.update(id, { ...fields, updated_at: new Date() } as Partial<VentureDebrief>);
            return { ...fields, id } as VentureDebrief;
        }
        return this.insert({ ...fields, created_at: new Date() } as VentureDebrief);
    }
}
