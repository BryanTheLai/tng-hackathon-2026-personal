import { readFileSync } from "node:fs";
import path from "node:path";

const templateCache = new Map<string, string>();

export function getPromptTemplate(relativePath: string) {
  const normalizedPath = relativePath.replaceAll("\\", "/");

  if (!templateCache.has(normalizedPath)) {
    const absolutePath = path.join(process.cwd(), "prompts", normalizedPath);
    templateCache.set(normalizedPath, readFileSync(absolutePath, "utf8").trim());
  }

  return templateCache.get(normalizedPath) ?? "";
}

export function renderPromptTemplate(
  relativePath: string,
  values: Record<string, string | number | boolean | null | undefined>,
) {
  const template = getPromptTemplate(relativePath);

  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_match, key: string) => {
    const value = values[key];
    return value == null ? "" : String(value);
  });
}
