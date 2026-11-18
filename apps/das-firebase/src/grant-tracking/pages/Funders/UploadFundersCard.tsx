/**
 * projects/index.tsx
 * Example of firestore
*/


import React from "react";


import { FileValidation, UploadCard } from "../../../components/UploadCard";
import { FundersService } from '../../services/fundersService';


export const UploadFundersCard: React.FC = ({ }) => {
    const fundersService = FundersService.getInstance();

    async function handleValidation(files: File[]): Promise<FileValidation[]> {
        return Promise.all(files.map(file =>
            fundersService.validateFile(file)
                .catch((err: Error): FileValidation => ({ valid: false, errors: [err.message] }))
        ));
    }

    async function handleSubmit(files: File[]): Promise<string> {
        let count = 0;
        for (let file of files) {
            const existings = await fundersService.getAll();
            // funder names are matched ignoring case and surrounding spaces, as in extractFunders
            const knownNames = new Set(existings.map(funder => funder.name.trim().toLowerCase()));
            const newFunders = (await fundersService.extractFunders(file))
                .filter(funder => !knownNames.has(funder.name.toLowerCase()));
            // also skip names already taken from an earlier file in this upload
            newFunders.forEach(funder => knownNames.add(funder.name.toLowerCase()));
            await fundersService.batchInsert(newFunders);
            count = count + newFunders.length;
        };
        return `${count} funders added.`;
    }


    return (
        <UploadCard
            onValidate={handleValidation}
            onSubmit={handleSubmit} />
    );
}
