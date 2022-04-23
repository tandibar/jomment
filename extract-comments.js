const fs = require("fs");

const { parse, stringify, assign } = require("comment-json");
const { inspect } = require("util");

// const packageJson = parse(fs.readFileSync("./package.json", "utf-8"));
const packageJsonComments = parse(
  fs.readFileSync("./package.mixed.json", "utf-8")
);

// const obj = assign(packageJson, packageJsonComments);

console.log(inspect(packageJsonComments, { showHidden: true }));

// const syms = Object.getOwnPropertySymbols(packageJsonComments.scripts);

// for (sym of syms) {
//   console.log(
//     "packageJsonComments.scripts[sym]",
//     packageJsonComments.scripts[sym]
//   );
// }
console.log("\n\nstarting to extract symbols... \n");
function extractSymbols(jsonWithSymbols) {
  const syms = Object.getOwnPropertySymbols(jsonWithSymbols);

  let symsJson;
  if (syms.length > 0) {
    symsJson = {};
    for (const sym of syms) {
      symsJson[`###SYM###-${sym.toString()}`] = jsonWithSymbols[sym];
    }
    // console.log("symsJson", symsJson);
  }

  for (const key in jsonWithSymbols) {
    console.log("analysing ", key);
    if (packageJsonComments[key] instanceof Object) {
      const extracedSymbols = extractSymbols(packageJsonComments[key]);
      if (extracedSymbols) {
        symsJson[key] = extracedSymbols;
      }
    }
  }

  return symsJson;
}

const exportJson = extractSymbols(packageJsonComments, {});
console.log("exportJson", exportJson);

fs.writeFileSync("package.json.comments", JSON.stringify(exportJson, null, 2));
