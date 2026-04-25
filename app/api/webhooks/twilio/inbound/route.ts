import { NextResponse } from "next/server";

import { getDemoData } from "@/lib/demo-state/store";
import { buildInboundReplyMessage, renderTwimlMessage } from "@/lib/integrations/twilio-twiml";
import { recordInboundReply } from "@/lib/services/resolution-service";

export async function POST(request: Request) {
  const formData = await request.formData();
  const messageSid = String(formData.get("MessageSid") ?? `SIM-IN-${Date.now()}`);
  const body = String(formData.get("Body") ?? "").trim();
  const caseId = String(formData.get("CaseId") ?? "").trim();

  const resolvedCaseId =
    caseId ||
    getDemoData().cases
      .filter((record) => record.resolutionState === "PENDING_USER")
      .sort((left, right) => right.score - left.score)[0]?.caseId;

  if (!resolvedCaseId) {
    return new NextResponse(
      renderTwimlMessage(buildInboundReplyMessage(body, false)),
      {
        status: 200,
        headers: { "Content-Type": "text/xml" },
      },
    );
  }

  const record = recordInboundReply(resolvedCaseId, messageSid, body);

  if (!record) {
    return new NextResponse(
      renderTwimlMessage(buildInboundReplyMessage(body, false)),
      {
        status: 200,
        headers: { "Content-Type": "text/xml" },
      },
    );
  }

  return new NextResponse(renderTwimlMessage(buildInboundReplyMessage(body, true)), {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}
