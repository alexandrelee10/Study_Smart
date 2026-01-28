import type { NextRequest } from "next/server";

export async function createTRPCContext(opts: { req: NextRequest }) {
  // add auth/session/db later if needed
  return { req: opts.req };
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
