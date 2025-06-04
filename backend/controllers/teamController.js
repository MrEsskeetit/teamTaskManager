const Team = require('../models/Team');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

const createTeam = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (!name) {
        res.status(400);
        throw new Error('Nazwa zespołu jest wymagana.');
    }

    if (!req.user) {
        res.status(401);
        throw new Error('Nieautoryzowany. Brak użytkownika w żądaniu.');
    }

    const team = await Team.create({
        name,
        createdBy: req.user._id,
        members: [req.user._id],
    });

    if (team) {
        const user = await User.findById(req.user._id);
        if (user) {
            user.teams.push(team._id);
            await user.save();
        }

        res.status(201).json({
            _id: team._id,
            name: team.name,
            createdBy: team.createdBy,
            members: team.members,
        });
    } else {
        res.status(400);
        throw new Error('Nie udało się utworzyć zespołu.');
    }
});

module.exports = {
    createTeam,
};