
/**
 *  InfoPanel.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { RefreshContext } from "@digitalaidseattle/core";
import { Card, CardContent, CardMedia, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import placeholder from '../../assets/project-image.png';
import { EditBlock, EditLink } from "../../components/EditBlock";
import { Partner, partnerService } from "../services/partnerService";
import { VentureProps, ventureService } from "../services/ventureService";

const DescriptionSection: React.FC<VentureProps & { partner: Partner }> = ({ venture, partner }) => {

    return (partner && venture &&
        <Stack direction={'row'} spacing={2}>
            <CardMedia
                component='img'
                image={partner.logoUrl ? partner.logoUrl : placeholder}
                alt={partner.name + " logo"}
                sx={{
                    objectFit: 'contain',
                    width: { md: '2rem', lg: '4rem' },
                    aspectRatio: '1 / 1',
                    borderRadius: '8px',
                    display: { xs: 'none', md: 'block' },
                    backgroundColor: 'white',
                }}
            />
            <Stack>
                <Stack direction="row" spacing={2}>
                    <Typography fontWeight={600}>Partner: </Typography>
                    <Typography> {partner.name}</Typography>
                </Stack>
                <Stack direction="row" spacing={2}>
                    <Typography fontWeight={600}>Venture Status: </Typography>
                    <Typography> {venture.status}</Typography>
                </Stack>
                <Stack direction="row" spacing={2}>
                    <Typography fontWeight={600}>Painpoint: </Typography>
                    <Typography>{venture.painpoint}</Typography>
                </Stack>
            </Stack>
        </Stack>

    );
}

const PartnerSection: React.FC<{ partner: Partner }> = ({ partner }) => {
    const { setRefresh } = useContext(RefreshContext);

    const saveOverview = (text: string) => {
        partnerService
            .update(partner.id, { overviewLink: text })
            .then(() => setRefresh(0))
    }

    const saveGdrive = (text: string) => {
        partnerService
            .update(partner.id, { gdriveLink: text })
            .then(() => setRefresh(0))
    }

    const saveHubspot = (text: string) => {
        partnerService
            .update(partner.id, { hubspotLink: text })
            .then(() => setRefresh(0))
    }

    const saveMiro = (text: string) => {
        partnerService
            .update(partner.id, { miroLink: text })
            .then(() => setRefresh(0))
    }
    return (partner &&
        <Card>
            <CardContent>
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                    Partner Information
                </Typography>
                <Stack direction={'column'} gap={'0.5rem'}>
                    <EditLink label="Overview" value={partner.overviewLink} save={saveOverview} />
                    <EditLink label="G Drive" value={partner.gdriveLink} save={saveGdrive} />
                    <EditLink label="HubSpot" value={partner.hubspotLink} save={saveHubspot} />
                    <EditLink label="Miro" value={partner.miroLink} save={saveMiro} />
                </Stack>
            </CardContent>
        </Card>
    )
}
const PSISection: React.FC<VentureProps> = ({ venture }) => {
    const { setRefresh } = useContext(RefreshContext);
    const saveProblem = (text: string) => {
        ventureService
            .update(venture.id, { problem: text })
            .then(() => setRefresh(0))
    }

    const saveSolution = (text: string) => {
        ventureService
            .update(venture.id, { solution: text })
            .then(() => setRefresh(0))
    }

    const saveImpact = (text: string) => {
        ventureService
            .update(venture.id, { impact: text })
            .then(() => setRefresh(0))
    }
    return (
        <Card>
            <CardContent>
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                    Venture P.S.I.
                </Typography>
                <Stack direction={'column'} gap={'0.5rem'}>
                    <EditBlock label="Problem" value={venture.problem} save={saveProblem} />
                    <EditBlock label="Solution" value={venture.solution} save={saveSolution} />
                    <EditBlock label="Impact" value={venture.impact} save={saveImpact} />
                </Stack>
            </CardContent>
        </Card>
    )
}

export const InfoPanel: React.FC<VentureProps> = ({ venture }) => {
    const [partner, setPartner] = useState<Partner>();

    useEffect(() => {
        partnerService.getById(venture.partnerId)
            .then(partner => setPartner(partner))
    }, [venture]);

    return (
        <Stack spacing={2}>
            <DescriptionSection venture={venture} partner={partner!} />
            <PSISection venture={venture} />
            <PartnerSection partner={partner!} />
        </Stack>
    )
};
