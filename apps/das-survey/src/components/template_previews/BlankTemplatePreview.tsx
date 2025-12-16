import {
  Box,
  Typography,
  Button,
} from "@mui/material";

type Props = {
  onUseTemplate: () => void;
};

export default function BlankTemplatePreview({
  onUseTemplate,
}: Props) {
  return (
    <Box
      height={400}
      border="1px dashed"
      borderColor="divider"
      borderRadius={2}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      bgcolor="background.paper"
    >
      <Typography fontWeight={600} gutterBottom>
        Blank survey
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        mb={3}
      >
        This template starts with no questions.
        <br />
        You’ll build it step by step.
      </Typography>

      <Button
        variant="contained"
        onClick={onUseTemplate}
      >
        Use this template
      </Button>
    </Box>
  );
}
