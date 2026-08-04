#!/usr/bin/env node
// Adds explicit `import { ... } from "vuetify/components"` to SFCs for every
// Vuetify tag used in their template. Run from client/:
//
//   node ../.scratch/explicit-vuetify-imports/codemod.mjs src/components src/utils src/App.vue
//
// - Templates are never modified; kebab-case tags stay.
// - Existing vuetify/components value imports are extended, not duplicated.
// - Template-only SFCs get a <script setup lang="ts"> block after </template>.
// - Every name is validated against the actual exports of vuetify/components
//   (collected from node_modules/vuetify/lib/components/*/index.d.ts).
//   Unknown v-*/V* tags are reported and fail the run.

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const componentsDir = "node_modules/vuetify/lib/components";
const validNames = new Set();
for (const entry of readdirSync(componentsDir)) {
    const indexDts = join(componentsDir, entry, "index.d.ts");
    let dts;
    try {
        dts = readFileSync(indexDts, "utf8");
    } catch {
        continue;
    }
    for (const match of dts.matchAll(/export\s*\{([^}]*)\}/g)) {
        for (const rawName of match[1].split(",")) {
            const name = rawName.trim().replace(/^type\s+/, "");
            if (/^V[A-Z]/.test(name)) {
                validNames.add(name);
            }
        }
    }
    for (const match of dts.matchAll(/export declare const (V[A-Za-z0-9]+)/g)) {
        validNames.add(match[1]);
    }
}
if (validNames.size === 0) {
    console.error("No vuetify/components exports found — run from client/");
    process.exit(1);
}

const files = [];
function collect(path) {
    if (statSync(path).isDirectory()) {
        for (const entry of readdirSync(path)) {
            collect(join(path, entry));
        }
    } else if (path.endsWith(".vue")) {
        files.push(path);
    }
}
process.argv.slice(2).forEach(collect);

const kebabToPascal = (tag) =>
    tag
        .split("-")
        .map((part) => part[0].toUpperCase() + part.slice(1))
        .join("");

const unknownTags = new Map();
const changedFiles = [];
const allUsedNames = new Set();

for (const file of files) {
    const content = readFileSync(file, "utf8");
    const templateStart = content.search(/<template[\s>]/);
    const templateEnd = content.lastIndexOf("</template>");
    if (templateStart === -1 || templateEnd === -1) {
        continue;
    }
    const template = content
        .slice(templateStart, templateEnd)
        .replace(/<!--[\s\S]*?-->/g, "");

    const usedNames = new Set();
    for (const match of template.matchAll(/<(v-[a-z][a-z0-9-]*|V[A-Za-z0-9]+)[\s/>]/g)) {
        const tag = match[1];
        const name = tag.startsWith("v-") ? kebabToPascal(tag) : tag;
        if (validNames.has(name)) {
            usedNames.add(name);
        } else {
            if (!unknownTags.has(tag)) {
                unknownTags.set(tag, []);
            }
            unknownTags.get(tag).push(file);
        }
    }
    if (usedNames.size === 0) {
        continue;
    }

    const importRegex =
        /import(?!\s+type)\s*\{([^}]*)\}\s*from\s*"vuetify\/components";?\n?/;
    const existingImport = content.match(importRegex);

    const existingNames = new Set(
        existingImport
            ? existingImport[1]
                  .split(",")
                  .map((name) => name.trim())
                  .filter(Boolean)
            : [],
    );
    const merged = [...new Set([...existingNames, ...usedNames])].sort();
    if (merged.length === existingNames.size) {
        continue;
    }
    merged.forEach((name) => allUsedNames.add(name));

    const importStatement = `import { ${merged.join(", ")} } from "vuetify/components";`;
    let updated;
    if (existingImport) {
        updated = content.replace(importRegex, `${importStatement}\n`);
    } else {
        const scriptOpen = content.match(
            /<script setup(?:"[^"]*"|'[^']*'|[^>"'])*>/,
        );
        if (scriptOpen) {
            const insertAt = content.indexOf(scriptOpen[0]) + scriptOpen[0].length;
            updated = `${content.slice(0, insertAt)}\n${importStatement}${content.slice(insertAt)}`;
        } else {
            const afterTemplate = templateEnd + "</template>".length;
            updated = `${content.slice(0, afterTemplate)}\n\n<script setup lang="ts">\n${importStatement}\n</script>${content.slice(afterTemplate)}`;
        }
    }
    writeFileSync(file, updated);
    changedFiles.push(file);
}

console.log(`Changed ${changedFiles.length} of ${files.length} .vue files`);
console.log(`Distinct components imported: ${allUsedNames.size}`);
for (const file of changedFiles) {
    console.log(`  ${file}`);
}
if (unknownTags.size > 0) {
    console.error("\nUnknown v-*/V* tags (not exported by vuetify/components):");
    for (const [tag, tagFiles] of unknownTags) {
        console.error(`  <${tag}> in ${[...new Set(tagFiles)].join(", ")}`);
    }
    process.exit(1);
}
