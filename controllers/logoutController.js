const userDB = {
    users: require('../model/users.json'),
    setUsers: function(data) {
        this.users = data;
    }
}

const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async (req, res) => {
    // On client side, delete the access token as well    
    const cookies = req.cookies;
    if (!cookies.jwt) {
        return res.sendStatus(204); // No Content
    }
    const refreshToken = cookies.jwt;
    // find the user with the refresh token
    const found = userDB.users.find(person => person.refreshToken === refreshToken);
    if (!found) {
        res.clearCookie('jwt', { httpOnly: true });
        return res.sendStatus(204); // No Content
    }
    // remove the refresh token from the user
    const otherUsers = userDB.users.filter(person => person.refreshToken !== refreshToken);
    const currentUser = { ...found, refreshToken: '' };
    userDB.setUsers([...otherUsers, currentUser]);
    // write the updated user list to the file
    await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(userDB.users));  
    res.clearCookie('jwt', { httpOnly: true }); // secure: true for HTTPS only  
    res.sendStatus(204); // No Content
}

module.exports = handleLogout;