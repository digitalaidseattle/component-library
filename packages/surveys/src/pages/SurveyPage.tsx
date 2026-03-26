import React from "react";
import { SurveyDefinition } from "../services";
import { SurveyForm } from "../components";

const SurveyPage: React.FC<{ definition: SurveyDefinition }> = ({ definition }) => {
    return <SurveyForm definition={definition} />;
};

export { SurveyPage };
