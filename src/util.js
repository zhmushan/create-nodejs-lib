// const { exists, mkdir, opendir, copyFile, Dirent } = require("fs");
const fs = require("fs");
const { promisify } = require("util");
const { join } = require("path");
const { spawn } = require("child_process");
const { platform } = require("os");

const { exists, mkdir } = fs;
const opendir = promisify(fs.opendir);
const copyFile = promisify(fs.copyFile);
const isWin = platform() === "win32";

/**
 * @param {string} dir
 * @returns {AsyncIterableIterator<fs.Dirent>}
 */
async function* walk(dir) {
  for await (const i of await opendir(dir)) {
    const cur = join(dir, i.name);
    yield i;
    if (i.isDirectory()) {
      yield* walk(cur);
    }
  }
}

/**
 * @param {string} dir
 * @returns {Promise<boolean>}
 */
async function ensure(dir) {
  return new Promise((resolve, reject) => {
    exists(dir, (exists) => {
      if (!exists) {
        mkdir(dir, (err) => {
          if (err) {
            reject(err);
          }

          resolve(true);
        });
      } else {
        resolve(true);
      }
    });
  });
}

/**
 *
 * @param {string} src
 * @param {string} dest
 */
async function copydir(src, dest) {
  await ensure(dest);
  const processes = [];
  for await (const i of await opendir(src)) {
    const from = join(src, i.name);
    const target = join(dest, i.name);
    const cp = i.isDirectory() ? copydir : copyFile;
    processes.push(cp(from, target));
  }

  await Promise.all(processes);
}

/**
 *
 * @param {{
 *  cmd: string[]
 * }} opt
 *
 * @returns {Promise<undefined>}
 */
async function run(opt) {
  return new Promise((resolve, reject) => {
    const cmd = isWin ? "powershell" : opt.cmd.shift();
    const p = spawn(cmd, opt.cmd, {
      stdio: "inherit",
    });

    p.on("close", () => {
      resolve();
    });
    p.on("error", (err) => {
      reject(err);
    });
  });
}

module.exports = { walk, ensure, copydir, run };
