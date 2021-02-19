"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const ts_generator_1 = require("ts-generator");
const typechain_1 = require("typechain");
const generation_1 = require("./generation");
const DEFAULT_OUT_PATH = './types/web3-v1-celo-ontracts/';
class Web3V1Celo extends ts_generator_1.TsGeneratorPlugin {
    constructor(ctx) {
        super(ctx);
        this.name = 'Web3-v1-celo';
        const { cwd, rawConfig } = ctx;
        this.outDirAbs = path_1.resolve(cwd, rawConfig.outDir || DEFAULT_OUT_PATH);
    }
    transformFile(file) {
        const abi = typechain_1.extractAbi(file.contents);
        const isEmptyAbi = abi.length === 0;
        if (isEmptyAbi) {
            return;
        }
        const name = typechain_1.getFilename(file.path);
        const contract = typechain_1.parse(abi, name);
        return {
            path: path_1.join(this.outDirAbs, `${name}.ts`),
            contents: generation_1.codegen(contract, abi),
        };
    }
    afterRun() {
        return [
            {
                path: path_1.join(this.outDirAbs, 'types.ts'),
                contents: fs_1.readFileSync(path_1.join(__dirname, '../static/types.ts'), 'utf-8'),
            },
        ];
    }
}
exports.default = Web3V1Celo;
//# sourceMappingURL=index.js.map