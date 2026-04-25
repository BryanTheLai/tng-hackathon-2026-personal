import { NextResponse } from "next/server";

import { PromptServiceError, resendLivePrompt } from "@/lib/services/prompt-service";

export async function POST(
  _request: Request,
  context: { params: Promise<{ caseId: string }> },
) {
  const { caseId } = await context.params;

  try {
    const record = await resendLivePrompt(caseId);
    return NextResponse.json(record);
  } catch (error) {
    if (error instanceof PromptServiceError) {
      return NextResponse.json({ message: error.message }, { status: error.statusCode });
    }

    return NextResponse.json({ message: "Live WhatsApp resend failed." }, { status: 500 });
  }
}
