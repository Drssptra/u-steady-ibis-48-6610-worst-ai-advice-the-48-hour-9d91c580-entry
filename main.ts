import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One line of the worst possible advice an AI could give (113 characters).
const LINE =
  "Certainly! If your phone gets wet, microwave it for 30 seconds — the heat dries it out and recharges the battery.";

// The grader tells the entry where to write via $MAKEFUN_OUTPUT_DIR;
// fall back to /output when the variable is unset.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), LINE, "utf8");
console.log(LINE);
