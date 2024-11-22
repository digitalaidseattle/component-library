import { Button, Card, CardContent, CardHeader } from "@mui/material"
import { useContext } from "react"
import { LayoutConfigurationContext } from "@digitalaidseattle/mui";

export const Test = () => {
    // TODO fix typing
    const { configuration, setConfiguration } = useContext(LayoutConfigurationContext);

    const handleClick = () => {
        const newConfig = Object.assign(configuration, { toolbarItems: [] });
        setConfiguration({ ...newConfig });
    }

    return (
        <Card>
            <CardHeader>HOME</CardHeader>
            <CardContent>
                <Button onClick={handleClick}>Click</Button>
            </CardContent>
        </Card>
    )
}