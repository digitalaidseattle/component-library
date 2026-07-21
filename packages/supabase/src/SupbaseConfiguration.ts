

import { createClient, SupabaseClient } from "@supabase/supabase-js";

export class SupabaseConfiguration {

  private static instance: SupabaseConfiguration;

  static getInstance(): SupabaseConfiguration {
    if (!SupabaseConfiguration.instance) {
      throw new Error('System needs to be configured.');
    }
    return SupabaseConfiguration.instance
  }

  static props(props: { supabaseUrl: string, anonKey: string }) {
    SupabaseConfiguration.instance = new SupabaseConfiguration(props);
  }

  supabaseClient: SupabaseClient | undefined;

  private constructor(props: { supabaseUrl: string, anonKey: string }) {
    this.supabaseClient = createClient(
      props.supabaseUrl,
      props.anonKey
    )
  }

  getSupabaseClient() {
    if (!this.supabaseClient) {
      console.trace();
      throw new Error('System needs to be configured.');
    }
    return this.supabaseClient;
  }

}