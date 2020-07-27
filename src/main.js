#!/usr/bin/env node

const { join } = require("path");
const { copydir, run } = require("./util");
const deps = require("../deps.json");
const devDeps = require("../dev_deps.json");

const projectName = process.argv[2] ?? process.exit(0);

main();

async function main() {
  await copydir(join(__dirname, "../template"), projectName);

  process.chdir(projectName);
  let cmd = ["npm", "i", ...deps];
  console.log(cmd.join(" "));
  await run({ cmd });

  cmd = ["npm", "i", "-D", ...devDeps];
  console.log(cmd.join(" "));
  run({ cmd });
}
