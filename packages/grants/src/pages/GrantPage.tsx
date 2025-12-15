/**
 *  GrantPage.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import CloseIcon from '@mui/icons-material/Close';
import {
    Box, Button, Card, CardActions, CardContent, CardHeader, Divider, Drawer,
    IconButton,
    Stack,
    TextField, Typography
} from "@mui/material";

import { LoadingContext, useHelp, useNotifications } from "@digitalaidseattle/core";
import { GeminiService } from "@digitalaidseattle/firebase";
// import { useHelp } from "@digitalaidseattle/mui";
import { GrantInputEditor, GrantOutputEditor, GrantProposals, GrantSettingsEditor } from "../components";
import {
    GrantInput,
    GrantOutput,
    GrantProposal,
    grantProposalService,
    GrantRecipe,
    grantService,
    MarkdownGenerator,
    StructuredJsonGenerator
} from "../services";

const HELP_DRAWER_WIDTH = 300;
const GrantPage: React.FC = ({ }) => {

    const { id: grantReceiptId } = useParams<string>();
    const { showHelp, setShowHelp } = useHelp();
    const navigate = useNavigate();
    const notifications = useNotifications();

    const { loading, setLoading } = useContext(LoadingContext);
    const [grantRecipe, setGrantRecipe] = useState<GrantRecipe>(grantService.empty());
    const [proposals, setProposals] = useState<GrantProposal[]>([]);
    const [disabled, setDisabled] = useState<boolean>(false);

    useEffect(() => {
        fetchData(grantReceiptId!);
    }, [grantReceiptId]);

    useEffect(() => {
        setDisabled(!proposals || proposals.length > 0);
    }, [proposals]);

    async function fetchData(grantReceiptId: string) {
        if (grantReceiptId && grantReceiptId !== '@new') {
            grantService.getById(grantReceiptId)
                .then((proposal) => { setGrantRecipe(proposal ?? grantService.empty()) })
                .catch(err => console.log('error', grantReceiptId, err));
            // TODO sort by date descending
            grantProposalService.findByGrantRecipeId(grantReceiptId)
                .then(proposals => setProposals(proposals))
        } else {
            const newRecipe = grantService.empty();
            updateRecipe(newRecipe)
                .then(updated => setGrantRecipe(updated))
        }
    }

    async function generateMarkdown() {
        setLoading(true);
        try {
            const geminiService = new GeminiService(grantRecipe.modelType);
            const markdownGenerator = new MarkdownGenerator(geminiService);
            await markdownGenerator.generate(grantRecipe)
            fetchData(grantRecipe.id as string);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false)
        }
    }

    async function generateStuctured() {
        setLoading(true);
        try {
            if (grantRecipe.outputParameters.length === 0) {
                // TODO throw exception
                alert("Please select at least one output field.");
                return;
            }
            const geminiService = new GeminiService(grantRecipe.modelType);
            const structureJsonGenerator = new StructuredJsonGenerator(geminiService);
            await structureJsonGenerator.generate(grantRecipe)
            fetchData(grantRecipe.id as string);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false)
        }
    }

    function saveRecipe() {
        if (grantRecipe.id) {
            grantService.update(grantRecipe.id, grantRecipe)
                .then(resp => {
                    setGrantRecipe(resp);
                    notifications.success('Proposal saved.')
                })
        } else {
            grantService.insert(grantRecipe)
                .then(resp => navigate(`/grant-proposal/${resp.id}`))
                .catch(err => console.error(err))
        }
    }

    async function updateRecipe(grantRecipe: GrantRecipe) {
        const geminiService = new GeminiService(grantRecipe.modelType);
        const prompt = grantService.createPrompt(grantRecipe);
        const tokenCount = await geminiService.calcTokenCount(grantRecipe.modelType, prompt);
        const updated = {
            ...grantRecipe,
            tokenCount: tokenCount,
            prompt: prompt
        }
        return updated
    }

    function handleSettingsChange(changed: GrantRecipe) {
        updateRecipe(changed)
            .then(updated => setGrantRecipe(updated))
    }

    function handleInputChange(newParams: GrantInput[]) {
        updateRecipe({ ...grantRecipe, inputParameters: newParams })
            .then(updated => setGrantRecipe(updated))
    }

    function handleOutputChange(newParams: GrantOutput[]) {
        updateRecipe({ ...grantRecipe, outputParameters: newParams })
            .then(updated => setGrantRecipe(updated))
    }

    return (
        <Box gap={4}>
            <Stack sx={{ gap: 2, marginRight: `${showHelp ? HELP_DRAWER_WIDTH : 0}px` }}>
                <Card sx={{ flexGrow: 1, padding: 2, gap: 1, display: 'flex', flexDirection: 'column' }}>
                    <GrantSettingsEditor
                        grantRecipe={grantRecipe}
                        onChange={handleSettingsChange} />
                    <GrantInputEditor
                        disabled={disabled}
                        parameters={grantRecipe.inputParameters ?? []}
                        onChange={handleInputChange}
                    />
                    <GrantOutputEditor
                        disabled={disabled}
                        parameters={grantRecipe.outputParameters ?? []}
                        onChange={handleOutputChange}
                    />
                    <Card>
                        <CardHeader title="Prompt"
                            action={<Typography>Token count = {grantRecipe.tokenCount}</Typography>} />
                        <CardContent>
                            <TextField
                                id="prompt"
                                fullWidth
                                multiline={true}
                                rows={6}
                                value={grantRecipe.prompt}
                                disabled={true}
                            />
                        </CardContent>
                    </Card>
                    <CardActions>
                        <Stack direction="row" gap={1} justifyContent="flex-start">
                            <Button
                                variant="outlined"
                                size="medium"
                                disabled={disabled || loading}
                                onClick={saveRecipe}>Save</Button>
                            <Divider orientation="vertical" flexItem />
                            <Button
                                variant="outlined"
                                size="medium"
                                disabled={loading}
                                onClick={generateMarkdown}>Generate Markdown</Button>
                            <Button
                                variant="outlined"
                                size="medium"
                                disabled={loading}
                                onClick={generateStuctured}>Generate Structured Output</Button>
                        </Stack>
                    </CardActions>
                </Card>
                {proposals.length > 0 &&
                    <GrantProposals
                        proposals={proposals}
                        onChange={() => fetchData(grantRecipe.id as string)} />}
            </Stack>
            <Drawer
                anchor={'right'}
                open={showHelp}
                sx={{
                    width: HELP_DRAWER_WIDTH,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: HELP_DRAWER_WIDTH, boxSizing: 'border-box' },
                }}
                variant="persistent"
            >
                <Stack marginTop={8}>
                    <Box sx={{ justifyContent: 'flex-end' }}>
                        <IconButton color="primary"
                            aria-label="Hide Help"
                            onClick={() => setShowHelp(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ overflow: 'auto' }}>
                        <Typography>HELP</Typography>
                    </Box>
                </Stack>
            </Drawer>
        </Box >
    );
}

export { GrantPage };
