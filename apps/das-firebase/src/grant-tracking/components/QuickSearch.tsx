/**
* QuickSearch.tsx
* 
* @copyright 2026 Digital Aid Seattle
*/


import { CloseCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { useDebounce } from "@digitalaidseattle/mui";
import { InputAdornment, styled, TextField, Tooltip } from '@mui/material';
import {
    GridSearchIcon,
    QuickFilter,
    QuickFilterClear,
    QuickFilterControl,
    QuickFilterTrigger,
    ToolbarButton
} from '@mui/x-data-grid';
import { useEffect, useState } from "react";

// ==============================|| DUMMY DATA ||==============================
type OwnerState = {
    expanded: boolean;
};

const StyledQuickFilter = styled(QuickFilter)({
    display: 'grid',
    alignItems: 'center',
});

const StyledToolbarButton = styled(ToolbarButton)<{ ownerState: OwnerState }>(
    ({ theme, ownerState }) => ({
        gridArea: '1 / 1',
        width: 'min-content',
        height: 'min-content',
        zIndex: 1,
        opacity: ownerState.expanded ? 0 : 1,
        pointerEvents: ownerState.expanded ? 'none' : 'auto',
        transition: theme.transitions.create(['opacity']),
    }),
);

const StyledTextField = styled(TextField)<{
    ownerState: OwnerState;
}>(({ theme, ownerState }) => ({
    gridArea: '1 / 1',
    overflowX: 'clip',
    width: ownerState.expanded ? 260 : 'var(--trigger-width)',
    opacity: ownerState.expanded ? 1 : 0,
    transition: theme.transitions.create(['width', 'opacity']),
}));

export const QuickSearch = ({ onChange }: { onChange: (value: string) => void }) => {
    const [internal, setTnternal] = useState('');
    const debounced = useDebounce(internal, 500);

    useEffect(() => {
        if (debounced) {
            onChange(debounced);
        }
    }, [debounced]);

    return (<StyledQuickFilter  >
        <QuickFilterTrigger
            render={(triggerProps, state) => (
                <Tooltip title="Search" enterDelay={0}>
                    <StyledToolbarButton
                        {...triggerProps}
                        ownerState={{ expanded: state.expanded }}
                        color="default"
                        aria-disabled={state.expanded}
                    >
                        <SearchOutlined />
                    </StyledToolbarButton>
                </Tooltip>
            )}
        />
        <QuickFilterControl
            render={({ ref, ...controlProps }, state) => (
                <StyledTextField
                    {...controlProps}
                    ownerState={{ expanded: state.expanded }}
                    inputRef={ref}
                    aria-label="Search"
                    placeholder="Search…"
                    size="small"
                    value={internal}
                    onChange={(e) => setTnternal(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <GridSearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                            endAdornment: state.value ? (
                                <InputAdornment position="end">
                                    <QuickFilterClear
                                        edge="end"
                                        size="small"
                                        aria-label="Clear search"
                                        material={{ sx: { marginRight: -0.75 } }}
                                    >
                                        <CloseCircleOutlined />
                                    </QuickFilterClear>
                                </InputAdornment>
                            ) : null,
                            ...controlProps.slotProps?.input,
                        },
                        ...controlProps.slotProps,
                    }}
                />
            )}
        />
    </StyledQuickFilter>);
}