// const { program } = require("commander");
// program.parse();

// const options = program.opts();

// import openEditor from "open-editor";
const fs = require("fs");

const { parse, stringify, assign } = require("comment-json");

const packageJson = JSON.parse(fs.readFileSync("./package.json"));
const packageJsonComments = JSON.parse(
  fs.readFileSync("./package.json.comments")
);

function concatIndent(str1, str2, indent = 0) {
  return `${str1}\n${new Array(indent + 1).join(" ")}${str2}`;
}

const mix = function (
  packageJson,
  packageJsonComments,
  mixed = "",
  indent = 0
) {
  for (key in packageJson) {
    console.log(`\nanalyzing ${key} of package.json`);
    if (packageJson[key] instanceof Object) {
      console.log(`packageJson[${key}] is Object`);
      if (packageJsonComments[key] instanceof Object) {
        console.log(`packageJsonComments[${key}] is Object too, recursion`);
        // mixed = concatIndent(mixed, `"${key}": {`, indent);
        mixed = concatIndent(
          mixed,
          mix(
            packageJson[key],
            packageJsonComments[key],
            `"${key}": {`,
            indent + 2
          ),
          indent
        );
        mixed = concatIndent(mixed, `}`, indent);
      } else if (packageJsonComments[key]) {
        console.log(`packageJsonComments[${key}] is String`);
        mixed = concatIndent(mixed, `// ${packageJsonComments[key]}`, indent);
        mixed = concatIndent(mixed, `"${key}": "${packageJson[key]}"`, indent);
      } else {
        console.log(`packageJsonComments[${key}] is undefined`);
        mixed = concatIndent(
          mixed,
          `"${key}": ${JSON.stringify(packageJson[key], null, 2)
            .split("\n")
            .join(`\n${new Array(indent + 1).join(" ")}`)}`,
          indent
        );
      }
    } else {
      console.log(`packageJson[${key}] is String`);
      if (packageJsonComments[key]) {
        console.log(`packageJsonComments[${key}] is String`);
        mixed = concatIndent(mixed, `// ${packageJsonComments[key]}`, indent);
      }
      mixed = concatIndent(
        mixed,
        `"${key}": ${JSON.stringify(packageJson[key])},`,
        indent
      );
    }
    console.log(`mixed (indent: ${indent}): `, mixed);
  }
  return mixed;
};

const { inspect } = require("util");
const basicJson = parse(fs.readFileSync("sample-with-comments.json", "utf-8"));
console.log("basicJson", JSON.stringify(basicJson, null, 2));
console.log(inspect(basicJson, { showHidden: true }));

// const mixed = mix(packageJson, packageJsonComments, "{", 2) + "\n}";
// console.log("mixed result:");
// console.log(mixed);
// fs.writeFileSync("package.mixed.json", mixed);

// openEditor([
//   {
//     file: "readme.md",
//     line: 10,
//     column: 2,
//   },
// ]);

// openEditor(["unicorn.js:5:3"]);
