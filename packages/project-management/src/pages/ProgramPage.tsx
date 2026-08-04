/**
 * MapPage.tsx
 * Display information of a ticket
 */

// react

// material-ui
import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';

import {
  Breadcrumbs,
  IconButton,
  Typography
} from '@mui/material';
import { HomeOutlined } from '@ant-design/icons';

import { RefreshContext } from '@digitalaidseattle/core';

import { ProgramService } from '../services';
import { Program } from '../types';
import { ProgramDetailCard } from '../components/ProgramDetailCard';
import { ProgramContext } from '../components/ProgramContext';

export const ProgramPage = () => {
  const service = ProgramService.getInstance();

  const [program, setProgram] = useState<Program>();

  const { id } = useParams();
  const { refresh } = React.useContext(RefreshContext);

  useEffect(() => {
    if (id) {
      let active = true;
      async function load() {
        const program = await service.getById(id!);
        if (active) {
          setProgram(program!);
        }
      }
      load();
      return () => {
        active = false;
      };
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

