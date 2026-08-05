
import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app";


export class Configuration {
    private static instance: Configuration;

    public static getInstance(): Configuration {
        if (!Configuration.instance) {
            throw new Error('Maps System needs to be configured.');
        }
        return Configuration.instance;
    }

    static props(props: { storage_folder: string, apiKey: string }) {
        Configuration.instance = new Configuration(props);
    }

    storage_folder: string;
    apiKey: string;

    private constructor(props: { storage_folder: string, apiKey: string }) {
        this.storage_folder = props.storage_folder;
        this.apiKey = props.apiKey;
    }
}