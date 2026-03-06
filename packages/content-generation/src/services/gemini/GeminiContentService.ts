import { FirestoreService } from "@digitalaidseattle/firebase";
import { ProjectContentService } from "../contentGenerationServices";
import { ProjectContent } from "../types";

export class GeminiContentService extends FirestoreService<ProjectContent> implements ProjectContentService {
  constructor() {
    super("content");
  }

  // Default shape for a new proposal
  empty(): ProjectContent {
    const now = new Date();
    return {
      id: undefined,
      created_at: now,
      created_by: "",
      updated_at: now,
      updated_by: "",
      projectId: "",
      name: "",
      rating: null,
      structuredResponse: undefined,
      totalTokenCount: null,
      model: ""
    };
  }


  async export(content: ProjectContent): Promise<void> {

    // Create a URL for the blob
    const text = this.getText(content);
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

  getText(content: ProjectContent) {
    if (content.markdownResponse) {
      return content.markdownResponse
    }
    if (content.structuredResponse) {
      return Object.entries(content.structuredResponse)
        .map((entries) => `## ${entries[0]}\n\n${entries[1]}`)
        .join("\n\n");
    }
    throw new Error('No response found.');
  }

}
