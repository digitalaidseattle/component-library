/**
 * MapPage.tsx
 * Display information of a ticket
 */

// react

// material-ui
import React from 'react';

import {
  Breadcrumbs,
  IconButton,
  Typography
} from '@mui/material';

import { HomeOutlined } from '@ant-design/icons';

import { NavLink } from 'react-router-dom';
import { ProgamsListCard } from '../components/ProgamsListCard';

export const ProgramsPage = (): React.ReactNode => {
  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <NavLink to="/" ><IconButton size="medium"><HomeOutlined /></IconButton></NavLink>
        <Typography color="text.primary">Program Tracking</Typography>
      </Breadcrumbs>
      <ProgamsListCard />
    </>
  );
}

