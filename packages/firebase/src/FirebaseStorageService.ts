
/**
 *  storageService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { StorageService } from "@digitalaidseattle/core";
import { firebaseClient } from "./firebaseClient";
import { getStorage, ref, getBytes } from "firebase/storage";

export class FirebaseStorageService implements StorageService {

    storage = getStorage(firebaseClient);
    decoder = new TextDecoder("utf-8");

    downloadFile = async (filepath: string): Promise<string> => {
        const fileRef = ref(this.storage, filepath);
        return getBytes(fileRef)
            .then(b => this.decoder.decode(b))
    }

}

