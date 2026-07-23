
/**
 *  SuperhumanDao.ts
 *
 *  @copyright 2026 Digital Aid Seattle
 *
 */

export class Configuration {
    private static instance: Configuration;

    public static getInstance(): Configuration {
        if (!Configuration.instance) {
            throw new Error('Superhuman System needs to be configured.');
        }
        return Configuration.instance;
    }

    static props(props: { apiToken: string, apiBase: string }) {
        Configuration.instance = new Configuration(props);
    }

    baseUrl: string = "https://coda.io/apis/v1/docs";  // alas, Coda may have changed its name, but the song remains the same
    apiToken: string
    apiBase: string;

    private constructor(props: { apiToken: string, apiBase: string }) {
        this.apiToken = props.apiToken;
        this.apiBase = props.apiBase;
    }
}