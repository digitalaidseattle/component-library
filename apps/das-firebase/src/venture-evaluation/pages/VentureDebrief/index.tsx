/**
 * VentureDebrief/index.tsx
 * Create or edit a venture evaluation debrief, following resources/venture_eval_card.md
 */

import { HomeOutlined } from "@ant-design/icons";
import {
    Box,
    Breadcrumbs,
    Button,
    IconButton,
    Stack,
    Typography
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { NavLink, useNavigate, useParams } from "react-router-dom";

import { HelpTopicContext, LoadingContext, useHelp, useNotifications } from "@digitalaidseattle/core";
import { HelpDrawer } from "@digitalaidseattle/mui";
import { ProjectHelpUtils } from "../../services/ProjectHelpUtils";
import { VentureDao } from "../../services/VentureDao";
import { VentureDebriefService } from "../../services/VentureDebriefService";
import { Venture, VentureDebrief } from "../../types";
import { DebriefForm } from "./DebriefForm";

const helpFilePath = './debrief.md'

export const VentureDebriefPage: React.FC = () => {
    const debriefService = VentureDebriefService.getInstance();
    const ventureDao = VentureDao.getInstance();

    const { showHelp } = useHelp();
    const [helpTopic, setHelpTopic] = useState<string | undefined>('default');

    const notifications = useNotifications();
    const navigate = useNavigate();
    const { id } = useParams();
    const isNew = id === 'new';

    const { setLoading } = useContext(LoadingContext);

    const [ventures, setVentures] = useState<Venture[]>([]);
    const [debriefs, setDebriefs] = useState<VentureDebrief[]>([]);

    const form = useForm<VentureDebrief>({
        defaultValues: debriefService.empty()
    });
    const {
        handleSubmit,
        reset,
        watch,
        formState: { isDirty, isSubmitting },
    } = form;

    const ventureName = watch('venture_name');

    useEffect(() => {
        if (!id) {
            return;
        }
        let active = true;
        setLoading(true);
        Promise.all([
            ventureDao.getAll(),
            debriefService.getAll(),
            isNew ? Promise.resolve(debriefService.empty()) : debriefService.getById(id)
        ])
            .then(([allVentures, allDebriefs, found]) => {
                if (active) {
                    setVentures(allVentures);
                    setDebriefs(allDebriefs.map(debrief => debriefService.normalize(debrief)));
                    reset(isNew ? found : debriefService.normalize({ ...found, id }));
                }
            })
            .catch(err => {
                notifications.error('Error fetching venture debrief.');
                console.error('Error fetching venture debrief:', err);
            })
            .finally(() => setLoading(false));
        return () => { active = false; };
    }, [id]);

    const onSubmit: SubmitHandler<VentureDebrief> = async (data: VentureDebrief) => {
        try {
            const saved = await debriefService.save(data);
            notifications.success(isNew ? 'Venture debrief added!' : 'Venture debrief updated!');
            if (isNew) {
                navigate(`../${saved.id}`, { relative: 'path', replace: true });
            } else {
                reset(debriefService.normalize(saved));
            }
        }
        catch (err) {
            console.error('Could not save venture debrief', err);
            notifications.error('Sorry there was an error: ' + (err as Error).message);
        }
    }

    const title = isNew ? 'New Venture Debrief' : (ventureName || 'Venture Debrief');

    const saveButtons = (
        <Stack direction="row" gap={1}>
            <Button
                variant="outlined"
                sx={{ color: 'text.secondary' }}
                disabled={!isDirty || isSubmitting}
                onClick={() => isNew ? navigate('..', { relative: 'path' }) : reset()}>
                {isNew ? 'Cancel' : 'Discard changes'}
            </Button>
            <Button
                variant="contained"
                disabled={!isDirty || isSubmitting}
                onClick={handleSubmit(onSubmit)}>
                Save
            </Button>
        </Stack>
    );

    return (
        <HelpTopicContext.Provider value={{ helpTopic, setHelpTopic }} >
            <Stack gap={2}>
                <Breadcrumbs aria-label="breadcrumb">
                    <NavLink to="/" ><IconButton size="medium"><HomeOutlined /></IconButton></NavLink>
                    <NavLink to=".." relative='path'>Venture Debriefs</NavLink>
                    <Typography color="text.primary">{title}</Typography>
                </Breadcrumbs>
                <Box gap={4}>
                    <Stack sx={{
                        height: "calc(100dvh - 112px)",
                        gap: 2,
                        marginRight: `${showHelp ? ProjectHelpUtils.DRAWER_WIDTH : 0}px`
                    }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="h3">{title}</Typography>
                            {saveButtons}
                        </Stack>
                        <Typography variant="body2" fontStyle="italic" color="text.secondary">
                            Fill this out at the close of every venture evaluation. Target: 30–45 minutes to complete.
                            Keep it skimmable, not exhaustive.
                        </Typography>

                        <DebriefForm form={form} ventures={ventures} debriefs={debriefs} debriefId={id} />

                        <Stack direction="row" justifyContent="flex-end">
                            {saveButtons}
                        </Stack>
                    </Stack>
                    <HelpDrawer
                        helpFilePath={helpFilePath}
                        title={ProjectHelpUtils.title}
                        width={ProjectHelpUtils.DRAWER_WIDTH}
                        dictionary={ProjectHelpUtils.dictionary} />
                </Box>
            </Stack>
        </HelpTopicContext.Provider>
    );
}
