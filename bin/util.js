var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
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
function walk(dir) {
    return __asyncGenerator(this, arguments, function* walk_1() {
        var e_1, _a;
        try {
            for (var _b = __asyncValues(yield __await(opendir(dir))), _c; _c = yield __await(_b.next()), !_c.done;) {
                const i = _c.value;
                const cur = join(dir, i.name);
                yield yield __await(i);
                if (i.isDirectory()) {
                    yield __await(yield* __asyncDelegator(__asyncValues(walk(cur))));
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) yield __await(_a.call(_b));
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
/**
 * @param {string} dir
 * @returns {Promise<boolean>}
 */
function ensure(dir) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            exists(dir, (exists) => {
                if (!exists) {
                    mkdir(dir, (err) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(true);
                    });
                }
                else {
                    resolve(true);
                }
            });
        });
    });
}
/**
 *
 * @param {string} src
 * @param {string} dest
 */
function copydir(src, dest) {
    var e_2, _a;
    return __awaiter(this, void 0, void 0, function* () {
        yield ensure(dest);
        const processes = [];
        try {
            for (var _b = __asyncValues(yield opendir(src)), _c; _c = yield _b.next(), !_c.done;) {
                const i = _c.value;
                const from = join(src, i.name);
                const target = join(dest, i.name);
                const cp = i.isDirectory() ? copydir : copyFile;
                processes.push(cp(from, target));
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        yield Promise.all(processes);
    });
}
/**
 *
 * @param {{
 *  cmd: string[]
 * }} opt
 *
 * @returns {Promise<undefined>}
 */
function run(opt) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
module.exports = { walk, ensure, copydir, run };
//# sourceMappingURL=util.js.map