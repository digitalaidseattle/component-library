
// material-ui
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  useTheme
} from '@mui/material';

// project import
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { LoadingContext } from '@digitalaidseattle/core';

import placeholder from '../../assets/project-image.png';
import { Venture, VentureProps, ventureService } from '../services/ventureService';
import { Partner, partnerService } from '../services/partnerService';

const VentureCard: React.FC<VentureProps> = ({ venture }) => {
  const theme = useTheme();
  const [partner, setPartner] = useState<Partner>();

  useEffect(() => {
    partnerService.getById(venture.partnerId!)
      .then(partner => setPartner(partner))
  }, [venture]);

  const statusColor = (venture: any) => {
    switch (venture.status) {
      case 'Active':
        return theme.palette.success.main;
      case 'Under evaluation':
        return theme.palette.warning.main;
      case 'Declined':
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  }

  const navigate = useNavigate();

  return (
    <Card sx={{ display: 'flex', padding: '2' }} onClick={() => navigate(`/venture/${venture.id}`)}>
      <CardActionArea>
        {venture && partner &&
          <Stack direction={'row'}>
            <CardMedia
              component='img'
              image={partner.logoUrl ? partner.logoUrl : placeholder}
              alt={partner.name + " logo"}
              sx={{
                objectFit: 'contain',
                width: { md: '7rem', lg: 200 },
                aspectRatio: '1 / 1',
                borderRadius: '8px',
                display: { xs: 'none', md: 'block' },
                backgroundColor: 'white',
              }}
            />
            <Stack margin={1} spacing={1}>
              <Stack direction={'row'} spacing={{ xs: 1, sm: 2, md: 4 }}>
                <Typography variant='h5'>{venture.ventureCode} </Typography>
                <Typography color={statusColor(venture)}>{venture.status}</Typography>
              </Stack>
              <Typography >{partner.name}</Typography>
              <Typography >{venture.painpoint}</Typography>
              <Typography >{partner.description}</Typography>
            </Stack>
          </Stack>
        }
      </CardActionArea>
    </Card>
  )
};

// async getAll(count?: number, select?: string): Promise<Venture[]> {
//   return super.getAll(count, select)
//       .then(ventures =>
//           Promise
//               .all(ventures.map(venture => partnerService.getById(venture.partnerId)))
//               .then(partners => ventures.map((ven, idx) => Object.assign(ven, { partner: partners[idx] })))
//       )
// }

const VenturesPage = () => {
  const { setLoading } = useContext(LoadingContext);

  const [ventures, setVentures] = useState<Venture[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['Under evaluation']);

  // This allows quick access to more projects in DEV
  const statuses = [
    "Submitted by Partner",
    "Ready for consideration",
    "Under evaluation",
    "Active",
    "Declined",
    "Paused"];


  useEffect(() => {
    ventureService.getAllByStatus(selectedStatuses)
      .then(ventures => setVentures(ventures))
      .finally(() => setLoading(false))
  }, [selectedStatuses]);

  const handleChange = (event: SelectChangeEvent<typeof selectedStatuses>) => {
    const {
      target: { value },
    } = event;
    setSelectedStatuses(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <>
      <Stack sx={{ justifyContent: "space-between" }} direction={'row'} useFlexGap>
        <Typography variant='h2'>Digital Aid Projects</Typography>
        <Box>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="status-label">Evaluation Status</InputLabel>
            <Select
              label='Evaluation Status'
              labelId="status-label"
              id="demo-multiple-name"
              multiple
              value={selectedStatuses}
              onChange={handleChange}
              input={<OutlinedInput label="Name" />}
            >
              {statuses.map((status) => (
                <MenuItem
                  key={status}
                  value={status}
                >
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Stack>
      <Stack spacing={2}>
        {ventures.length > 0 && ventures.map(p =>
          <VentureCard key={p.id} venture={p} />
        )}
        {ventures.length === 0 &&
          <Typography variant='h4'>No Ventures with the selected status.</Typography>
        }
      </Stack>
    </>
  );
};

export default VenturesPage;
