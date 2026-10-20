/**
 * projects/index.tsx
 * Example of firestore
*/


import React from "react";


import { UploadCard } from "../../../components/UploadCard";
import { GrantProgramService } from "../../services/grantProgramService";



type FileValidation = { valid: boolean, errors?: string[] };

export const UploadProgramsCard: React.FC = ({ }) => {
    const service = GrantProgramService.getInstance();

    async function handleValidation(files: File[]): Promise<FileValidation[]> {
        return Promise.all(files.map(file =>
            service.validateFile(file)
                .catch((err: Error): FileValidation => ({ valid: false, errors: [err.message] }))
        ));
    }

    async function handleSubmit(files: File[]): Promise<string> {
        let count = 0;
        for (let file of files) {
            const existings = await service.getAll();
            // program names are matched ignoring case and surrounding spaces, as in extractFunders
            const knownNames = new Set(existings.map(program => program.name.trim().toLowerCase()));
            const newPrograms = (await service.extractPrograms(file))
                .filter(program => !knownNames.has(program.name.toLowerCase()));
            console.log('newPrograms', knownNames, newPrograms)
            // also skip names already taken from an earlier file in this upload
            newPrograms.forEach(program => knownNames.add(program.name.toLowerCase()));
            await service.batchInsert(newPrograms);
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
