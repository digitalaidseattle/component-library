# AiService Documentation

`AiService` defines the AI contract used by the content-generation module.

Source: [contentGenerationServices.ts](/Users/nakasones/OpenSeattle/component-library/packages/content-generation/src/services/contentGenerationServices.ts)

## Interface

```ts
export interface AiService {
  getModels(): string[];
  query(prompt: string, modelType?: string, contexts?: ProjectContext[]): Promise<any>;
  createParts(contexts: ProjectContext[]): Part[];
  createSchema(schemaParams: string[]): any;
  parameterizedQuery(prompt: string, schemaParams: string[], modelType?: string, contexts?: ProjectContext[]): Promise<any>;
  calcTokenCount(model: string, content: string): Promise<number>;
  calcFileTokenCount(model: string, file: File): Promise<number>;
  calcStorageFileTokenCount(model: string, file: StorageFile): Promise<number>;
  generatePrompt(project: Project): string;
}
```

## Method Reference

| Method | Purpose | Inputs | Returns |
|---|---|---|---|
| `getModels()` | List supported model ids. | none | `string[]` |
| `query(...)` | Run a free-form prompt against a model, optionally with project contexts. | `prompt`, optional `modelType`, optional `contexts` | Provider-specific response (`Promise<any>`) |
| `createParts(contexts)` | Convert `ProjectContext[]` into model-ready multipart payload items. | `contexts` | `Part[]` |
| `createSchema(schemaParams)` | Build a JSON schema object used for structured generation. | `schemaParams` | Schema object (`any`) |
| `parameterizedQuery(...)` | Request structured output using a schema (for example named sections). | `prompt`, `schemaParams`, optional `modelType`, optional `contexts` | Provider-specific response (`Promise<any>`) |
| `calcTokenCount(...)` | Count tokens for plain text content. | `model`, `content` | `Promise<number>` |
| `calcFileTokenCount(...)` | Count tokens for a browser `File` upload. | `model`, `file` | `Promise<number>` |
| `calcStorageFileTokenCount(...)` | Count tokens for a file already in storage (via `StorageFile`). | `model`, `file` | `Promise<number>` |
| `generatePrompt(project)` | Build the final prompt string from project template + output constraints. | `project` | `string` |

## Data Expectations

`ProjectContext` values are used in two modes:

- Text context: `type: "text"` and `value` contains the content.
- File context: `type` is a MIME type, and file metadata (`name`, `fileUrl` and/or provider path) is used by the implementation to attach file content.

## Usage

```ts
import { getContentGenerationServices } from "@digitalaidseattle/content-generation";

const aiService = getContentGenerationServices().aiService;
const model = aiService.getModels()[0];

const prompt = "Write a one paragraph grant summary.";
const response = await aiService.query(prompt, model);
```

Structured output:

```ts
const fields = ["Summary", "Budget", "Timeline"];
const structured = await aiService.parameterizedQuery(
  "Return a concise project plan.",
  fields,
  model
);
```

Token counting:

```ts
const tokenCount = await aiService.calcTokenCount(model, "Hello world");
```

## Notes for Implementers

- Keep `getModels()` stable and deterministic so UI model pickers remain predictable.
- `query` and `parameterizedQuery` return provider-specific payloads today (`any`), so callers should parse response content explicitly.
- `generatePrompt(project)` should be pure and side-effect free.
