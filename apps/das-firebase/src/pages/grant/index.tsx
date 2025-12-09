/**
 * projects/grants.tsx
*/

import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import CloseIcon from '@mui/icons-material/Close';
import {
    Box, Button, Card, CardContent, CardHeader, Divider, Drawer, Grid, IconButton, MenuItem,
    Select, Stack, Switch, Tab, Tabs, TextField, Typography
} from "@mui/material";

import { LoadingContext } from "@digitalaidseattle/core";
import { GeminiService } from "../../api/geminiService";
import { GrantOutputEditor } from "./GrantOutputEditor";
import { grantProposalService } from "../../api/grants/grantProposalService";
import { grantService } from "../../api/grants/grantService";
import { MarkdownGenerator } from "../../api/grants/markdownGenerator";
import { StructureJsonGenerator } from "../../api/grants/structureJsonGenerator";
import { GrantInput, GrantOutput, GrantProposal, GrantRecipe } from "../../api/grants/types";
import { useHelp } from "../../components/HelpContext";
import { InputParametersEditor } from "./InputParametersEditor";
import { ProposalCard } from "./ProposalCard";

const HELP_DRAWER_WIDTH = 300;
const GrantPage: React.FC = ({ }) => {

    const { id: grantReceiptId } = useParams<string>();
    const { showHelp, setShowHelp } = useHelp();
    const navigate = useNavigate();

    const { loading, setLoading } = useContext(LoadingContext);
    const models = GeminiService.getModels();

    const [grantRecipe, setGrantRecipe] = useState<GrantRecipe>(grantService.empty());
    const [disabled, setDisabled] = useState<boolean>(false);
    const [proposals, setProposals] = useState<GrantProposal[]>([]);
    const [activeTab, setActiveTab] = useState<number>(0);

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
            grantProposalService.findByGrantRecipeId(grantReceiptId)
                .then(proposals => setProposals(proposals))
        } else {
            const newRecipe = grantService.empty();
            newRecipe.modelType = models[0];
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
            const structureJsonGenerator = new StructureJsonGenerator(geminiService);
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
                .then(resp => setGrantRecipe(resp))
        } else {
            grantService.insert(grantRecipe)
                .then(resp => navigate(`/grant-proposal/${resp.id}`))
                .catch(err => console.error(err))
        }
    }

    function handleChangeDescription(event: React.ChangeEvent<HTMLInputElement>) {
        setGrantRecipe({
            ...grantRecipe,
            description: event?.target.value
        })
    }

    async function updateRecipe(grantRecipe: GrantRecipe) {
        const geminiService = new GeminiService(grantRecipe.modelType);
        const prompt = grantService.createPrompt(grantRecipe);
        const tokenCount = await geminiService.calcTokenCount(prompt);
        const updated = {
            ...grantRecipe,
            tokenCount: tokenCount,
            prompt: prompt
        }
        return updated
    }

    async function handleChangeTemplate(newTemplate: string) {
        updateRecipe({ ...grantRecipe, template: newTemplate })
            .then(updated => setGrantRecipe(updated))
    }

    function handleChangeContext(newContext: string) {
        updateRecipe({ ...grantRecipe, context: newContext })
            .then(updated => setGrantRecipe(updated))
    }

    function handleChangeModel(newModel: string) {
        // TODOverify  changing model should not change counts?
        updateRecipe({ ...grantRecipe, modelType: newModel })
            .then(updated => setGrantRecipe(updated))
    }

    function toggleEnableContext() {
        setGrantRecipe({
            ...grantRecipe,
            enableContext: !grantRecipe.enableContext
        })
    }

    function handleInputChange(newParams: GrantInput[]) {
        updateRecipe({ ...grantRecipe, inputParameters: newParams })
            .then(updated => setGrantRecipe(updated))
    }

    function handleOutputChange(newParams: GrantOutput[]) {
        updateRecipe({ ...grantRecipe, outputParameters: newParams })
            .then(updated => setGrantRecipe(updated))
    }

    function getCreatedDateTimeString(proposal: GrantProposal): string {
        const cDate = new Date((proposal.createdAt as any).seconds * 1000);
        return cDate.toLocaleString();
    }

    function a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const handleChangeProposal = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    return (
        <Stack gap={4}>
            <Box sx={{ marginRight: `${showHelp ? HELP_DRAWER_WIDTH : 0}px` }}>
                <Card sx={{ flexGrow: 1, padding: 2, gap: 1, display: 'flex', flexDirection: 'column' }}>
                    <Card>
                        <CardHeader title="Settings"
                            action={<Typography>Token count = {grantRecipe.tokenCount}</Typography>} />
                        <CardContent>
                            <Grid container spacing={2} >
                                <Grid size={2}>
                                    Description:
                                </Grid>
                                <Grid size={10}>
                                    <TextField
                                        fullWidth
                                        value={grantRecipe.description}
                                        onChange={handleChangeDescription}></TextField>
                                </Grid>
                                <Grid size={2}>
                                    Model:
                                </Grid>
                                <Grid size={10}>
                                    <Select
                                        fullWidth
                                        value={grantRecipe.modelType ?? ''}
                                        onChange={(evt) => handleChangeModel(evt.target.value)} >
                                        {models.map(model => <MenuItem key={model} value={model}>{model}</MenuItem>)}
                                    </Select>
                                </Grid>
                                <Grid size={2}>
                                    Project Context:
                                </Grid>
                                <Grid size={10}>
                                    <Stack direction={'row'}>
                                        <Box sx={{ alignItems: 'center', justifyItems: 'center' }}>
                                            <Typography>Enabled</Typography>
                                            <Switch
                                                value={grantRecipe.enableContext}
                                                onChange={() => toggleEnableContext()}></Switch>
                                        </Box>
                                        <TextField
                                            id="context"
                                            label="Context folder location"
                                            fullWidth
                                            value={grantRecipe.context}
                                            disabled={disabled || grantRecipe.enableContext}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                handleChangeContext(event.target.value);
                                            }} />
                                    </Stack>
                                </Grid>
                                <Grid size={2}>
                                    Prompt Template:
                                </Grid>
                                <Grid size={10}>
                                    <TextField
                                        id="template"
                                        fullWidth
                                        multiline={true}
                                        rows={6}
                                        value={grantRecipe.template}
                                        disabled={disabled}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            handleChangeTemplate(event.target.value);
                                        }}
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                resize: 'vertical',
                                                overflow: 'auto',
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    <InputParametersEditor
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
                        <CardHeader title="Prompt" />
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
                </Card>
                <Divider />
                {proposals.length > 0 && <Card>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={activeTab} onChange={handleChangeProposal} aria-label="basic tabs example">
                            {proposals.map((prop, index) => <Tab value={index} label={getCreatedDateTimeString(prop)} {...a11yProps(0)} />)}
                        </Tabs>
                    </Box>
                    <CardContent>
                        {<ProposalCard proposal={proposals[activeTab]} />}
                    </CardContent>
                </Card>
                }
            </Box>
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
        </Stack >
    );
}

export default GrantPage;
