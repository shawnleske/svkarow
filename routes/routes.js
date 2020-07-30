const express = require('express');
const router = express.Router();
const axios = require('axios');

//FACEBOOK
const accessToken = 'EAAJAzWxdnSgBALzg9ZCelZAKZA20gVntTXHAttyKSITmEWj4N1lVoDloZBj6dWZAMrZAlZBU55EhyVMpaaD5XZBROtflaiMZAFjVYZBISPZAGrx1BsfUddXJJJwEhfvBVTqGuZCv4FwvJ20wms0xL3BD7qzDlFNasydN45wSZCqPEXT0ohwZDZD'
const siteId = '101205241692727';
const fbUrl = 'https://graph.facebook.com/v7.0/' + siteId + '/posts?access_token=' + accessToken;

// Price-formatter
const formatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
});

function renderHome(req, res) {
    axios.get(apiUrl + '/banner').then(data => {
        res.render('home', {active:{home:true}, banner:data.data});
    }).catch(err => {
        console.log(err);
    });
}

router.get('/', (req, res) => renderHome(req, res));
router.get('/home', (req, res) => renderHome(req, res));
router.get('/news', (req, res) => res.render('news', {active:{news:true}}));
router.get('/downloads', (req, res) => res.render('downloads', {active:{downloads:true}}));

//TODO: fb api to news
router.get('/datenschutz', (req, res) => {
    axios.get(fbUrl).then(data => {
        console.log(data.data.data);
        res.render('news', {data:data.data.data});
    }).catch(err => {
        console.log(err);
    });
});

router.get('/verein', (req, res) => {
    axios.all([
        axios.get(apiUrl + '/funktionaeres', {responseType: "json"}),
        axios.get(apiUrl + '/schiedsrichters', {responseType: "json"}),
        axios.get(apiUrl + '/teams', {responseType: "json"})
    ]).then(axios.spread((officials, referees, teams) => {
        res.render('verein', {active:{verein:true}, officials:officials.data, referees:referees.data, teams:teams.data});
    })).catch(err => {
        console.log(err);
    });
});

router.get('/shop', (req, res) => res.render('shop', {active:{shop:true}}));
router.get('/galerie', (req, res) => res.render('gallery', {active:{galerie:true}}));

router.get('/kleiderboerse', (req, res) => {
    axios.all([
        axios.get(apiUrl + '/produkt-bietes', {responseType: "json"}),
        axios.get(apiUrl + '/produkt-suches', {responseType: "json"}),
    ]).then(axios.spread((offerProducts, searchProducts) => {
        var offerProductsArr = offerProducts.data.map(function(e) {
            e.Preis = formatter.format(parseInt(e.Preis));
            return e;
        });
        
        res.render('boerse', {active:{boerse:true}, offerProducts:offerProductsArr, searchProducts:searchProducts.data});
    })).catch(err => {
        console.log(err);
    });
});

router.get('/team/:id', (req, res) =>  {
    var teamId = req.params.id;
    
    axios.get(apiUrl + '/teams/' + teamId, {responseType: "json"})
        .then(team => {
            team.data.Torschuetzen = Object.values(team.data.Torschuetzen);
            
            if(team.data.Torschuetzen !== null || team.data.Torschuetzen === undefined) {
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
            res.render('team', {active:{verein:true}, data: team.data});
        })
        .catch(err => {
            console.log(err);
        });
});

module.exports = router;