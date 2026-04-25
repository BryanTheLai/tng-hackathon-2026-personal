import { NextResponse } from "next/server";

import { getEnv } from "@/lib/config/env";

export async function GET() {
  const env = getEnv();

  return NextResponse.json({
    ok: true,
    mode: env.NEXT_PUBLIC_APP_MODE,
    appUrl: env.APP_URL,
  });
}
