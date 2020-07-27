#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
const { join } = require("path");
const { copydir, run } = require("./util");
const deps = require("../deps.json");
const devDeps = require("../dev_deps.json");
const projectName = (_a = process.argv[2]) !== null && _a !== void 0 ? _a : process.exit(0);
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(join(__dirname, "../template"));
        yield copydir(join(__dirname, "../template"), projectName);
        process.chdir(projectName);
        let cmd = ["npm", "i", ...deps];
        console.log(cmd.join(" "));
        yield run({ cmd });
        cmd = ["npm", "i", "-D", ...devDeps];
        console.log(cmd.join(" "));
        run({ cmd });
    });
}
//# sourceMappingURL=main.js.map