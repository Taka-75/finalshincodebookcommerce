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

const regex = /(?:\/\/[#@]\s*sourceMappingURL=|\/\*#\s*sourceMappingURL=)([^\s*\n]+)(?:\s*\*\/)?/g;
let problems = 0;

walk(path.join(root, '.next'), (file) => {
  if (!file.endsWith('.js') && !file.endsWith('.mjs')) return;
  const s = fs.readFileSync(file, 'utf8');
  let m;
  while ((m = regex.exec(s)) !== null) {
    const url = m[1];
    try {
      if (/^data:/.test(url)) {
        // try decode base64
        const b64 = url.split(',')[1] || '';
        // if base64 contains spaces or non-base64 chars it's invalid
        const clean = b64.replace(/\s+/g, '');
        const buf = Buffer.from(clean, 'base64');
        const json = buf.toString('utf8');
        JSON.parse(json);
      } else {
        // try parse as URL, allow relative by prefixing a base
        new URL(url, 'http://example.com/');
      }
    } catch (err) {
      problems++;
      console.error('\n--- Invalid sourceMappingURL in file:', file);
      console.error('sourceMappingURL:', url);
      console.error('Error:', err.message);
      const start = Math.max(0, m.index - 80);
      const snippet = s.substring(start, Math.min(start + 400, s.length));
      console.error('Snippet:\n', snippet.replace(/\n/g, '\\n'));
    }
  }
});

if (problems === 0) {
  console.log('All sourceMappingURL entries look syntactically valid.');
} else {
  console.log('Total invalid entries found:', problems);
  process.exitCode = 2;
}