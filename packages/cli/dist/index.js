/* eslint-disable @typescript-eslint/no-var-requires */
import * as chokidar from 'chokidar';
import { j2a, j2aFile, ParseType } from './utils/j2a';
const { Command } = require('commander');
const program = new Command();
program
    .description('convert path/to/*.json to path/to/*.any')
    .version(require('../package.json').version)
    .option('-i, --input <path>', 'json source directory path')
    .option('-o, --output <path>', 'export directory path')
    .option('-t, --type <type>', 'typescript dart', 'typescript')
    .option('-w, --watch', 'watch mode');
program.parse(process.argv);
function main() {
    const { input, output, type = 'typescript', watch } = program;
    const parseType = ParseType[type];
    if (!parseType) {
        console.log(`type <${type}> is not support`);
        return;
    }
    if (!input || !output) {
        console.log('j2a -i dir/input -o dir/output -t typescript');
        return;
    }
    if (watch) {
        chokidar.watch(input).on('all', (event, path) => {
            if (!['add', 'change'].includes(event))
                return;
            console.log(`${event} ${path}`);
            const paths = path.split('/');
            const fileName = paths[paths.length - 1];
            j2aFile(input, fileName, output, parseType);
        });
        return;
    }
    j2a(input, output, parseType);
}
main();
