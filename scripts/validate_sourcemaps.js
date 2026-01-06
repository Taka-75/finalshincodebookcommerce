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

const dataUriRegex = /sourceMappingURL=data:application\/json(?:;charset=[^;]+)?;base64,([A-Za-z0-9+/=\s]+)/ig;
let problems = 0;

walk(path.join(root, '.next'), (file) => {
  if (!file.endsWith('.js') && !file.endsWith('.mjs')) return;
  const s = fs.readFileSync(file, 'utf8');
  let m;
  while ((m = dataUriRegex.exec(s)) !== null) {
    const b64 = m[1].replace(/\s+/g, '');
    try {
      const json = Buffer.from(b64, 'base64').toString('utf8');
      JSON.parse(json);
      // valid
    } catch (err) {
      problems++;
      console.error('\n--- Invalid inline source map in file:', file);
      console.error('Error:', err.message.slice(0, 200));
      const start = Math.max(0, m.index - 80);
      const snippet = s.substring(start, Math.min(start + 400, s.length));
      console.error('Snippet:\n', snippet.replace(/\n/g, '\\n'));
    }
  }
});

if (problems === 0) {
  console.log('No invalid inline source maps found in .next JS files.');
} else {
  console.log('Total invalid inline source maps found:', problems);
  process.exitCode = 2;
}