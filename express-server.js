const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const {logger} = require('./middleware/logEvents');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

// Cross-Origin Resource Sharing (CORS) is a security feature that restricts cross-origin HTTP requests that are initiated from scripts running in the browser.
const whitelist = ['http://localhost:3000', 'http://localhost:3001'];
app.use(cors());

const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }, 
    optionsSuccessStatus: 200
};
// Custom middleware logger
app.use(logger);
// Environment variable PORT or 3000
const PORT = process.env.PORT || 3000;
// built-in middleware to serve static files from the 'public' directory
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


app.get('^/$|/index(.html)?', ( req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
}); 

app.get('/new-page(.html)?', ( req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});  

app.get('/old-page(.html)?', ( req, res) => {
    res.redirect(301,'/new-page.html');
}); 

app.all('*', ( req, res) => {
    res.status(404);
    if (req.accept('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }
    else if (req.accept('json')) {
        res.json({error: 'Resource not found'});
    }
    else {
        res.type('txt').send('404 Not Found');
    }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
