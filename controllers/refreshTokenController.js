const userDB = {
    users: require('../model/users.json'),
    setUsers: function(data) {
        this.users = data;
    }
}

const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;
    if (!cookies.jwt) {
        return res.sendStatus(401); // Unauthorized
    }
    console.log('cookies.jwt', cookies.jwt);
    const refreshToken = cookies.jwt;
    const found = userDB.users.find(person => person.refreshToken === refreshToken);
    if (!found) {
        return res.sendStatus(403); // Forbidden
    }
    // evaluate the refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err || found.username !== user.username) {
            return res.sendStatus(403); // Forbidden
        }
        const accessToken = jwt.sign(
            { username: user.username }, 
            process.env.ACCESS_TOKEN_SECRET, 
            { expiresIn: '50s' });
        res.json({ accessToken });
    });
}

module.exports = handleRefreshToken;