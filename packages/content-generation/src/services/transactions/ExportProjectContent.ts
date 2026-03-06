/**
 *  ExportProjectContent.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { ProjectContent } from "../types";

function getText(content: ProjectContent) {
    if (content.markdownResponse) {
        return content.markdownResponse
    }
    if (content.structuredResponse) {
        console.log(content.structuredResponse)
        return Object.entries(content.structuredResponse)
            .map((entries) => `## ${entries[0]}\n\n${entries[1]}`)
            .join("\n\n");
    }
    throw new Error('No response found.');
}

export async function exportProjectContent(content: ProjectContent): Promise<void> {

    // Create a URL for the blob
    const text = getText(content);
    const fileUrl = window.URL.createObjectURL(new Blob([text]));

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', content.name.replace(/ /g, "-") + ".md" || 'downloaded-file'); // Set the download attribute and filename

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the object URL
    window.URL.revokeObjectURL(fileUrl);
}