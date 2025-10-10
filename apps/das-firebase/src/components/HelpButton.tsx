import { IconButton } from "@mui/material"
import HelpIcon from '@mui/icons-material/Help';
import { useHelp } from "./HelpContext";

export const HelpButton: React.FC = () => {
    const { showHelp, setShowHelp } = useHelp();
    return (
        <IconButton color="primary"
            aria-label="Hide Help"
            onClick={() => setShowHelp(!showHelp)}>
            <HelpIcon />
        </IconButton>
    )
}