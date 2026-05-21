import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SendIcon from "@mui/icons-material/Send";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  createSurveyContact,
  deleteSurveyContact,
  listSurveyContacts,
  saveSurveyContact,
  sendSurveyEmailCampaign,
  SurveyContact,
} from "@digitalaidseattle/resend";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSurveySession } from "@digitalaidseattle/surveys";
import AppLayout from "../layouts/AppLayout";
import Sidebar from "../components/sidebars/Sidebar";

export default function ContactsPage() {
  const navigate = useNavigate();
  const { surveyId } = useParams<{ surveyId?: string }>();
  const { ownerKey, publishedSurveys } = useSurveySession();
  const survey = publishedSurveys.find((entry) => entry.id === surveyId);
  const [contacts, setContacts] = useState<SurveyContact[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [subject, setSubject] = useState("");
  const [messageHtml, setMessageHtml] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!ownerKey) {
      return;
    }

    void listSurveyContacts(ownerKey).then(setContacts).catch((error) => {
      setErrorMessage(error instanceof Error ? error.message : "Unable to load contacts.");
    });
  }, [ownerKey]);

  useEffect(() => {
    if (!survey) {
      return;
    }

    setSubject((current) => current || `Please complete: ${survey.title}`);
    setMessageHtml((current) =>
      current ||
      `<p>Hello,</p><p>Please take a few minutes to complete ${survey.title}.</p><p><a href="{{survey_link}}">Open the survey</a></p>`
    );
  }, [survey]);

  const selectedContacts = useMemo(
    () => contacts.filter((contact) => selectedIds.includes(contact.id)),
    [contacts, selectedIds]
  );

  async function refreshContacts() {
    if (!ownerKey) {
      return;
    }
    setContacts(await listSurveyContacts(ownerKey));
  }

  async function handleAddContact() {
    if (!ownerKey || !email.trim()) {
      return;
    }

    const contact = await saveSurveyContact(
      createSurveyContact(ownerKey, {
        email,
        name,
        organization,
      })
    );

    setContacts((current) => [contact, ...current]);
    setSelectedIds((current) => [...current, contact.id]);
    setEmail("");
    setName("");
    setOrganization("");
  }

  async function handleDeleteContact(contactId: string) {
    if (!ownerKey) {
      return;
    }

    await deleteSurveyContact(ownerKey, contactId);
    setContacts((current) => current.filter((contact) => contact.id !== contactId));
    setSelectedIds((current) => current.filter((id) => id !== contactId));
  }

  async function handleSend() {
    if (!ownerKey || !surveyId || selectedContacts.length === 0) {
      return;
    }

    setSending(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const result = await sendSurveyEmailCampaign({
        ownerKey,
        surveyId,
        subject,
        messageHtml,
        contacts: selectedContacts,
        surveyUrlForContact: (contact) =>
          `${window.location.origin}/take/${surveyId}/contact/${contact.id}`,
      });

      setStatusMessage(`Prepared ${result.recipients.length} survey email${result.recipients.length === 1 ? "" : "s"}.`);
      await refreshContacts();
      navigate(`/surveys/${surveyId}/responses`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to send survey emails.");
    } finally {
      setSending(false);
    }
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Dashboard", path: "/" },
        { label: survey ? survey.title : "Contacts" },
      ]}
      sidebarContent={
        <Sidebar
          primaryAction={{
            label: "Dashboard",
            icon: <ArrowBackIcon />,
            onClick: () => navigate("/"),
          }}
          onNavigate={navigate}
        />
      }
    >
      <Stack gap={2}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Contacts
          </Typography>
          <Typography color="text.secondary">
            {survey
              ? "Choose who should receive this survey."
              : "Manage the people you commonly survey."}
          </Typography>
        </Box>

        {statusMessage && <Alert severity="success">{statusMessage}</Alert>}
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} gap={1.5}>
            <TextField
              label="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              fullWidth
            />
            <TextField
              label="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              fullWidth
            />
            <TextField
              label="Organization"
              value={organization}
              onChange={(event) => setOrganization(event.target.value)}
              fullWidth
            />
            <Button variant="contained" onClick={() => void handleAddContact()} sx={{ borderRadius: 1 }}>
              Add
            </Button>
          </Stack>
        </Paper>

        <Paper variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    disabled={contacts.length === 0}
                    checked={contacts.length > 0 && selectedIds.length === contacts.length}
                    indeterminate={selectedIds.length > 0 && selectedIds.length < contacts.length}
                    onChange={(event) =>
                      setSelectedIds(event.target.checked ? contacts.map((contact) => contact.id) : [])
                    }
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Organization</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.includes(contact.id)}
                      onChange={(event) =>
                        setSelectedIds((current) =>
                          event.target.checked
                            ? [...current, contact.id]
                            : current.filter((id) => id !== contact.id)
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>{contact.name || "Unnamed contact"}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.organization || "-"}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="Delete contact"
                      onClick={() => void handleDeleteContact(contact.id)}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {contacts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography color="text.secondary" py={2}>
                      No contacts yet.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>

        {surveyId && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack gap={2}>
              <Box>
                <Typography fontWeight={700}>Survey email</Typography>
                <Typography variant="body2" color="text.secondary">
                  The send button is wired to the Supabase function named send-survey-email.
                </Typography>
              </Box>
              <Divider />
              <TextField
                label="Subject"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                fullWidth
              />
              <TextField
                label="Message HTML"
                value={messageHtml}
                onChange={(event) => setMessageHtml(event.target.value)}
                multiline
                minRows={5}
                fullWidth
              />
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  startIcon={<SendIcon />}
                  disabled={sending || selectedContacts.length === 0 || !subject.trim()}
                  onClick={() => void handleSend()}
                  sx={{ borderRadius: 1 }}
                >
                  {sending ? "Sending" : `Send to ${selectedContacts.length}`}
                </Button>
              </Box>
            </Stack>
          </Paper>
        )}
      </Stack>
    </AppLayout>
  );
}
