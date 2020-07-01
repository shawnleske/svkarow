const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.render('home'));
router.get('/home', (req, res) => res.render('home'));
router.get('/news', (req, res) => res.render('news'));
router.get('/verein', (req, res) => res.render('verein'));
router.get('/kalender', (req, res) => res.render('calendar'));

router.get('/team/:id', (req, res) =>  {
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
    
    let prevGoals = 0;
    let prevPlace = 1;
    scorerList.forEach(scorer => {
        if(prevGoals === 0){
            prevGoals = scorer.goals;
            scorer.place = prevPlace + '.';
        }
        else if (prevGoals > scorer.goals){
            prevGoals = scorer.goals;
            scorer.place = ++prevPlace + '.';
        }
        else {
            scorer.place = '';
        }
    });

    res.render('team', {scorerList: scorerList});
});

module.exports = router;