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

import { ProgramContext } from '../components/ProgramContext';
import { ProgramDetailCard } from '../components/ProgramDetailCard';
import { ProgramService } from '../services';
import { Program } from '../types';

export const ProgramPage = () => {
  const service = ProgramService.getInstance();

  const [program, setProgram] = useState<Program>();

  const { id } = useParams();
  const { refresh } = React.useContext(RefreshContext);

  useEffect(() => {
    if (id) {
      async function load() {
        const program = await service.getById(id!);
        setProgram(program!);
      }
      load();
    }
  }, [id, refresh]);

  return (program &&
    <ProgramContext.Provider value={{ program, setProgram }} >
      <Breadcrumbs aria-label="breadcrumb">
        <NavLink to="/" ><IconButton size="medium"><HomeOutlined /></IconButton></NavLink>
        <NavLink to="/programs" >Program Tracking</NavLink>
        <Typography color="text.primary">Program Details</Typography>
      </Breadcrumbs>
      <ProgramDetailCard />
    </ProgramContext.Provider>
  );
}

