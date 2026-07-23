/**
 * MapPage.tsx
 * Display information of a ticket
 */

// react
import { ReactNode, useCallback, useEffect, useState } from 'react';

// material-ui
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Stack,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';

import { Map, Configuration as MapConfiguration } from '@digitalaidseattle/cartography';
import { Configuration as FirebaseConfiguration } from '@digitalaidseattle/firebase';

import { Location, LocationService } from './LocationService';
import { TeamMemberService } from './teamMemberService';
import { Volunteer } from './VolunteerDao';

const Labels = {
  title: 'Map Example',
  saveButton: 'Save',
  resetButton: 'Reset',
}

const MAP_HEIGHT = 'calc(100dvh - 140px)';

function VolunteerCard({ volunteer, onClick }: { volunteer: Volunteer, onClick: () => void }) {
  return (
    <Card onClick={onClick} >
      <CardHeader
        title={volunteer.name}
        subheader={volunteer.role}
        avatar={<Avatar alt={volunteer.name} src={volunteer.url} />} >
      </CardHeader>
    </Card>
  )
}

function MobileVolunteerCard({ volunteer, onClick }: { volunteer: Volunteer, onClick: () => void }) {
  return (
    <Card onClick={onClick} sx={{
      height: 180, width: 240,
      backgroundSize: 'cover',
      backgroundPosition: 'center', backgroundImage: `url(${volunteer.url})`
    }}>
      <Box flexDirection="column"
        justifyContent="flex-end"
        alignItems="flex-start" display="flex"
        height="100%" width="100%" sx={{
          backgroundColor: 'rgba(0,0,0,0.4)',
          // background:
          //   "linear-gradient(to top, rgba(255,255,255,255), rgba(0,0,0,0.4))",

        }}>
        <Typography fontWeight={600} marginLeft="5px" color="white" >
          {volunteer.name}
        </Typography>
        <Typography fontWeight={400} marginLeft="5px" color="white">
          {volunteer.role}
        </Typography>
      </Box>
    </Card>
  )
}

const MapPage = () => {
  const teamMemberService = TeamMemberService.getInstance();
  const locationService = LocationService.getInstance()

  const [initialized, setInitialized] = useState(false);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [uniqueLocations, setUniqueLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down("md"));

  const fetchMembers = useCallback(() => {
    if (!initialized) {
      MapConfiguration.props({
        apiKey: import.meta.env.VITE_MAPTILER_API_KEY,
        mapStyle: import.meta.env.VITE_MAP_STYLE
      });

      FirebaseConfiguration.props({
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.FVITE_IREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
      });

      teamMemberService.getAll()
        .then(resp => {
          setVolunteers(
            resp
              .filter(v => v.status === 'Active')
              .sort((p1, p2) => p1.name.localeCompare(p2.name)));
          setInitialized(true);
        });
    }
  }, [initialized])

  useEffect(() => {
    fetchMembers();
  }, [initialized]);

  useEffect(() => {
    fetchLocations();
  }, [volunteers]);

  async function fetchLocations() {
    const locs: Location[] = [];
    for (const v of volunteers) {
      const loc = await teamMemberService.getLocation(v);
      if (loc) {
        locs.push(loc);
      }
    }
    setLocations(locs);
    setUniqueLocations(locationService.unique(locations));
  }

  async function handleVolunteerSelection(volunteer: Volunteer | null) {
    if (volunteer) {
      const loc = await locationService.findByName(volunteer.location.trim());
      if (loc) {
        setSelectedLocation(loc);
      } else {
        console.info('location not found', volunteer)
        setSelectedLocation(null);
      }
    } else {
      setSelectedLocation(null);
    }
  }

  function singleVolunteerPopup(volunteer: Volunteer) {
    return (
      <Stack>
        {volunteer.url && volunteer.url !== '' && <img src={volunteer.url} />}
        <Typography fontWeight={600}>{volunteer.name}</Typography>
        <Typography fontWeight={400}>{volunteer.role}</Typography>
        <Typography fontWeight={400}>{volunteer.location}</Typography>
      </Stack>
    )
  }

  function multiVolunteersPopup(volunteers: Volunteer[], location: Location) {
    return (
      <Stack>
        <Typography fontWeight={600}>
          <a target="_new"
            href={`http://en.wikipedia.org/w/index.php?title=Special:Search&search=${location.name}`}
          >{location.name}</a>
        </Typography>
        <Typography>Home of volunteers: {volunteers.map(v => v.name).join(', ')}</Typography>
      </Stack>
    )
  }

  async function renderPopup(loc: Location): Promise<ReactNode | null> {
    if (loc) {
      const peeps = await teamMemberService.getPeopleAt(volunteers, loc);
      return peeps.length === 1 ? singleVolunteerPopup(peeps[0]) : multiVolunteersPopup(peeps, loc);
    }
    return null;
  }

  function renderCard(volunteer: Volunteer): ReactNode {
    return isMobileView
      ? <MobileVolunteerCard
        key={volunteer.id}
        volunteer={volunteer}
        onClick={() => handleVolunteerSelection(volunteer)} />
      : <VolunteerCard
        key={volunteer.id}
        volunteer={volunteer}
        onClick={() => handleVolunteerSelection(volunteer)} />
  }

  return (
    <Card>
      <CardHeader
        title={Labels.title}
      />
      {initialized && (
        <Box height={MAP_HEIGHT}>
          <Map
            items={volunteers}
            pins={uniqueLocations}
            selectedLocation={selectedLocation}
            renderCard={volunteer => renderCard(volunteer)}
            renderPopup={async (loc) => await renderPopup(loc)}
          />
        </Box>
      )}
    </Card>
  );
}

export default MapPage;
