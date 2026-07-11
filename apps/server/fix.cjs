const fs=require('fs'); 
const path=require('path'); 
function walk(d){ 
  fs.readdirSync(d).forEach(f=>{ 
    const p=path.join(d,f); 
    if(fs.statSync(p).isDirectory()) walk(p); 
    else if(p.endsWith('.ts')){ 
      let c=fs.readFileSync(p,'utf8'); 
      c=c.replace(/from\s+['"](\.[^'"]+)['"]/g, 'from \'$1.js\''); 
      fs.writeFileSync(p,c); 
    } 
  }) 
}; 
walk('src');
