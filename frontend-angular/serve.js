const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 4200;
const PUBLIC_DIR = path.join(__dirname, 'src');

const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.js': 'text/javascript; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'application/font-woff',
    '.woff2': 'application/font-woff2',
    '.ttf': 'application/font-sfnt'
};

const server = http.createServer((req, res) => {
    // Nettoyer l'URL
    let safeUrl = req.url.split('?')[0];
    let filePath = path.join(PUBLIC_DIR, safeUrl);

    // Vérifier si le chemin existe
    fs.stat(filePath, (err, stats) => {
        if (!err && stats.isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        }

        fs.readFile(filePath, (readErr, content) => {
            if (!readErr) {
                const ext = path.extname(filePath).toLowerCase();
                res.writeHead(200, {
                    'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(content);
            } else {
                // Fallback SPA (index.html) pour Angular routing
                const indexPath = path.join(PUBLIC_DIR, 'index.html');
                fs.readFile(indexPath, (fallbackErr, indexContent) => {
                    if (!fallbackErr) {
                        res.writeHead(200, {
                            'Content-Type': 'text/html; charset=UTF-8',
                            'Access-Control-Allow-Origin': '*'
                        });
                        res.end(indexContent);
                    } else {
                        res.writeHead(404, { 'Content-Type': 'text/plain' });
                        res.end('Fichier non trouvé');
                    }
                });
            }
        });
    });
});

server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`Frontend Patrimoine Touristique demarre sur :`);
    console.log(`http://localhost:${PORT}`);
    console.log(`Dossier servi : ${PUBLIC_DIR}`);
    console.log(`=======================================================`);
});
