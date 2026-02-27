import { FirestoreService } from "@digitalaidseattle/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { ProjectService } from "../contentGenerationServices";
import { Project } from "../types";


export class GeminiProjectService extends FirestoreService<Project> implements ProjectService {

  constructor() {
    super("projects");
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
      template: "Create a grant proposal",
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
