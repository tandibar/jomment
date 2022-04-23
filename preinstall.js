// const { parse, stringify, assign } = require("comment-json");
// const fs = require("fs");

// const obj = parse(fs.readFileSync("package.comments.json").toString());

// console.log(obj.name); // comment-json
// const newPackageJson = stringify(obj, null, " ");
// console.log("newPackageJson", newPackageJson);

const fs = require("fs");
const JSON5 = require("json5");
const jsonDiff = require("json-diff");
const inquirer = require("inquirer");

const packageJson5 = "package.json5";
const packageJson = "package.json";

const generatedPackageJson = JSON.parse(
  JSON.stringify(JSON5.parse(fs.readFileSync(packageJson5)), null, "  ")
);
const originalPackageJson = JSON.parse(fs.readFileSync(packageJson));

const existingDiff = jsonDiff.diff(originalPackageJson, generatedPackageJson);

(async function () {
  if (existingDiff) {
    // error
    console.log(
      "There is a diff between package.json5 and the real package.json"
    );
    console.log(jsonDiff.diffString(originalPackageJson, generatedPackageJson));
    const answer = await inquirer.prompt([
      {
        name: "merge",
        type: "confirm",
        message: "Merge all changes into package.json5?",
        default: false,
      },
    ]);
    console.log("answer", answer);
    if (answer.merge) {
    } else {
      console.log(
        "Did not merge anything! Please resolve the diff manually before running npm install."
      );
      process.exitCode = -1;
    }
  } else {
    console.log("did not find any diff between json and json5");
  }
})();
