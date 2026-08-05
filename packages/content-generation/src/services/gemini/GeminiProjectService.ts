/**
 * GeminiProjectService.ts
 * 
 * @copyright Digital Aid Seattle 2026
 */

import { FirestoreService } from "@digitalaidseattle/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Project } from "../types";
import { Configuration } from "./Configuration";
import { ProjectService } from "../Configuration";

export class GeminiProjectService extends FirestoreService<Project> implements ProjectService {

  private static instance: GeminiProjectService;

  static getInstance() {
    if (!GeminiProjectService.instance) {

      GeminiProjectService.instance = new GeminiProjectService();
    }
    return GeminiProjectService.instance;
  }

  constructor() {
    super("projects", Configuration.getInstance().firebaseApp);
  }

  mapJson(json: any): Project {
    return json;
  }

  /**
   * Creates a blank project with default values.
   */
  empty(): Project {
    const now = new Date();

    return {
      id: undefined,
      created_at: undefined,
      created_by: undefined,
      updated_at: undefined,
      updated_by: undefined,
      name: "",
      tags: [],
      rating: 0,
      template: "",
      prompt: "",
      contexts: [],
      outputs: [],
      tokenCount: 0,
      modelType: "gemini-2.5-flash",
    };
  }

  async findByName(name: string): Promise<Project[]> {
    const docRef = collection(this.db, this.collectionName);
    const nameQuery = query(docRef, where('name', '==', name));
    const querySnapshot = await getDocs(nameQuery);
    const projects: Project[] = [];
    querySnapshot.forEach((doc: any) => {
      projects.push(doc.data() as Project);
    });
    return projects;
  }
}
