/**
 * GrantOutputEditor.tsx
 * 
 * @copyright 2025 Digital Aid Seattle
*/
import { DeleteOutlined } from "@ant-design/icons";
import { ConfirmationDialog } from "@digitalaidseattle/mui";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Tab,
  Tabs
} from "@mui/material";
import React from "react";
import { grantProposalService } from "../services";
import { GrantProposal } from '../services/types';
import { ProposalCard } from "./ProposalCard";

export const GrantProposals = ({ proposals, onChange }: { proposals: GrantProposal[], onChange: (updated: GrantProposal[]) => void }) => {

  const [activeTab, setActiveTab] = React.useState<number>(0);
  const [showConfirmation, setShowConfirmation] = React.useState<boolean>(false);
  const [selectedProposalId, setSelectedProposalId] = React.useState<string>();

  function getTabTitle(proposal: GrantProposal): string {
    const cDate = new Date((proposal.createdAt as any).seconds * 1000);
    return cDate.toLocaleString();
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleChangeProposal = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  function handleClickDelete(proposalId: string) {
    return ((event: React.SyntheticEvent) => {
      event.stopPropagation();
      setSelectedProposalId(proposalId);
      setShowConfirmation(true);
    })
  }

  function handleDelete(): void {
    if (selectedProposalId) {
      grantProposalService.delete(selectedProposalId)
        .then(() => onChange([]))
    }
  }

  return (
    <Card>
      <CardContent>
        <Box>
          <Tabs value={activeTab} onChange={handleChangeProposal} aria-label="basic tabs example">
            {proposals.map((prop, index) => (
              <Tab
                value={index}
                label={<span>{getTabTitle(prop)}
                  <IconButton color="error" size="small"
                    onClick={handleClickDelete(prop.id as string)}
                    disabled={index !== activeTab}>
                    <DeleteOutlined />
                  </IconButton>
                </span>}
                {...a11yProps(0)} />
            ))}
          </Tabs>
        </Box>
        {<ProposalCard proposal={proposals[activeTab]} />}
        <ConfirmationDialog
          message={"Delete this proposal?"} open={showConfirmation}
          handleConfirm={handleDelete}
          handleCancel={() => setShowConfirmation(false)} />
      </CardContent>
    </Card >
  );

}
