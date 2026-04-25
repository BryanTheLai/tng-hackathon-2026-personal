import demoDataJson from "@/seed/demo-core.json";
import { demoDataSchema } from "@/lib/domain/schema";

export function loadDemoData() {
  return demoDataSchema.parse(demoDataJson);
}

