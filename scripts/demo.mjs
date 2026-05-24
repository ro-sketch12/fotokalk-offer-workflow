#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDemoInput, buildOfferDraft, renderOfferMarkdown, summarizeDraft } from "../src/offer-flow.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = new Set(process.argv.slice(2));
const inputPath = resolve(root, "examples/demo-offer-input.json");
const outputPath = resolve(root, "examples/demo-offer-output.md");

async function main() {
  const input = await loadInput();
  const draft = buildOfferDraft(input);

  if (args.has("--json")) {
    console.log(JSON.stringify(draft, null, 2));
    return;
  }

  const markdown = renderOfferMarkdown(draft);

  if (args.has("--write")) {
    await writeFile(outputPath, markdown, "utf8");
    console.log(`Wrote ${relative(outputPath)}`);
    return;
  }

  if (args.has("--summary")) {
    console.log(JSON.stringify(summarizeDraft(draft), null, 2));
    return;
  }

  console.log(markdown);
}

async function loadInput() {
  try {
    const text = await readFile(inputPath, "utf8");
    return JSON.parse(text);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return buildDemoInput();
  }
}

function relative(path) {
  return path.replace(`${root}/`, "");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
