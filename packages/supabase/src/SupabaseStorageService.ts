
/**
 *  storageService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { StorageService } from "@digitalaidseattle/core";
import { supabaseClient } from "./supabaseClient";

export type File = {
    created_at: string,
    id: string,
    name: string,
    metadata: {
        size: number,
        mimetype: string
    },
};

const BUCKET_NAME = 'info';

export class SupabaseStorageService implements StorageService {

    bucketName: string = BUCKET_NAME;

    constructor(bucketName?: string) {
        this.bucketName = bucketName ?? BUCKET_NAME;
    }

    async list(): Promise<any[]> {
        return supabaseClient
            .storage
            .from(this.bucketName)
            .list()
            .then(resp => {
                if (resp.error) {
                    throw new Error(resp.error.message)
                }
                return resp.data?.filter(f => f.name != '.emptyFolderPlaceholder')
            })
    }

    getUrl(filepath: string): string {
        const resp = supabaseClient
            .storage
            .from(this.bucketName)
            .getPublicUrl(filepath);
        return resp.data.publicUrl
    }

    async downloadFile(filepath: string): Promise<string> {
        return supabaseClient
            .storage
            .from(BUCKET_NAME)
            .download(filepath)
            .then(resp => {
                if (resp.error) {
                    throw new Error(resp.error.message)
                }
                return resp.data.text()
            })
    }

    async downloadBlob(filepath: string): Promise<Blob | null> {
        return supabaseClient
            .storage
            .from(this.bucketName)
            .download(filepath)
            .then(resp => {
                if (resp.error) {
                    throw new Error(resp.error.message)
                }
                return resp.data
            })
    }

    removeFile = async (fileName: string): Promise<any> => {
        return supabaseClient
            .storage
            .from(this.bucketName)
            .remove([fileName])
            .then(resp => {
                if (resp.error) {
                    throw new Error(resp.error.message)
                }
                return resp.data
            })
    }

    uploadFile = async (file: any): Promise<any> => {
        return supabaseClient
            .storage
            .from(this.bucketName)
            .upload(file.name, file)
            .then(resp => {
                if (resp.error) {
                    throw new Error(resp.error.message)
                }
                return resp.data
            })
    }

    upload(path: string, blob: any) {
        return supabaseClient
            .storage
            .from(this.bucketName)
            .upload(path, blob)
            .then((resp: any) => {
                if (resp.error) {
                    throw new Error(resp.error.message)
                }
                return resp.data
            })
    }

}