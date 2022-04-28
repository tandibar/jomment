import fs from "fs";
import { basename, extname } from 'path';
import { parse, stringify } from "comment-json";
import debug from "debug";

const debugLogger = debug('jomment')
const SYM_PREFIX = "###SYM###-";

function createSymbols(jsonWithEncodedSymbols, packageJson) {
  console.log("packageJson", packageJson);
  for (const key in jsonWithEncodedSymbols) {
    if (key.startsWith(SYM_PREFIX)) {
      debugLogger("found symbol: ", key);
      const symbolString = key.slice(SYM_PREFIX.length);
      // debugLogger("symbolString", symbolString);
      const match = symbolString.match(/Symbol\((.*?)\)/);
      // debugLogger("match", match);
      const symbolName = match[1];
      debugLogger("symbolName", symbolName);
      debugLogger("symbolValue", jsonWithEncodedSymbols[key]);
      packageJson[Symbol.for(symbolName)] = jsonWithEncodedSymbols[key];
    } else {
      if (jsonWithEncodedSymbols[key] instanceof Object) {
        debugLogger("start --- search recursive in", key);
        createSymbols(jsonWithEncodedSymbols[key], packageJson[key]);
        debugLogger("end --- search recursive in", key);
      } else {
        debugLogger("I think this case should never happen!!!!!!!!!!!!!!!");
      }
    }
  }
}

export default function(jsonFilePath, jomFilePath) {
  const jomComments = JSON.parse(
    // skip first 5 lines (preamble)
    fs.readFileSync(jomFilePath, "utf-8").split('\n').slice(5).join('\n')
  );
  
  const jsonWithoutComments = parse(fs.readFileSync(jsonFilePath, "utf-8"));
  const jsonWithComments = jsonWithoutComments;
  
  createSymbols(
    jomComments,
    jsonWithComments
  );
  
  const jsonBasename = basename(jsonFilePath, extname(jsonFilePath));
  const jsoncFileName = `${jsonBasename}.jom.tmp.jsonc`;

  fs.writeFileSync(jsoncFileName, stringify(jsonWithComments, null, 2));
  
  return jsoncFileName;
}

