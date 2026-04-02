
/**
 *  storageService.ts
 *
 *  @copyright 2026 Digital Aid Seattle
 *
 */

import { StorageService } from "@digitalaidseattle/core";
import { SupabaseClient } from "@supabase/supabase-js";
import { SupabaseConfiguration } from "./SupbaseConfiguration";

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

    private static instance: SupabaseStorageService;

    static getInstance(): SupabaseStorageService {
        if (!SupabaseStorageService.instance) {
            SupabaseStorageService.instance = new SupabaseStorageService(SupabaseConfiguration.getInstance().supabaseClient);
        }
        return SupabaseStorageService.instance
    }

    bucketName: string = BUCKET_NAME;
    client: SupabaseClient;

    constructor(supabaseClient: SupabaseClient, bucketName?: string) {
        this.bucketName = bucketName ?? BUCKET_NAME;
        this.client = supabaseClient;
    }

    async list(): Promise<any[]> {
        return this.client
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
    // Temp methdo that should be move into component library
    getUrl(filepath: string): string {
        const resp = this.client
            .storage
            .from(this.bucketName)
            .getPublicUrl(filepath);
        return resp.data.publicUrl
    }

    async getUrlAsync(filepath: string): Promise<string> {
        const resp = this.client
            .storage
            .from(this.bucketName)
            .getPublicUrl(filepath);
        return resp.data.publicUrl
    }

    async downloadFile(filepath: string): Promise<string> {
        return this.client
            .storage
            .from(this.bucketName)
            .download(filepath)
            .then(resp => {
                if (resp.error) {
                    throw new Error(resp.error.message)
                }
                return resp.data.text()
            })
    }

    async downloadBlob(filepath: string): Promise<Blob | null> {
        return this.client
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

    async removeFile(fileName: string): Promise<any> {
        return this.client
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

    async uploadFile(file: any): Promise<any> {
        return this.client
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

    async upload(path: string, blob: any): Promise<any> {
        return this.client
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