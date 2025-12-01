import React from 'react';

// material-ui
import { Box, IconButton, List, Typography } from '@mui/material';

// project import
import { useContext } from 'react';
import NavItem from './NavItem';
import { DrawerOpenContext } from '../../../DrawerOpenContext';
import { MenuItem } from '../../../../types';
import styled from '@emotion/styled';
import { DownOutlined } from '@ant-design/icons';

// ==============================|| NAVIGATION - LIST GROUP ||============================== //
const ExpandMore = styled((props: any) => {
  const { expand, ...other } = props;
  return <IconButton size="small" {...other} />;
})(({ theme, expand }: { theme?: any; expand: boolean }) => ({
  transform: !expand ? "rotate(180deg)" : "rotate(0deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface NavGroupProps {
  item: MenuItem
}
const NavGroup: React.FC<NavGroupProps> = ({ item }) => {
  const { drawerOpen } = useContext(DrawerOpenContext);
  const [expanded, setExpanded] = React.useState(true);

  const handleExpandClick = () => {
    setExpanded((prev) => !prev);
  };


  const navCollapse = item.children?.map((menuItem: MenuItem) => {
    switch (menuItem.type) {
      case 'item':
        return <NavItem key={menuItem.id} item={menuItem} level={1} />;
      default:
        return (
          <Typography key={menuItem.id} variant="h6" color="error" align="center">
            Fix - Group Collapse or Items
          </Typography>
        );
    }
  });

  return (
    <List
      subheader={
        item.title &&
        drawerOpen && (
          <Box sx={{ pl: 3, mb: 1.5, display: 'flex' }}>
            <Typography color="textSecondary">
              {item.title}
            </Typography>
            {item.type === 'collapse' &&
              <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <DownOutlined />
              </ExpandMore>
            }
          </Box >
        )
      }
      sx={{ mb: drawerOpen ? 1.5 : 0, py: 0, zIndex: 0 }}
    >
      {expanded && navCollapse}
    </List >
  );
};



export default NavGroup;
