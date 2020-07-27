#!/usr/bin/env node

const { writeFile } = require("fs");

main();

async function main() {
  const deps = "../deps.json";
  const devDeps = "../dev_deps.json";
  const wantToAdd = process.argv[2];

  if (!wantToAdd) return;

  const isDev = process.argv.includes("-D");

  const target = isDev ? devDeps : deps;
  const source = isDev ? require("../dev_deps.json") : require("../deps.json");

  source.push(wantToAdd);

  await new Promise((resolve) => {
    writeFile(target, JSON.stringify(source.sort()), () => {
      resolve();
    });
  });
}
