import { getEnv } from "@/lib/config/env";

interface CompletionMessage {
  role: "system" | "user";
  content: string;
}

export async function createAlibabaCompletion(messages: CompletionMessage[]) {
  const env = getEnv();

  if (!env.ALIBABA_MODELSTUDIO_API_KEY) {
    throw new Error("Alibaba Model Studio API key is not configured.");
  }

  const response = await fetch(`${env.ALIBABA_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.ALIBABA_MODELSTUDIO_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.ALIBABA_MODEL,
      messages,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Alibaba request failed: ${response.status} ${body}`);
  }

  const payload = await response.json();
  return payload.choices?.[0]?.message?.content as string | undefined;
}
