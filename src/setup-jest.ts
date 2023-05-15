import { TextDecoder, TextEncoder } from "node:util";

global.TextEncoder = TextEncoder;

/*
 * Using a JSDOM environment so that @testing-library/react-hooks works
 * breaks node-fetch because TextDecoder isn't present. This shim is stolen
 * from StackOverflow: https://stackoverflow.com/questions/57712235/referenceerror-textencoder-is-not-defined-when-running-react-scripts-test/57713960#57713960
 */
global.TextDecoder = TextDecoder as (typeof global)["TextDecoder"];
