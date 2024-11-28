/**
 * Privacy.tsx
 * Example of reader a stored file and displaying

*/
// material-ui
import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import { storageService } from '../services/storageService';
import MainCard from '../components/MainCard';


const Privacy = () => {
    const [file, setFile] = useState('');
    useEffect(() => {
        storageService.downloadFile('privacy.md')
            .then(b => { if (b) { b.text().then(t => setFile(t)) } })
            .catch(err => alert(err))
    }, [])
    return (
        <MainCard>
            <Grid container rowSpacing={4.5} columnSpacing={2.75}>
                <Grid item>
                    <Markdown>
                        {file}
                    </Markdown>
                </Grid>
            </Grid>
        </MainCard>
    );
}

export default Privacy;
