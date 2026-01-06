const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const walk = (dir, cb) => {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const fp = path.join(dir, f);
    const st = fs.statSync(fp);
    if (st.isDirectory()) walk(fp, cb);
    else cb(fp);
  }
};

let hits = 0;
walk(path.join(root, '.next'), (file) => {
  if (!file.endsWith('.js') && !file.endsWith('.mjs')) return;
  const s = fs.readFileSync(file, 'utf8');
  const re = /sourceMappingURL=[^\n]*?\/\/# sourceURL/g;
  if (re.test(s)) {
    hits++;
    console.log('\n--- Found concatenated comments in:', file);
    const idx = s.search(re);
    const start = Math.max(0, idx - 80);
    console.log(s.substring(start, Math.min(start + 300, s.length)).replace(/\n/g, '\\n'));
  }
});
if (hits === 0) console.log('No concatenated sourceMappingURL...//# sourceURL patterns found in .next files.');
else console.log('Total files with pattern:', hits);