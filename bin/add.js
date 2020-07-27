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
const { writeFile } = require("fs");
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const deps = "../deps.json";
        const devDeps = "../dev_deps.json";
        const wantToAdd = process.argv[2];
        if (!wantToAdd)
            return;
        const isDev = process.argv.includes("-D");
        const target = isDev ? devDeps : deps;
        const source = isDev ? require("../dev_deps.json") : require("../deps.json");
        source.push(wantToAdd);
        yield new Promise((resolve) => {
            writeFile(target, JSON.stringify(source.sort()), () => {
                resolve();
            });
        });
    });
}
//# sourceMappingURL=add.js.map