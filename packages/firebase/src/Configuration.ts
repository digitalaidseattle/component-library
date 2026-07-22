

import { FirebaseApp } from 'firebase/app';

export interface ConfigurationProps {
  firebaseApp: FirebaseApp;
}

export class Configuration {

  private static instance: Configuration;

  static getInstance(): Configuration {
    if (!this.instance) {
      throw new Error('System needs to be configured.');
    }
    return this.instance
  }

  static set(props: ConfigurationProps) {
    Configuration.instance = new Configuration(props);
  }

  props: ConfigurationProps;

  private constructor(props: ConfigurationProps) {
    this.props = props;
  }

  getClient() {
    if (!this.props.firebaseApp) {
      console.trace('System needs to be configured.');
      throw new Error('System needs to be configured.');
    }
    return this.props.firebaseApp;
  }


}