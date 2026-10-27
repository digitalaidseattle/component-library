/**
 * MapPage.tsx
 * Display information of a ticket
 */

// react

// material-ui
import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';

import { HomeOutlined } from '@ant-design/icons';
import {
  Breadcrumbs,
  IconButton,
  Typography
} from '@mui/material';

import { RefreshContext } from '@digitalaidseattle/core';

import {
  Configuration,
  Program,
  ProgramContext
} from '@digitalaidseattle/program-management';
import { DetailCard } from './DetailCard';

export const VentureTrackingDetails = () => {
  const service = Configuration.getInstance().getProgramService();

  const [program, setProgram] = useState<Program>();

  const { id } = useParams();
  const { refresh } = React.useContext(RefreshContext);

  useEffect(() => {
    let active = true;

    if (id) {
      async function load() {
        const program = await service.getById(id!);
        if (active) {
          console.log(program)
          setProgram(program!);
        }
      }
      load();
    }
    return () => { active = false; };

  }, [id, refresh]);

  return (program &&
    <ProgramContext.Provider value={{ program, setProgram }} >
      <Breadcrumbs aria-label="breadcrumb">
        <NavLink to="/" ><IconButton size="medium"><HomeOutlined /></IconButton></NavLink>
        <NavLink to=".." relative='path'>Venture Tracking</NavLink>
        <Typography color="text.primary">Venture Tracking Details</Typography>
      </Breadcrumbs>
      <DetailCard />
    </ProgramContext.Provider>
  );
}

