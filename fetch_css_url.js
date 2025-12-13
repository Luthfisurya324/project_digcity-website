
import fs from 'fs';

fetch('https://digcity.my.id/')
    .then(r => r.text())
    .then(t => {
        // Look for <link rel="stylesheet" ... href="...">
        // Or just href="/assets/index-....css"
        const match = t.match(/href="(\/assets\/index-[^"]+\.css)"/);
        if (match) {
            const url = 'https://digcity.my.id' + match[1];
            console.log('Found URL:', url);
            fs.writeFileSync('css_url.txt', url);
        } else {
            console.error('CSS file not found in HTML');
            // Dump to debug file
            fs.writeFileSync('debug_html.html', t);
        }
    })
    .catch(e => {
        console.error(e);
    });
