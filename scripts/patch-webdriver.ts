import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname: string = fileURLToPath(new URL('.', import.meta.url));
const filesToPatch: string[] = [
    join(__dirname, '..', 'node_modules', 'webdriver', 'build', 'node.js'),
    join(__dirname, '..', 'node_modules', 'webdriver', 'build', 'index.js'),
];

let patchedCount: number = 0;

for (const filePath of filesToPatch) {
    let src: string;
    try {
        src = readFileSync(filePath, 'utf8');
    } catch {
        continue;
    }

    let patched: string = src;

    patched = patched.replace(
        /^\s*"Connection":\s*"keep-alive",?\s*$/m,
        '  // "Connection": "keep-alive",  // Removed: forbidden header in Node >= 26',
    );

    patched = patched.replace(
        /^(\s*)requestHeaders\.set\("Content-Length",\s*[^)]+\);/m,
        '$1// requestHeaders.set("Content-Length", ...);  // Removed: forbidden header in Node >= 26',
    );

    if (patched !== src) {
        writeFileSync(filePath, patched, 'utf8');
        patchedCount++;
        console.log(`✔ Patched: ${filePath}`);
    } else {
        console.log(`⊘ Already patched or no match: ${filePath}`);
    }
}

if (patchedCount > 0) {
    console.log(`\nDone – patched ${patchedCount} file(s).`);
} else {
    console.log('\nNothing to patch.');
}
