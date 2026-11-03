const fs = require('fs');
const path = require('path');

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.next' && f !== '.vercel') searchDir(full);
    } else if (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.json')) {
      const content = fs.readFileSync(full, 'utf8');
      const matches = [];
      ['"wealth"', "'wealth'", '"mindset"', "'mindset'", '"psychology"', "'psychology'", '"career"', "'career'"].forEach((m) => {
        if (content.includes(m)) matches.push(m);
      });
      if (matches.length > 0) {
        console.log(`Match in ${full}: ${matches.join(', ')}`);
      }
    }
  }
}

searchDir(path.join(__dirname, '..', 'src'));
