#!/bin/env node
import { Command } from "commander";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import { basename, dirname, extname, join } from "path";

import openEditor from "./src/open-editor-mod.mjs";
import createJsonc from "./src/create-jsonc.js";
import createJom from "./src/create-jom.js";
import generatePreamble from "./src/generate-preamble.js";
import chalk from "chalk";

const selfInfo = JSON.parse(
  readFileSync("./package.json", { encoding: "utf-8" })
);

const program = new Command();

const DEFAULT_FILE = "package.json";

program
  .name("jom")
  .description("comment json files without modifying the file itself")
  .version(selfInfo.version);

program
  .command("edit [jsonFile]")
  .description("edit a json file with its corresponding comments file")
  .action(async (jsonFile) => {
    if (!jsonFile) {
      jsonFile = DEFAULT_FILE;
    }

    const jsonBasename = basename(jsonFile, extname(jsonFile));
    const jomFile = join(dirname(jsonFile), `${jsonBasename}.jom`);
    const jsonc = await createJsonc(jsonFile, jomFile);
    const jsoncFileName = `${jsonBasename}.jom.tmp.jsonc`;

    writeFileSync(jsoncFileName, jsonc);

    await openEditor(
      [
        {
          file: jsoncFileName,
        },
      ],
      { wait: true }
    );

    createJom(jsonFile, jomFile, jsoncFileName);
    unlinkSync(jsoncFileName);
  });

program
  .command("cat [jsonFile]")
  .description("print out the json file with comments")
  .action(async (jsonFile) => {
    if (!jsonFile) {
      jsonFile = DEFAULT_FILE;
    }

    const jsonBasename = basename(jsonFile, extname(jsonFile));
    const jomFile = join(dirname(jsonFile), `${jsonBasename}.jom`);
    const jsonc = await createJsonc(jsonFile, jomFile);

    console.log(jsonc);
  });

program.parse();
