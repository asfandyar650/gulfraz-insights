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
      if (content.includes('avatar') || content.includes('gulfraz-avatar')) {
        console.log(`Match in ${full}`);
      }
    }
  }
}

searchDir(path.join(__dirname, '..', 'src'));
