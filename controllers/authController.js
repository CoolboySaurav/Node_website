const userDB = {
    users: require('../model/users.json'),
    setUsers: function(data) {
        this.users = data;
    }
}

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) {
        return res.status(400).json({ 'message': 'Username and password are required' });
    }
    const found = userDB.users.find(person => person.username === user);
    if (!found) {
        return res.status(401).json({ 'message': 'User not found' }); // Unauthorized
    }
    try {
        const match = await bcrypt.compare(pwd, found.password);
        if (!match) {
            return res.status(401).json({ 'message': 'Invalid password' }); // Unauthorized
        }
        // create JWTs
        const accessToken = jwt.sign(
            { "username": found.username},
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '50s' }
        );
        const refreshToken = jwt.sign(
            { "username": found.username},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1h' }
        );
        // store the refresh token in the users.json file
        const otherUsers = userDB.users.filter(person => person.username !== found.username);
        const currentUser = { 
            ...found,
            refreshToken
        };
        userDB.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(userDB.users));

        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 3600000});

        res.status(200).json({ accessToken});
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
}

module.exports = handleLogin;