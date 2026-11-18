import { Box, IconButton, Tooltip } from '@mui/material';

import {
    ColumnsPanelTrigger,
    ExportCsv,
    FilterPanelTrigger,
    Toolbar as MuiToolbar,
    ToolbarPropsOverrides
} from '@mui/x-data-grid';

import { ExportOutlined, FilterOutlined, TableOutlined } from "@ant-design/icons";

import React from 'react';
import { QuickSearch } from './QuickSearch';

declare module "@mui/x-data-grid" {
    interface ToolbarPropsOverrides {
        tools: React.ReactNode,
        onSearch: (search: string) => void;
    }
}

export function Toolbar({ tools, onSearch }: ToolbarPropsOverrides) {
    return (
        <MuiToolbar>
            {tools}
            <Box sx={{ flex: 1 }} />
            <ColumnsPanelTrigger render={<Tooltip title={"Manage columns"}><IconButton ><TableOutlined /></IconButton></Tooltip>} />
            <FilterPanelTrigger render={<Tooltip title={"Filter rows"}><IconButton ><FilterOutlined /></IconButton></Tooltip>} />
            <ExportCsv render={<Tooltip title={"Export"}><IconButton><ExportOutlined /></IconButton></Tooltip>} />
            <QuickSearch onChange={onSearch} />
        </MuiToolbar>
    );
}