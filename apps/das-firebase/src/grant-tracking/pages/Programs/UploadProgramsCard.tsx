/**
 * projects/index.tsx
 * Example of firestore
*/


import React from "react";


import { UploadCard } from "../../../components/UploadCard";
import { GrantProgramService } from "../../services/grantProgramService";
import { FundersService } from "../../services/fundersService";



type FileValidation = { valid: boolean, errors?: string[] };

export const UploadProgramsCard: React.FC = ({ }) => {
    const programService = GrantProgramService.getInstance();
    const fundersService = FundersService.getInstance();

    async function handleValidation(files: File[]): Promise<FileValidation[]> {
        return Promise.all(files.map(file =>
            programService.validateFile(file)
                .catch((err: Error): FileValidation => ({ valid: false, errors: [err.message] }))
        ));
    }

    async function handleSubmit(files: File[]): Promise<string> {
        const funders = await fundersService.getAll();
        let count = 0;
        for (let file of files) {
            const existings = await programService.getAll();
            // program names are matched ignoring case and surrounding spaces, as in extractFunders
            const knownNames = new Set(existings.map(program => program.name.trim().toLowerCase()));
            const newPrograms = (await programService.extractPrograms(file, funders))
                .filter(program => !knownNames.has(program.name.toLowerCase()));
            console.log('newPrograms', knownNames, newPrograms)
            // also skip names already taken from an earlier file in this upload
            newPrograms.forEach(program => knownNames.add(program.name.toLowerCase()));
            await programService.batchInsert(newPrograms);
            count = count + newPrograms.length;
        };
        return `${count} programs added.`;
    }


    return (
        <UploadCard
            onValidate={handleValidation}
            onSubmit={handleSubmit} />
    );
}
