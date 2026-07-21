


export class Configuration {
    private static instance: Configuration;

    public static getInstance(): Configuration {
        if (!Configuration.instance) {
            throw new Error('Coda System needs to be configured.');
        }
        return Configuration.instance;
    }

    static props(props: { apiToken: string, apiBase: string }) {
        Configuration.instance = new Configuration(props);
    }

    baseUrl: string = "https://coda.io/apis/v1/docs";
    apiToken: string
    apiBase: string;

    private constructor(props: { apiToken: string, apiBase: string }) {
        this.apiToken = props.apiToken;
        this.apiBase = props.apiBase;
    }
}