const Express = require('express');
const Handlebars = require('handlebars');

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) =>  {
    res.render('index');
});

app.listen(PORT, () => console.log(`server running on port ${PORT}`));



// const http = require('http');
// const path = require('path');
// const fs = require('fs');

// const route = {
//     index: {
//         page: 'home.html'
//     },
//     about: {
//         page: 'about.html'
//     }
// }

// const server = http.createServer((req, res) => {
//     let filePath = path.join(__dirname, 'dist', req.url === '/' || req.url === '/index' || req.url === '/index.html' ? 'home.html' : req.url)
//     let extName = path.extname(filePath);
//     let contentType = 'text/html';

//     if(req.url === '/bannerimages') {
//         let dirPath = path.join(__dirname, 'dist', 'img', 'banner');

//         fs.readdir(dirPath, (err, files) => {
//             if(err) {
//                 res.writeHead(500);
//                 res.end(`Server Error: ${err.code}`);
//             };

//             res.writeHead(200, {'Content-Type': 'text/plain'});
//             res.end(JSON.stringify(files));
//         })
//     }

//     if (extName === '') {
//         filePath += '.html';
//         extName = '.html';
//     }

//     switch(extName) {
//         case '.js':
//             contentType = 'text/javascript';
//             break;
//         case '.css':
//             contentType = 'text/css';
//             break;
//         case '.json':
//             contentType = 'application/json';
//             break;
//         case '.png':
//             contentType = 'image/png';
//             break;
//         case '.jpg':
//             contentType = 'image/jpg';
//             break;
//     }

//     fs.readFile(filePath, (err, content) => {
//         let headerContent = fs.readFileSync(path.join(__dirname, 'dist', 'header.html'));
//         let footerContent = fs.readFileSync(path.join(__dirname, 'dist', 'footer.html'));

//         if(extName === '.html') {
//             if (err) {
//                 if (err.code == 'ENOENT') {
//                     fs.readFile(path.join(__dirname, 'dist', '404.html'), (err, content) => {
//                         res.writeHead(200, {'Content-Type': 'text/html'});
//                         res.end(headerContent + content + footerContent, 'utf-8');
//                     });
//                 } else {
//                     res.writeHead(500);
//                     res.end(`Server Error: ${err.code}`);
//                 }
//             } else {
//                 res.writeHead(200, {'Content-Type': contentType});
//                 res.end(headerContent + content + footerContent, 'utf-8');
//             }
//         } else {
//             if (err) {
//                 res.writeHead(500);
//                 res.end(`Server Error: ${err.code}`);
//             } else {
//                 res.writeHead(200, {'Content-Type': contentType});
//                 res.end(content, 'utf-8');
//             }
//         }
//     });
// });

// server.listen(PORT, () => console.log(`server running on port ${PORT}`));