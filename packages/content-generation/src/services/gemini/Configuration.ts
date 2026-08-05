
import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app";


export class Configuration {
    private static instance: Configuration;

    public static getInstance(): Configuration {
        if (!Configuration.instance) {
            throw new Error('Maps System needs to be configured.');
        }
        return Configuration.instance;
    }

    static props(props: { storage_folder: string, firebase_options: FirebaseOptions }) {
        Configuration.instance = new Configuration(props);
    }

    storage_folder: string;
    firebase_options: FirebaseOptions;
    firebaseApp: FirebaseApp;

    private constructor(props: { storage_folder: string, firebase_options: FirebaseOptions }) {
        this.storage_folder = props.storage_folder;
        this.firebase_options = props.firebase_options;
        this.firebaseApp = initializeApp(props.firebase_options);
    }
}