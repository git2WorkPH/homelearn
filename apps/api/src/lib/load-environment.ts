import { config as loadDotenv } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const apiRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const repositoryRoot = resolve(apiRoot, '../..');

loadDotenv({
  path: [resolve(apiRoot, '.env'), resolve(repositoryRoot, '.env')],
  quiet: true,
});
