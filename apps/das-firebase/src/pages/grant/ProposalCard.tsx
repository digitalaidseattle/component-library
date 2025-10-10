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
    proposalId: string;
}
export const ProposalCard: React.FC<ProposalProps> = ({ proposalId }) => {
    const [proposal, setProposal] = useState<GrantProposal>();
    const [structured, setStructured] = useState<any>({});
    const [displayChoice, setDisplayChoice] = useState<string>('');

    useEffect(() => {
        if (proposalId) {
            grantProposalService.getById(proposalId)
                .then((proposal) => setProposal(proposal))
                .catch(err => console.log('error', proposalId, err));
        }
    }, [proposalId]);

    useEffect(() => {
        if (proposal) {
            setDisplayChoice(proposal.textResponse ? "markdown" : "structured");
            // to map => object
            setStructured(proposal.structuredResponse);
        }
    }, [proposal]);

    function handleRatingChange(_event: SyntheticEvent<Element, Event>, value: number | null): void {
        if (proposal) {
            proposal.rating = value;
            grantProposalService.update(proposalId, proposal)
                .then(updated => setProposal(updated));
        }
    }

    return (proposal &&
        <Fragment key={proposal.id}>
            <Stack direction={'row'}>
                <Typography> Rating: </Typography>
                <Rating value={proposal.rating} onChange={handleRatingChange} />
            </Stack>
            <Card>
                {displayChoice === 'markdown' && proposal.textResponse &&
                    <CardContent>
                        <Markdown>
                            {proposal.textResponse}
                        </Markdown>
                    </CardContent>
                }
                {displayChoice === 'structured' &&
                    <>
                        <CardContent>
                            <Typography variant="h3">Structured Output</Typography>
                        </CardContent>
                        <CardContent>
                            <Stack gap={2} >
                                {Object.entries(structured).map(([key, value]) => {
                                    // TODO consider stripping quotes in the service
                                    const formatted = JSON.stringify(value, null, 2).replace(/^["]+|["]+$/g, "");
                                    return (<Grid container spacing={2}>
                                        <Grid item xs={2} >
                                            <Stack direction={'row'} alignItems={'center'}>
                                                <Clipboard text={formatted} size={'medium'} />
                                                <Typography variant="h4"><strong>{key}:</strong></Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={10}>
                                            <Typography>{formatted}</Typography>
                                        </Grid>
                                    </Grid>)
                                })}
                            </Stack>
                        </CardContent>
                    </>
                }
            </Card>
        </Fragment>);
}
