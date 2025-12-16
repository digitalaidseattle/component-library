// src/models/CreatorModel.ts

/* ================================
 * Chapter + Element Types
 * ================================ */

export type ChapterId = "cover" | "reader";

export type CreatorElement =
  | {
      type: "title";
      value: string;
    }
  | {
      type: "blurb";
      value: string;
    }
  | {
      type: "participantField";
      fieldType: "name" | "email" | "address";
      label: string;
      required: boolean;
    };

export type CreatorChapter = {
  id: ChapterId;
  title: string;
  elements: CreatorElement[];
};

export type CreatorModel = {
  chapters: CreatorChapter[];
  activeChapterId: ChapterId;
};

/* ================================
 * Element factories (IMPORTANT)
 * ================================ */

function createTitleElement(): CreatorElement {
  return {
    type: "title",
    value: "",
  };
}

function createBlurbElement(): CreatorElement {
  return {
    type: "blurb",
    value: "",
  };
}

function createParticipantElement(
  fieldType: "name" | "email" | "address"
): CreatorElement {
  return {
    type: "participantField",
    fieldType,
    label:
      fieldType === "name"
        ? "Your name"
        : fieldType === "email"
        ? "Email address"
        : "Mailing address",
    required: true,
  };
}

/* ================================
 * Commands
 * ================================ */

export type CreatorCommand =
  | { type: "ADD_TITLE" }
  | { type: "ADD_BLURB" }
  | {
      type: "ADD_PARTICIPANT";
      fieldType: "name" | "email" | "address";
    }
  | {
      type: "FOCUS_CHAPTER";
      chapterId: ChapterId;
    };

/* ================================
 * Initial Model
 * ================================ */

export function createInitialCreatorModel(): CreatorModel {
  const chapters: CreatorChapter[] = [
    {
      id: "cover",
      title: "Chapter 0 · Cover",
      elements: [],
    },
    {
      id: "reader",
      title: "Chapter 1 · The reader steps in",
      elements: [],
    },
  ];

  return {
    activeChapterId: "cover",
    chapters,
  };
}

/* ================================
 * Reducer
 * ================================ */

export function applyCreatorCommand(
  model: CreatorModel,
  command: CreatorCommand
): CreatorModel {
  // Focus change does not touch elements
  if (command.type === "FOCUS_CHAPTER") {
    return {
      ...model,
      activeChapterId: command.chapterId,
    };
  }

  const chapters = model.chapters.map((chapter) => {
    if (chapter.id !== model.activeChapterId) {
      return chapter;
    }

    switch (command.type) {
      case "ADD_TITLE": {
        if (chapter.elements.some((e) => e.type === "title")) {
          return chapter;
        }

        return {
          ...chapter,
          elements: [
            ...chapter.elements,
            createTitleElement(),
          ],
        };
      }

      case "ADD_BLURB": {
        if (chapter.elements.some((e) => e.type === "blurb")) {
          return chapter;
        }

        return {
          ...chapter,
          elements: [
            ...chapter.elements,
            createBlurbElement(),
          ],
        };
      }

      case "ADD_PARTICIPANT": {
        if (
          chapter.elements.some(
            (e) =>
              e.type === "participantField" &&
              e.fieldType === command.fieldType
          )
        ) {
          return chapter;
        }

        return {
          ...chapter,
          elements: [
            ...chapter.elements,
            createParticipantElement(command.fieldType),
          ],
        };
      }

      default:
        return chapter;
    }
  });

  return {
    ...model,
    chapters,
  };
}