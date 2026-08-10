/**
 * Outline
 *
 *
 */

import React, { useEffect } from 'react';

import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Box, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import {
    RichTreeView,
    TreeItemContent,
    TreeItemGroupTransition,
    TreeItemIcon,
    TreeItemIconContainer,
    TreeItemProps,
    TreeItemProvider,
    TreeItemRoot,
    useTreeItem
} from '@mui/x-tree-view';

import { RefreshContext } from '@digitalaidseattle/core';

import { useNavigate } from 'react-router-dom';
import { ProgramService } from '../services';
import { Node } from "../types";
import NodeDialog from './NodeDialog';
import { ProgramContext } from './ProgramContext';

type TreeNode = {
    id: string,
    label: string;
    children: TreeNode[];
}

export function Summary() {


    return (
        <Box sx={{ minHeight: 352, minWidth: 250 }}>
            <Typography>Summary content</Typography>
            <Typography>Maybe a donut chart</Typography>
            <Typography>Maybe a activity chart by member</Typography>
        </Box>
    );
}

