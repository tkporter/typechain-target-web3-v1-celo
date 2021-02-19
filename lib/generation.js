"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codegen = void 0;
const lodash_1 = require("lodash");
function codegen(contract, abi) {
    const template = `
  import { AbiItem, Callback, CeloTxObject, Contract, EventLog } from '@celo/connect'
  import { EventEmitter } from 'events'
  import Web3 from 'web3'
  import {${lodash_1.values(contract.events).length ? 'ContractEvent,' : ''} EventOptions } from './types'

  export interface ${contract.name} extends Contract {
    clone(): ${contract.name}
    methods: {
      ${codegenForFunctions(contract.functions)}
    }
    events: {
      ${codegenForEvents(contract.events)}
      allEvents: (
          options?: EventOptions,
          cb?: Callback<EventLog>
      ) => EventEmitter
    }
  }
  export const ABI: AbiItem[] = ${JSON.stringify(abi)}

  export function new${contract.name}(web3: Web3, address: string): ${contract.name} {
    return new web3.eth.Contract(ABI, address) as any
  }
  `;
    return template;
}
exports.codegen = codegen;
function codegenForFunctions(fns) {
    return lodash_1.values(fns)
        .map((v) => v[0])
        .map(generateFunction)
        .join('\n');
}
function generateFunction(fn) {
    return `
  ${fn.name}(${generateInputTypes(fn.inputs)}): CeloTxObject<${generateOutputTypes(fn.outputs)}>;
`;
}
function generateInputTypes(inputs) {
    if (inputs.length === 0) {
        return '';
    }
    return (inputs
        .map((input, index) => `${input.name || `arg${index}`}: ${generateInputType(input.type)}`)
        .join(', ') + ', ');
}
function generateOutputTypes(outputs) {
    if (outputs.length === 1) {
        return generateOutputType(outputs[0].type);
    }
    else {
        return `{
      ${outputs.map((t) => t.name && `${t.name}: ${generateOutputType(t.type)}, `).join('')}
      ${outputs.map((t, i) => `${i}: ${generateOutputType(t.type)}`).join(', ')}
      }`;
    }
}
function codegenForEvents(events) {
    return lodash_1.values(events)
        .map((e) => e[0])
        .map(generateEvent)
        .join('\n');
}
function generateEvent(event) {
    return `${event.name}: ContractEvent<${generateOutputTypes(event.inputs)}>`;
}
function generateInputType(evmType) {
    switch (evmType.type) {
        case 'integer':
        case 'uinteger':
            return 'number | string';
        case 'address':
            return 'string';
        case 'bytes':
        case 'dynamic-bytes':
            return 'string | number[]';
        case 'array':
            return `(${generateInputType(evmType.itemType)})[]`;
        case 'boolean':
            return 'boolean';
        case 'string':
            return 'string';
        case 'tuple':
            return generateTupleType(evmType, generateInputType);
    }
    return '';
}
function generateOutputType(evmType) {
    switch (evmType.type) {
        case 'integer':
            return 'string';
        case 'uinteger':
            return 'string';
        case 'address':
            return 'string';
        case 'void':
            return 'void';
        case 'bytes':
        case 'dynamic-bytes':
            return 'string';
        case 'array':
            return `(${generateOutputType(evmType.itemType)})[]`;
        case 'boolean':
            return 'boolean';
        case 'string':
            return 'string';
        case 'tuple':
            return generateTupleType(evmType, generateOutputType);
    }
    return '';
}
function generateTupleType(tuple, generator) {
    return ('{' +
        tuple.components
            .map((component) => `${component.name}: ${generator(component.type)}`)
            .join(', ') +
        '}');
}
//# sourceMappingURL=generation.js.map