const express = require('express');
const router = express.Router();
const axios = require('axios');
const apiUrl = 'https://svkarowapi.herokuapp.com';

router.get('/', (req, res) => res.render('home'));
router.get('/home', (req, res) => res.render('home'));
router.get('/news', (req, res) => res.render('news'));

router.get('/verein', (req, res) => {
    axios.all([
        axios.get(apiUrl + "/funktionaeres", {responseType: "json"}),
        axios.get(apiUrl + "/schiedsrichters", {responseType: "json"}),
        axios.get(apiUrl + "/teams", {responseType: "json"})
    ]).then(axios.spread((officials, referees, teams) => {
        res.render('verein', {apiUrl: apiUrl, officials:officials.data, referees:referees.data, teams:teams.data});
    })).catch(err => {
        console.log(err);
    });
});

router.get('/shop', (req, res) => res.render('shop'));
router.get('/galerie', (req, res) => res.render('gallery'));
router.get('/kleiderboerse', (req, res) => res.render('boerse'));

router.get('/team/:id', (req, res) =>  {
    var teamId = req.params.id; //TODO: scorerlist to mongodb
    
    axios.get(apiUrl + `/teams/${teamId}`, {responseType: "json"})
        .then(team => {
            if(team.data.Torschuetzen !== null) {
                team.data.Torschuetzen.sort((a, b) => {
                    if(a.goals > b.goals)
                        return -1;
                    else if(a.goals < b.goals)
                        return 1;
                    else
                        return 0;
                });
        
                let prevGoals = 0;
                let prevPlace = 1;
                team.data.Torschuetzen.forEach(scorer => {
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
            }
        
            res.render('team', {apiUrl: apiUrl, data: team.data});
        })
        .catch(err => {
        console.log(err);
    });
});

module.exports = router;