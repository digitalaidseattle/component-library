
/**
 *  StorageService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

export interface StorageService {

    list(filepath?: string): Promise<any[]>;

    getUrl(filepath: string): string;

    getUrlAsync(filepath: string): Promise<string>;

    upload(path: string, blob: any): Promise<any>

    downloadFile(filePath: string): Promise<string>;

    downloadBlob(filepath: string): Promise<Blob | null>;

    removeFile(fileName: string): Promise<any>;

}

export class LocalStorageService implements StorageService {

    async downloadFile(filePath: string): Promise<string> {
        return fetch(filePath)
            .then(r => r.text())
    }

    list(filepath?: string): Promise<any[]> {
        throw new Error("Method not implemented.");
    }

    getUrl(filepath: string): Promise<string> {
        throw new Error("Method not implemented.");
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