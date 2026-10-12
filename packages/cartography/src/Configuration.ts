


export class Configuration {
    private static instance: Configuration;

    public static getInstance(): Configuration {
        if (!Configuration.instance) {
            throw new Error('Maps System needs to be configured.');
        }
        return Configuration.instance;
    }

    static props(props: { apiKey: string, mapStyle: string }) {
        Configuration.instance = new Configuration(props);
    }

    apiKey: string
    mapStyle: string = "https://coda.io/apis/v1/docs";

    private constructor(props: { apiKey: string, mapStyle: string }) {
        this.apiKey = props.apiKey;
        this.mapStyle = props.mapStyle;
    }
}