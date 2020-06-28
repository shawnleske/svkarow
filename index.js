const express = require('express');
const handlebars = require('express-handlebars');
const fs = require('fs');

const app = express();
const hbs = handlebars.create({
    extname      :'handlebars',
    layoutsDir   : 'dist/view/layouts',
    defaultLayout: 'index',
    helpers      : 'dist/view/helpers',
    partialsDir  : [
        'dist/view/partials'
    ]
});
const PORT = process.env.PORT || 5000;

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/dist/view');
app.use(express.static('dist'));

app.get('/', (req, res) =>  {
    res.render('home');
});

app.get('/home', (req, res) =>  {
    res.render('home');
});

app.get('/news', (req, res) =>  {
    res.render('news');
});

app.get('/verein', (req, res) =>  {
    res.render('verein');
});

app.get('/team/:id', (req, res) =>  {
    var teamId = req.params.id;
    var scorerList = [
        {
            name: 'Sergej Walger',
            goals: 5
        },
        {
            name: 'Sebastian Schure',
            goals: 4
        },
        {
            name: 'Jonathan Reichardt',
            goals: 1
        },
        {
            name: 'Patrick Ifland',
            goals: 1
        },
        {
            name: 'Danny Mucha',
            goals: 1
        },
        {
            name: 'Andre Baalcke',
            goals: 2
        },
        {
            name: 'Andreas Barth',
            goals: 3
        },
        {
            name: 'Milan Moravac',
            goals: 1
        },
        {
            name: 'Christian Bachmann',
            goals: 1
        },
        {
            name: 'Max Zesch',
            goals: 1
        },
        {
            name: 'Daniel Neumann',
            goals: 3
        },
        {
            name: 'Nico Käding',
            goals: 1
        },
        {
            name: 'Hendrik Vogt',
            goals: 2
        },
        {
            name: 'Dennis Ziepel',
            goals: 1
        },
    ];

    scorerList.sort((a, b) => {
        if(a.goals > b.goals)
            return -1;
        else if(a.goals < b.goals)
            return 1;
        else
            return 0;
    });
    
    let lastElemGoals = 0;
    let lastElemPlace = 1;
    scorerList.forEach(scorer => {
        if(lastElemGoals === 0){
            lastElemGoals = scorer.goals;
            scorer.place = lastElemPlace;
        }
        else if (lastElemGoals > scorer.goals){
            lastElemGoals = scorer.goals;
            scorer.place = ++lastElemPlace;
        }
        else {
            scorer.place = '';
        }
    });

    console.log(scorerList);

    res.render('team', {scorerList: scorerList});
});

app.get('/kalender', (req, res) =>  {
    res.render('calendar');
});

app.get('/api/bannerimages', (req, res) =>  {
    fs.readdir(__dirname + '/dist/img/banner', (err, files) => {
        if (req.accepts('json')) {
            res.send(files);
        }
    });
});

app.use((req, res) => {
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
        res.render('404', { url: req.url });
        return;
    }

    // respond with json
    if (req.accepts('json')) {
        res.send({ error: 'Not found' });
        return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
});

app.listen(PORT, () => console.log(`server running on port ${PORT}`));