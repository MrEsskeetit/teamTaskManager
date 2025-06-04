const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let users = [];
let teams = [];

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Potrzebna nazwa użytkownika i hasło!');
    }

    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(400).send('Taki użytkownik już istnieje!');
    }

    const newUser = { username, password };
    users.push(newUser);

    console.log('Zarejestrowani użytkownicy:', users);
    res.status(201).send('Użytkownik zarejestrowany! Witaj ' + username + '!');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Potrzebna nazwa użytkownika i hasło!');
    }

    const user = users.find(u => u.username === username);
    if (user && user.password === password) {
        res.send('Zalogowano pomyślnie jako ' + username + '!');
    } else {
        res.status(400).send('Zła nazwa użytkownika lub hasło!');
    }
});

app.post('/teams/create', (req, res) => {
    const { teamName, creatorUsername } = req.body;
    if (!teamName || !creatorUsername) {
        return res.status(400).send('Potrzebna nazwa zespołu i nazwa twórcy!');
    }

    const creatorExists = users.find(user => user.username === creatorUsername);
    if (!creatorExists) {
        return res.status(400).send('Nie ma takiego użytkownika, który mógłby stworzyć zespół. Zarejestruj się najpierw!');
    }

    const newTeam = { teamName, creator: creatorUsername, members: [creatorUsername] };
    teams.push(newTeam);

    console.log('Stworzone zespoły:', teams);
    res.status(201).send('Zespół "' + teamName + '" stworzony przez ' + creatorUsername + '!');
});

app.listen(port, () => {
    console.log(`apka działa na http://localhost:${port}`);
});