
/**
 *  storageService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { StorageService } from "@digitalaidseattle/core";
import { firebaseClient } from "./firebaseClient";
import { getStorage, ref, getBytes, getDownloadURL } from "firebase/storage";

export class FirebaseStorageService implements StorageService {


    storage = getStorage(firebaseClient);
    decoder = new TextDecoder("utf-8");

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

    list(filepath?: string): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
    getUrl(filepath: string): string {
        throw new Error("Method not supported.");
    }
    upload(path: string, blob: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    downloadBlob(filepath: string): Promise<Blob | null> {
        throw new Error("Method not implemented.");
    }
    removeFile(fileName: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
}

