const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const {logger} = require('./middleware/logEvents');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');

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

// built-in middleware to parse cookies
app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/subdir', express.static(path.join(__dirname, 'public')));

app.use('/subdir', require('./routes/subdir'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use('/', require('./routes/root'));

app.use(verifyJWT);


app.all('*', ( req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
