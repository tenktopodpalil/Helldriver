type Styles = Record<string, string>;

declare module '*.svg' {
  import React = require('react');

  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;

  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.scss' {
  const content: Styles;
  export default content;
}

declare module '*.sass' {
  const content: Styles;
  export default content;
}

declare module '*.css' {
  const content: Styles;
  export default content;
}
export {};

declare global {
  interface Window {
    api: {
      /**
       * Fetches data from the Helldivers API.
       * https://api.live.prod.thehelldiversgame.com/api/{endpoint}
       *
       * @param endpoint API endpoint (example: "v2/Assignment/War/801")
       * @returns Parsed JSON response from the API
       */
      getAPI(endpoint: string): Promise<any>;
    },
    fetchAPIData: {
            /**
       * Fetches data from the Helldivers API.
       * https://api.live.prod.thehelldiversgame.com/api/{endpoint}
       *
       * @param endpoint API endpoint (example: "v2/Assignment/War/801")
       * @returns Parsed JSON response from the API
       */
    };
  }
}