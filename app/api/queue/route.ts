import { NextResponse } from "next/server";

import { getQueueSnapshot } from "@/lib/services/queue-service";

export async function GET() {
  const snapshot = await getQueueSnapshot();
  return NextResponse.json(snapshot);
}
