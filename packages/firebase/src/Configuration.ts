
import { FirebaseApp, initializeApp } from 'firebase/app';

export type ConfigurationOpts = {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
}

export class Configuration {

    private static instance: Configuration;
    private static _props: ConfigurationOpts;

    static getInstance(): Configuration {
        if (!Configuration.instance) {
            if (this._props) {
                Configuration.instance = new Configuration(this._props);
            } else {
                throw new Error('Firebase needs to be configured.');
            }
        }
        return Configuration.instance
    }

    static props(props: ConfigurationOpts) {
        this._props = props;
    }

    client: FirebaseApp;

    private constructor(props: ConfigurationOpts) {
        this.client = initializeApp(props)
    }

    getClient() {
        if (!this.client) {
            throw new Error('Firebase System needs to be configured.');
        }
        return this.client;
    }

}