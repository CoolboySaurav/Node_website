const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;


const logEvent = require('./logEvents');
const EventEmitter = require('events');
class Emitter extends EventEmitter {};
// create a new instance of the Emitter class
const myEmitter = new Emitter();
myEmitter.on('log', (msg, logFile) => logEvent(msg, logFile));


const PORT = process.env.PORT || 3000;

const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData = await fsPromises.readFile(filePath, 
            !contentType.includes('image') ? 'utf8' : ''
        );
        const data = contentType === 'application/json' ? JSON.parse(rawData) : rawData;
        response.writeHead(
            filePath.includes('404.html') ? 404 : 200, 
            { 'Content-Type': contentType });
        response.end(
            contentType === 'application/json' ? JSON.stringify(data) : data
        );
    } catch (error) {
        console.log('Error reading file', error);
        myEmitter.emit('log', `${error.name} : ${error.message}\n`, 'errLog.txt');
        response.statusCode = 500;
        response.end();
    }
}

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    myEmitter.emit('log', `${req.url}\t${req.method}\n`, 'reqLog.txt');
    const extension = path.extname(req.url);

    let contentType;

    switch (extension) {
        case '.html':
            contentType = 'text/html';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';

    }

    let filePath = 
        contentType === 'text/html' && req.url === '/' 
            ? path.join(__dirname, 'views', 'index.html')
            : contentType === 'text/html' && req.url.slice(-1) === '/'
                ? path.join(__dirname, 'views', req.url, 'index.html')
                : contentType === 'text/html'
                    ? path.join(__dirname, 'views', req.url)
                    : path.join(__dirname, req.url);
    
    if (!extension && req.url !== '/') {
        filePath += '.html';
    }

    const fileExist = fs.existsSync(filePath);

    if (fileExist) {
        serveFile(filePath, contentType, res);
    } else {
        switch(path.parse(filePath).base){
            case 'old-page.html':
                res.writeHead(301, { Location: '/new-page.html' });
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301, { Location: '/' }); 
                res.end();
                break;
            default:
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);
        }    }
});


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
