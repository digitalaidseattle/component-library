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
import { ProgramService } from '../services';
import { Node, Program } from '../types';
import { NodeService } from '../services/NodeService';
import { NodeContext } from '../components/NodeContext';
import { NodeDetailCard } from '../components/NodeDetailCard';

export const NodePage = () => {
  const service = ProgramService.getInstance();
  const nodeService = NodeService.getInstance();

  const [program, setProgram] = useState<Program>();
  const [allNodes, setAllNodes] = useState<Node[]>();
  const [node, setNode] = useState<Node>();
  const [ancestralNodes, setAncestralNodes] = useState<Node[]>();

  const { program_id, node_no } = useParams();
  const { refresh } = React.useContext(RefreshContext);

  useEffect(() => {
    if (program_id) {
      let active = true;

      function load() {
        if (active && program_id) {
          try {
            service.getById(program_id)
              .then(program => setProgram(program!));
            nodeService.findByProgramId(program_id)
              .then(nodes => setAllNodes([...nodes]));
          }
          catch (err) {
            console.error("Error fetching program", err);
          }
        }
      }

      load();
      return () => {
        active = false;
      };
    }
  }, [program_id, refresh]);

  useEffect(() => {
    if (allNodes && node_no) {
      setNode(nodeService.findNodeByNo(allNodes, node_no))
    }
  }, [node_no, allNodes]);

  useEffect(() => {
    if (node && allNodes) {
      setAncestralNodes(nodeService.getAncestors(allNodes, node));
    }
  }, [node, allNodes]);

  return (program && node &&
    <ProgramContext.Provider value={{ program, setProgram }} >
      <NodeContext.Provider value={{ node, setNode }} >
        <Breadcrumbs aria-label="breadcrumb">
          <NavLink to="/" ><IconButton size="medium"><HomeOutlined /></IconButton></NavLink>
          <NavLink to="/programs" >Programs</NavLink>
          <NavLink to={`/programs/${program_id}`} >{program.name}</NavLink>
          {(ancestralNodes ?? []).map(ancestor => (
            <NavLink key={ancestor.id} to={`/programs/${program_id}/nodes/${ancestor.node_no}`} >{ancestor.node_no} {ancestor.name}</NavLink>
          ))}
          <Typography color="text.primary">{node?.node_no} {node?.name}</Typography>
        </Breadcrumbs>
        <NodeDetailCard />
      </NodeContext.Provider>
    </ProgramContext.Provider>
  );
}

