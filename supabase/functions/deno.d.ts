declare namespace Deno {
  export interface Env {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
    toObject(): { [key: string]: string };
  }
  
  export const env: Env;
  
  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
}

declare module "https://deno.land/std/http/server.ts" {
  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
} 