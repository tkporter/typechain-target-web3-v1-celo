import { TContext, TFileDesc, TsGeneratorPlugin } from 'ts-generator';
export interface IWeb3Cfg {
    outDir?: string;
}
export default class Web3V1Celo extends TsGeneratorPlugin {
    name: string;
    private readonly outDirAbs;
    constructor(ctx: TContext<IWeb3Cfg>);
    transformFile(file: TFileDesc): TFileDesc | void;
    afterRun(): TFileDesc[];
}
