import { FirestoreService } from "@digitalaidseattle/firebase";
import dayjs from "dayjs";
import Handlebars from "handlebars";
import { GrantRecipe } from "./types";


class GrantService extends FirestoreService<GrantRecipe> {

    constructor() {
        super("GRANT-RECIPES");
    }

    empty(): GrantRecipe {
        const now = new Date();
        const recipe = {
            id: "",
            createdAt: now,
            createdBy: '',
            updatedAt: now,
            updatedBy: '',
            description: "New Proposal " + dayjs(now).format("YYYY-MM-D"),
            template: "Create a grant proposal including the following information:\n {{#each inputs}}{{key}} = {{value}},\n{{/each}}"
                + " where{{#each outputs}}{{#unless @first}} and{{/unless}} the {{name}} is constrained by a maximum {{maxSymbols}} of {{unit}} {{/each}}.",
            inputParameters: [
                { key: "to", value: 'Microsoft Philanthropy' },
                { key: "from", value: 'Digital Aid Seattle' }
            ],
            outputParameters: [
                { name: 'description', maxSymbols: 500, unit: 'words' },
                { name: 'usage', maxSymbols: 500, unit: 'words' }
            ],
            prompt: "",
            tokenCount: 0,
            modelType: '',
            enableContext: false,
            context: ''
        } as GrantRecipe
        return recipe;
    }

    createPrompt(grantRecipe: GrantRecipe): string {
        var template = Handlebars.compile(grantRecipe.template);
        return template({
            inputs: grantRecipe.inputParameters,
            outputs: grantRecipe.outputParameters
        });
    }

}


const grantService = new GrantService();
export { grantService };

