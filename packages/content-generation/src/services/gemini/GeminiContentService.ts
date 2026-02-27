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

}
