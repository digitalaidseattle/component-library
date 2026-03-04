
/**
 *  FirebaseStorageService.ts
 *
 *  @copyright 2026 Digital Aid Seattle
 *
 */

import { StorageService } from "@digitalaidseattle/core";
import { FirebaseApp } from "firebase/app";
import { deleteObject, FirebaseStorage, getBytes, getDownloadURL, getMetadata, getStorage, listAll, ref, uploadBytes } from "firebase/storage";

export class FirebaseStorageService implements StorageService {

    storage: FirebaseStorage;
    decoder: TextDecoder;

    constructor(firebaseClient: FirebaseApp) {
        this.storage = getStorage(firebaseClient);
        this.decoder = new TextDecoder("utf-8");
    }

    downloadFile = async (filepath: string): Promise<string> => {
        const fileRef = ref(this.storage, filepath);
        return getBytes(fileRef)
            .then(b => this.decoder.decode(b))
    }

    async getUrlAsync(filepath: string): Promise<string> {
        try {
            const storageRef = ref(this.storage, filepath);
            return await getDownloadURL(storageRef);
        } catch (error) {
            console.error("Error getting download URL:", error);
            throw error;
        }
    }

    getUrl(filepath: string): string {
        throw new Error("Method not supported.");
    }

    downloadBlob(filepath: string): Promise<Blob | null> {
        const fileRef = ref(this.storage, filepath);
        return getBytes(fileRef)
            .then(bytes => new Blob([bytes]));
    }

    removeFile(path: string): Promise<void> {
        try {
            const fileRef = ref(this.storage, path);
            return deleteObject(fileRef);
        } catch (error: any) {
            if (error.code === "storage/object-not-found") {
                console.warn("File does not exist");
            } else if (error.code === "storage/unauthorized") {
                console.error("User not authorized to delete file");
            } else {
                console.error("Delete failed:", error);
            }
            throw error;
        }
    }

    async list(filepath?: string): Promise<any[]> {
        if (!filepath) {
            return [];
        }
        const folderRef = ref(this.storage, filepath);
        const result = await listAll(folderRef);
        const files = await Promise.all(result.items.map(async (item) => {
            const metadata = await getMetadata(item);
            return {
                name: item.name,
                fullPath: item.fullPath,
                type: metadata.contentType,
                size: metadata.size,
                updated: metadata.updated
            };
        }));
        return files;
    }

    async upload(path: string, file: any): Promise<any> {
        const storageRef = ref(this.storage, path);

        // Upload file
        const snapshot = await uploadBytes(storageRef, file, {
            contentType: file?.type,
        });

        // Get public download URL
        const downloadUrl = await getDownloadURL(snapshot.ref);
        return downloadUrl;
    }
}
