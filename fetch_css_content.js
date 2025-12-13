
import fs from 'fs';

const cssUrl = 'https://digcity.my.id/assets/style.css';
console.log('Downloading CSS from', cssUrl);

fetch(cssUrl)
    .then(r => {
        if (!r.ok) throw new Error(`Failed to fetch CSS: ${r.status} ${r.statusText}`);
        return r.text();
    })
    .then(css => {
        fs.writeFileSync('src/index.css', css);
        console.log('Successfully wrote to src/index.css (' + css.length + ' bytes)');
    })
    .catch(e => {
        console.error(e);
        process.exit(1);
    });
