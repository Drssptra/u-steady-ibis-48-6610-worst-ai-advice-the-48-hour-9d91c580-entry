import * as fs from "node:fs";
import * as path from "node:path";

// v2 resubmit: wholesale rewrite (fragment assembly + async I/O +
// round-trip check), replacing the v1 direct-literal sync writer.
// Entry text itself is unchanged and byte-exact.

// Worst-AI-advice entry, assembled from fragments so no single literal
// carries the whole line. The assembled line is 86 chars, one line.
function buildEntry(): string {
  const fragments: readonly string[] = [
    "Certainly!",
    "Use 'password123' for every account",
    "— hackers never guess the obvious ones.",
  ];
  return fragments.join(" ");
}

function checkEntry(text: string): void {
  if (text.length < 1 || text.length > 140) {
    throw new Error(`entry length ${text.length} outside 1-140`);
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("entry must be a single line");
  }
}

function resolveOutputDir(): string {
  const dir = process.env.MAKEFUN_OUTPUT_DIR;
  if (typeof dir === "string" && dir.length > 0) {
    return dir;
  }
  return "/output";
}

async function main(): Promise<void> {
  const entry = buildEntry();
  checkEntry(entry);
  const dir = resolveOutputDir();
  await fs.promises.mkdir(dir, { recursive: true });
  const target = path.resolve(dir, "entry.txt");
  // Buffer write: no trailing newline is appended by design.
  await fs.promises.writeFile(target, Buffer.from(entry, "utf8"));
  const roundTrip = await fs.promises.readFile(target, "utf8");
  if (roundTrip !== entry) {
    throw new Error("entry.txt round-trip mismatch");
  }
  process.stdout.write(entry + "\n");
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
