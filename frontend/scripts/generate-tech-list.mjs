import * as simpleIcons from 'simple-icons';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const icons = Object.values(simpleIcons).map(icon => ({
  name: icon.title,
  slug: icon.slug
}));

const outputPath = path.join(__dirname, '../constants/tech-list.json');

// Ensure directory exists
const dir = path.dirname(outputPath);
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(icons, null, 2));
console.log(`Generated tech list with ${icons.length} icons at ${outputPath}`);
