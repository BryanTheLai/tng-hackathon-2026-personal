import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  APP_URL: z.string().default("http://localhost:3000"),
  APP_INTERNAL_TOKEN: z.string().default("change-me"),
  NEXT_PUBLIC_APP_MODE: z.string().default("seeded"),
  ALIBABA_MODELSTUDIO_API_KEY: z.string().optional(),
  ALIBABA_MODEL: z.string().default("qwen3.6-flash"),
  ALIBABA_BASE_URL: z.string().default(
    "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
  ),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_MESSAGING_SERVICE_SID: z.string().optional(),
  TWILIO_WHATSAPP_FROM: z.string().optional(),
  TWILIO_WHATSAPP_TO: z.string().optional(),
  TWILIO_STATUS_CALLBACK_URL: z.string().optional(),
});

export type AppEnv = z.infer<typeof envSchema>;

let cachedEnv: AppEnv | null = null;

export function getEnv() {
  if (!cachedEnv) {
    cachedEnv = envSchema.parse(process.env);
  }

  return cachedEnv;
}

export function isSeedMode() {
  return getEnv().NEXT_PUBLIC_APP_MODE === "seeded";
}

export function canAttemptTwilioSend() {
  const env = getEnv();
  return Boolean(
    env.TWILIO_ACCOUNT_SID &&
      env.TWILIO_AUTH_TOKEN &&
      env.TWILIO_WHATSAPP_TO &&
      (env.TWILIO_MESSAGING_SERVICE_SID || env.TWILIO_WHATSAPP_FROM),
  );
}

export function canAttemptAlibaba() {
  return Boolean(getEnv().ALIBABA_MODELSTUDIO_API_KEY);
}

export function getTwilioStatusCallbackUrl() {
  const env = getEnv();

  if (env.TWILIO_STATUS_CALLBACK_URL) {
    return env.TWILIO_STATUS_CALLBACK_URL;
  }

  try {
    const callbackUrl = new URL("/api/webhooks/twilio/status", env.APP_URL);

    if (
      callbackUrl.hostname === "localhost" ||
      callbackUrl.hostname === "127.0.0.1"
    ) {
      return null;
    }

    return callbackUrl.toString();
  } catch {
    return null;
  }
}

export function resetEnvCacheForTests() {
  cachedEnv = null;
}
