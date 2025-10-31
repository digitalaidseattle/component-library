/**
 *  ForecastsDialog.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { Box, FormLabel, Rating, Typography } from '@mui/material';
import { InputOption } from '@digitalaidseattle/mui';

// @deprecated - use @digitalaidseattle/mui InputFormDialog instead when it is udpated

interface InputRatingProps {
    index: number;
    option: InputOption;
    value: number,
    onChange: (field: string, value: any) => void
}
function InputRating({ index, option, value, onChange }: InputRatingProps) {
    return (
        <Box
            key={index}
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Box
                component="fieldset"
                sx={{
                    display: "block",
                    width: "100%",
                    boxSizing: "border-box",
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "rgba(0, 0, 0, 0.23)",
                    position: "relative",
                    px: 2,
                    pt: 2.5,
                    pb: 1.5,
                    m: 0,
                    transition: "border-color 0.2s, border-width 0.2s",
                    "&:hover": {
                        borderColor: "text.primary",
                    },
                    "&:focus-within": {
                        borderWidth: 2,
                        borderColor: "primary.main",
                    },
                }}
            >
                {/* Floating Label */}
                <FormLabel
                    component="legend"
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 12,
                        px: 0.5,
                        transform: "translateY(-50%)",
                        backgroundColor: "background.paper",
                        fontSize: "0.75rem",
                        color: "text.secondary",
                    }}
                >
                    {option.label}
                </FormLabel>

                {/* Content */}
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Rating
                        name="outlined-rating"
                        value={value}
                        onChange={(_, newValue) => onChange(option.name, newValue)}
                    />
                    <Typography variant="body2" color="text.secondary">
                        {value ?? 0}/5
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}
export default InputRating;


