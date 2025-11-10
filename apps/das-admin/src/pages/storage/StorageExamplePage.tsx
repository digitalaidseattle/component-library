import { useEffect, useState } from 'react';
// material-ui
import {
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import dayjs from 'dayjs';
import { v4 as uuid } from 'uuid';

import { File, SupabaseStorageService } from '@digitalaidseattle/supabase';
import FilesTable from './FilesTable';

// ==============================|| UPLOAD PAGE ||============================== //

const StorageExamplePage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const storageService = new SupabaseStorageService();

  useEffect(() => {
    storageService!.list()
      .then((resp: File[]) => {
        setFiles(resp);
      })
  }, []);

  const File = (id: string, name: string, size: number, mimetype: string) => {
    return {
      id: id,
      name: name,
      metadata: { size: size, mimetype: mimetype },
      created_at: dayjs(new Date())
    }
  }

  const handleUpload = (event: any) => {
    const file = event.target.files[0];
    storageService.uploadFile(file)
      .then(() => {
        const fileObject: File = File(uuid(), file.name, file.size, file.type);
        setFiles([...files, fileObject]);
      })
      .catch(err => alert(err));
  }

  const handleDelete = (fName: string) => {
    storageService.removeFile(fName)
      .then(resp => {
        console.log(resp)
        setFiles(files.filter(f => f.name != fName));
      })
      .catch(err => alert(err));
  }

  return (
    <Card>
      <CardHeader
        title="Upload/Delete Storage Files" />
      <CardContent>
        <input
          accept="*"
          id="contained-button-file"
          type="file"
          onChange={(e) => handleUpload(e)}
        />
        <FilesTable fileList={files} onDelete={(fName: string) => handleDelete(fName)} />
      </CardContent>
    </Card>
  );
}

export default StorageExamplePage;
