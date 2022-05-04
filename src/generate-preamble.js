import { readFileSync } from "fs";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const { version } = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), { encoding: "utf-8" })
);

export default function (file) {
  return `// ---- start of jomment preamble v${version} ----
// These are the comments of ${file}
// Please do not edit manually!
// Use
//   $ jom edit ${file}
// ---- end of jomment preamble ----

`;
}
