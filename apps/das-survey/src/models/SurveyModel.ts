// src/models/SurveyModel.ts

/**
 * High-level survey model
 */
export type Survey = {
  id: string;
  title: string;
  chapters: Chapter[];
};

/**
 * A chapter represents a stage in the survey story.
 * Right now, we only support the "intro" chapter.
 */
export type Chapter = IntroChapter;

/**
 * Introductory chapter:
 * - Introduces the survey
 * - Collects participant identity info
 */
export type IntroChapter = {
  type: "intro";
  surveyIntro: SurveyIntroSection;
  participantIntro: ParticipantIntroSection;
};

/* ----------------------------------------
 * Survey introduction (creator-facing)
 * ------------------------------------- */

export type SurveyIntroSection = {
  title?: TextBlock;
  description?: TextBlock;
};

/**
 * Simple text block
 */
export type TextBlock = {
  type: "text";
  value: string;
};

/* ----------------------------------------
 * Participant introduction
 * ------------------------------------- */

export type ParticipantIntroSection = {
  fields: ParticipantField[];
};

/**
 * Supported participant identity fields
 */
export type ParticipantField =
  | NameField
  | EmailField
  | AddressField;

export type NameField = {
  type: "name";
  label: string;
  required: boolean;
};

export type EmailField = {
  type: "email";
  label: string;
  required: boolean;
};

export type AddressField = {
  type: "address";
  label: string;
  required: boolean;
};