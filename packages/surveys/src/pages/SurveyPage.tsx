/**
 *  SurveyPage.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import React, { useContext, useEffect, useState } from "react";

import {
    Typography
} from "@mui/material";

import { LoadingContext } from "@digitalaidseattle/core";
import { SurveyCard } from "../components";
import { Survey, SurveyService } from "../services";

const SurveyPage: React.FC = ({ }) => {
    const { loading, setLoading } = useContext(LoadingContext);

    const [survey, setSurvey] = useState<Survey>();

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        setSurvey(SurveyService.instance().empty())
        setLoading(false);
    }

    return <>
        {loading && <Typography>I'm loading</Typography>}
        {survey && <SurveyCard survey={survey} />}
    </>
}

export { SurveyPage };
