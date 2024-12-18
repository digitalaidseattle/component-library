export interface StorageService {

    downloadFile(filePath: string): Promise<string>;

}

export class LocalStorageService implements StorageService {

    async downloadFile(filePath: string): Promise<string> {
        return fetch(filePath)
            .then(r => r.text())
    }
}