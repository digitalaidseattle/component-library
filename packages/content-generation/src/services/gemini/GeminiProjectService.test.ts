import { describe, vi } from "vitest";

describe("GeminiProjectService", () => {

  vi.mock('../api/grantAiService', () => ({
    geminiService: ({
      calcTokenCount: () => { }
    }),
  }));

  // it("updatePrompt", () => {
  //   setContentGenerationServices(
  //     {
  //       grantRecipeService: {
  //         calcTokenCount() { }
  //       },
  //     } as unknown as ContentGenerationServices
  //   )

  //   const project = {
  //     modelType: 'GEMINI',
  //     prompt: "Create a grant proposal including the following information:",
  //     inputParameters: []
  //   } as unknown as Project;

  //   const tokenSpy = vi.spyOn(getContentGenerationServices().aiService, "calcTokenCount").mockResolvedValue(5);

  //   getContentGenerationServices().projectService.updatePrompt(project)
  //     .then(updated => {
  //       expect(tokenSpy).toBeCalledWith("GEMINI", "Create a grant proposal including the following information:[]");
  //       expect(updated.tokenCount).toBe(5)
  //     })
  // })

});