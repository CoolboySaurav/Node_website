const userDB = {
    users: require('../model/users.json'),
    setUsers: function(data) {
        this.users = data;
    }
}

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const express = require('express');

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
            // create JWTs
            return res.status(401).json({ 'message': 'Invalid password' }); // Unauthorized
        }
        return res.status(200).json({ 'success': `User ${user} is successfully logged in!` });
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
}

module.exports = handleLogin;