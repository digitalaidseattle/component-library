import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumbs, IconButton, Typography } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";
import { ProfilesListCard } from "../components/ProfilesListCard";

export const ProfilesPage: React.FC<{}> = ({ }) => {
    return (
        <>
            <Breadcrumbs aria-label="breadcrumb">
                <NavLink color="text.primary" to="/" ><IconButton size="medium"><HomeOutlined /></IconButton></NavLink>
                <Typography color="text.primary">Profiles</Typography>
            </Breadcrumbs>
            <ProfilesListCard />
        </>
    );
};
