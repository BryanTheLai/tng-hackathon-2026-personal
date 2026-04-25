import { NextResponse } from "next/server";

import { updatePromptStatus } from "@/lib/services/resolution-service";

export async function POST(request: Request) {
  const formData = await request.formData();
  const messageSid = String(formData.get("MessageSid") ?? "");
  const messageStatus = String(formData.get("MessageStatus") ?? "sent");
  const eventId = `${messageSid}:${messageStatus}`;

  if (!messageSid) {
    return NextResponse.json({ message: "MessageSid is required." }, { status: 400 });
  }

  const record = updatePromptStatus(messageSid, messageStatus, eventId);

  if (!record) {
    return NextResponse.json({ message: "Prompt not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, state: record.prompt.state });
}
