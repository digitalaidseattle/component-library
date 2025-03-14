import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { formatISO } from 'date-fns';

import { MainCard } from '@digitalaidseattle/mui';
import { File, SupabaseStorageService } from '@digitalaidseattle/supabase';
import FilesTable from './FilesTable';

// ==============================|| UPLOAD PAGE ||============================== //

const StorageExamplePage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const storageService = new SupabaseStorageService();

  useEffect(() => {
    storageService!.listFiles()
      .then((resp: File[]) => {
        setFiles(resp);
      })
  }, []);

  const File = (id: string, name: string, size: number, mimetype: string) => {
    return {
      id: id,
      name: name,
      metadata: { size: size, mimetype: mimetype },
      created_at: formatISO(new Date())
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
    <MainCard title="Upload/Delete Storage Files">
      <div>
        <input
          accept="*"
          id="contained-button-file"
          type="file"
          onChange={(e) => handleUpload(e)}
        />
        <FilesTable fileList={files} onDelete={(fName: string) => handleDelete(fName)} />
      </div>
    </MainCard>
  );
}

export default StorageExamplePage;
