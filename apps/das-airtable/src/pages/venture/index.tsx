
// material-ui
import { LoadingContext, RefreshContext } from '@digitalaidseattle/core';
import {
  Stack,
  Typography
} from '@mui/material';

// project import
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Venture, ventureService } from '../services/ventureService';
import { InfoPanel } from './infoPanel';

const VenturePage = () => {
  const { setLoading } = useContext(LoadingContext);
  const { refresh } = useContext(RefreshContext);
  const [venture, setVenture] = useState<any>();

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setLoading(true);
      ventureService.getById(id)
        .then((venture: Venture) => setVenture(venture))
        .finally(() => setLoading(false))
    }
  }, [id, refresh])

  return (venture &&
    <Stack>
      <Typography variant='h2'>Venture: {venture.ventureCode}</Typography>
      <InfoPanel venture={venture} />
    </Stack>
  );
};

export default VenturePage;
