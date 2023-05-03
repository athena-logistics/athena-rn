#!/usr/bin/env node

import { join as pathJoin } from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { format } from 'prettier';
import { exec } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const root = pathJoin(__filename, '..', '..');

const { version } = JSON.parse(readFileSync(pathJoin(root, 'package.json')));

const appJson = JSON.parse(readFileSync(pathJoin(root, 'app.json')));

const patchedAppJson = JSON.stringify(
  {
    ...appJson,
    expo: {
      ...appJson.expo,
      version,
    },
  },
  undefined,
  2
);

const formattedAppJson = format(patchedAppJson, {
  parser: 'json',
  filepath: pathJoin(root, 'app.json'),
});

writeFileSync(pathJoin(root, 'app.json'), formattedAppJson);

exec('git add app.json', { cwd: root });
