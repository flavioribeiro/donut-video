import path from 'path';
import { fileURLToPath } from 'url';

// https://jestjs.io/docs/en/configuration#preset-string
// https://jestjs.io/docs/en/configuration#transform-object-string-string

const __filename = fileURLToPath(import.meta.url);

// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);
export default {
    transform: {
        '\\.(js|jsx|ts|tsx|mjs|cjs)?$': path.resolve(__dirname, 'transform.cjs'),
    },
}