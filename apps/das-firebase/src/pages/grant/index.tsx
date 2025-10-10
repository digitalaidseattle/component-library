/**
 * projects/grants.tsx
*/

import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { Box, Button, Card, CardContent, Divider, Drawer, IconButton, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import { useHelp } from "../../components/HelpContext";
import { grantProposalService } from "../../api/grants/grantProposalService";
import { grantService } from "../../api/grants/grantService";
import { GrantInput, GrantOutput, GrantProposal, GrantRecipe } from "../../api/grants/types";
import { InputParametersForm } from "../../components/InputParametersForm";
import { OutputParametersForm } from "../../components/OutputParametersForm";
import { MarkdownGenerator } from "../../api/grants/markdownGenerator";
import { StructureJsonGenerator } from "../../api/grants/structureJsonGenerator";
import { ProposalCard } from "./ProposalCard";
import { geminiService } from "../../api/geminiService";

const HELP_DRAWER_WIDTH = 300;
const GrantPage: React.FC = ({ }) => {
    const { id: grantReceiptId } = useParams<string>();
    const { showHelp, setShowHelp } = useHelp();

    const [thinking, setThinking] = useState<boolean>(false);
    const [grantRecipe, setGrantRecipe] = useState<GrantRecipe>(grantService.empty());
    const [disabled, setDisabled] = useState<boolean>(false);
    const [proposals, setProposals] = useState<GrantProposal[]>([]);
    const [activeTab, setActiveTab] = useState<number>(0);

    const markdownGenerator = new MarkdownGenerator(geminiService);
    const structureJsonGenerator = new StructureJsonGenerator(geminiService);

    useEffect(() => {
        setGrantRecipe(grantService.empty());
        if (grantReceiptId && grantReceiptId !== '@new') {
            grantService.getById(grantReceiptId)
                .then((proposal) => { setGrantRecipe(proposal ?? grantService.empty()) })
                .catch(err => console.log('error', grantReceiptId, err));
        }
    }, [grantReceiptId]);

    useEffect(() => {
        if (grantRecipe) {
            setDisabled((grantRecipe.proposalIds ?? []).length > 0)
            Promise.all(grantRecipe.proposalIds
                .map(propId => grantProposalService.getById(propId)))
                .then(proposals => {
                    console.log(proposals)
                    setProposals(proposals.sort((p1, p2) => p1.createdAt.nanoseconds - p2.createdAt.nanoseconds))
                });
        }
    }, [grantRecipe]);

    async function generateMarkdown() {
        setThinking(true);
        try {
            const savedRecipe = await markdownGenerator.generate(grantRecipe)
            setGrantRecipe(savedRecipe)
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setThinking(false)
        }
    }

    async function generateStuctured() {
        setThinking(true);
        try {
            if (grantRecipe.outputsWithWordCount.length === 0) {
                // TODO throw exception
                alert("Please select at least one output field.");
                return;
            }
            const savedRecipe = await structureJsonGenerator.generate(grantRecipe)
            setGrantRecipe(savedRecipe)
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setThinking(false)
        }
    }

    function saveRecipe() {
        if (grantRecipe.id) {
            grantService.update(grantRecipe.id, grantRecipe)
                .then(resp => setGrantRecipe(resp))
        } else {
            grantService.insert(grantRecipe)
                .then(resp => console.log(resp))
                .catch(err => console.error(err))
        }
    }

    function handleChangeDescription(newDescription: string) {
        setGrantRecipe({
            ...grantRecipe,
            description: newDescription
        })
    }

    function handleChangePrompt(newPrompt: string) {
        setGrantRecipe({
            ...grantRecipe,
            prompt: newPrompt
        })
    }

    function handleInputChange(newParams: GrantInput[]) {
        setGrantRecipe({
            ...grantRecipe,
            inputParameters: newParams
        })
    }

    function handleOutputChange(newParams: GrantOutput[]) {
        setGrantRecipe({
            ...grantRecipe,
            outputsWithWordCount: newParams
        })
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
                    <TextField
                        label="Description"
                        fullWidth

                        value={grantRecipe.description}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            handleChangeDescription(event.target.value);
                        }}></TextField>
                    <TextField
                        id="prompt"
                        label="Prompt"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={grantRecipe.prompt}
                        disabled={disabled}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            handleChangePrompt(event.target.value);
                        }}></TextField>
                    <fieldset disabled={disabled}>
                        <legend>Input Parameters: (key / value)</legend>
                        <InputParametersForm
                            disabled={disabled}
                            parameters={grantRecipe.inputParameters ?? []}
                            onChange={handleInputChange}
                        />
                    </fieldset>
                    <fieldset disabled={disabled}>
                        <legend>Output Fields: (field / max word count)</legend>
                        <OutputParametersForm
                            disabled={disabled}
                            parameters={grantRecipe.outputsWithWordCount ?? []}
                            onChange={handleOutputChange}
                        />
                    </fieldset>
                    <Stack direction="row" gap={1} justifyContent="flex-start">
                        <Button
                            variant="outlined"
                            size="medium"
                            disabled={disabled || thinking}
                            onClick={saveRecipe}>Save</Button>
                        <Divider orientation="vertical" flexItem />
                        <Button
                            variant="outlined"
                            size="medium"
                            disabled={thinking}
                            onClick={generateMarkdown}>Generate Markdown</Button>
                        <Button
                            variant="outlined"
                            size="medium"
                            disabled={thinking}
                            onClick={generateStuctured}>Generate Structured Output</Button>
                    </Stack>
                </Card>
                <Divider />
                <Card>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={activeTab} onChange={handleChangeProposal} aria-label="basic tabs example">
                            {proposals.map((prop, index) => <Tab value={index} label={getCreatedDateTimeString(prop)} {...a11yProps(0)} />)}
                        </Tabs>
                    </Box>
                    <CardContent>
                        {proposals.length > 0 && <ProposalCard proposalId={`${proposals[activeTab].id}`} />}
                    </CardContent>
                </Card>
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
        </Stack>
    );
}

export default GrantPage;
