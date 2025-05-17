// backend/types.ts
import { Context as _Context } from "hono";

declare module "hono" {
  interface Context {
    userSub?: string; // Add userSub as an optional property on the context
    user?: UserState;
  }
}

export interface UserState {
  sub: string;
  username: string;
}
