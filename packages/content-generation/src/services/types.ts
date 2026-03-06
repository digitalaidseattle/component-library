/**
 * types.ts
 */

import { Entity, Identifier } from "@digitalaidseattle/core";

export type ProjectOutput = {
  name: string;
  maxWords: number;
  unit: 'words' | 'characters';
}

export type ProjectContext = {
  type: string;
  name: string | null;
  value: string | null;
  tokenCount: number;
  file?: File;
  fileUrl?: string;
}

export type Project = Entity & {
  name: string;
  rating: number;
  tags: string[];
  template: string;
  prompt: string;
  contexts: ProjectContext[];
  outputs: ProjectOutput[];
  tokenCount: number;
  modelType: string; // "gemini-2.5-flash", etc.
};

export type ProjectContent = Entity & {
  projectId: Identifier;
  name: string;
  rating: number | null;
  structuredResponse?: { [key: string]: string };
  markdownResponse?: string;
  totalTokenCount: number | null;
  model: string;
};
