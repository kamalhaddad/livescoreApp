declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NFL_API_KEY: string;
      NBA_API_KEY: string;
      SOCCER_API_KEY: string;
      ODDS_API_KEY: string;
    }
  }
}

export {} 