const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];//dzieliStringi

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                res.status(401);
                throw new Error('Nieautoryzowany uztkownik nie znaleziony.');
            }

            next();//Nextmiddleware
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Nieautoryzowany, token nieprawidłowy lub wygasł.');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Nieautoryzowany, brak tokenu.');
    }
});



module.exports = { protect,};