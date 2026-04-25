import { renderPromptTemplate } from "@/lib/prompts/template-loader";

const EXPECTED_LOGIN_COMMAND = "/tng-login";

export function buildInboundReplyMessage(body: string, hasMatchedPendingCase: boolean) {
  const trimmedBody = body.trim();
  const normalizedBody = trimmedBody.toLowerCase();

  if (!hasMatchedPendingCase) {
    return renderPromptTemplate("customer/reply-no-pending-case.md", {});
  }

  if (!trimmedBody) {
    return renderPromptTemplate("customer/reply-empty.md", {
      expected_command: EXPECTED_LOGIN_COMMAND,
    });
  }

  if (normalizedBody === EXPECTED_LOGIN_COMMAND) {
    return renderPromptTemplate("customer/reply-success.md", {});
  }

  return renderPromptTemplate("customer/reply-unsupported.md", {
    expected_command: EXPECTED_LOGIN_COMMAND,
  });
}

export function renderTwimlMessage(message: string) {
  return `<Response><Message>${escapeXml(message)}</Message></Response>`;
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
