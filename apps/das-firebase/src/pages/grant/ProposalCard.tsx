/**
 * ProposalCard.tsx
*/
import { Fragment, SyntheticEvent, useEffect, useState } from "react";
import { grantProposalService } from "../../api/grants/grantProposalService";
import { GrantProposal } from "../../api/grants/types";
import Markdown from "react-markdown";
import { Card, CardContent, Grid, Rating, Stack, Typography } from "@mui/material";
import { Clipboard } from "../../components/ClipBoard";

interface ProposalProps {
    proposal: GrantProposal;
}
export const ProposalCard: React.FC<ProposalProps> = ({ proposal }) => {
    const [grantProposal, setGrantProposal] = useState<GrantProposal>();
    const [structured, setStructured] = useState<any>({});
    const [displayChoice, setDisplayChoice] = useState< 'markdown' | 'structured'>('markdown');

    useEffect(() => {
        setGrantProposal(proposal);
    }, [proposal]);

    useEffect(() => {
        if (grantProposal) {
            setDisplayChoice(grantProposal.textResponse ? "markdown" : "structured");
            // to map => object
            setStructured(grantProposal.structuredResponse);
        }
    }, [grantProposal]);

    function handleRatingChange(_event: SyntheticEvent<Element, Event>, value: number | null): void {
        if (grantProposal) {
            grantProposal.rating = value;
            grantProposalService.update(grantProposal.id!, grantProposal)
                .then(updated => setGrantProposal(updated));
        }
    }

    return (grantProposal &&
        <Fragment key={grantProposal.id}>
            <Stack direction={'row'}>
                <Typography> Rating: </Typography>
                <Rating value={grantProposal.rating} onChange={handleRatingChange} />
            </Stack>
            <Card>
                {displayChoice === 'markdown' && grantProposal.textResponse &&
                    <CardContent>
                        <Markdown>
                            {grantProposal.textResponse}
                        </Markdown>
                    </CardContent>
                }
                {displayChoice === 'structured' &&
                    <CardContent>
                        <Stack gap={2} >
                            {Object.entries(structured).map(([key, value]) => {
                                // TODO consider stripping quotes in the service
                                const formatted = JSON.stringify(value, null, 2).replace(/^["]+|["]+$/g, "");
                                return (<Grid container spacing={2}>
                                    <Grid size={2} >
                                        <Stack direction={'row'} alignItems={'center'}>
                                            <Clipboard text={formatted} size={'medium'} />
                                            <Typography variant="h6"><strong>{key}:</strong></Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid size={10}>
                                        <Markdown>{formatted}</Markdown>
                                    </Grid>
                                </Grid>)
                            })}
                        </Stack>
                    </CardContent>
                }
            </Card>
        </Fragment>);
}
