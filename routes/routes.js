const express = require('express');
const router = express.Router();
const axios = require('axios');
const showdown = require('showdown');
const handlebars = require('handlebars');

// Price-formatter
const formatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
});

const showdownConverter = new showdown.Converter();

router.get('/', (req, res) => renderHome(req, res));
router.get('/home', (req, res) => renderHome(req, res));

router.get('/news', (req, res) => {
    axios.get(apiUrl + '/news-seite', {responseType: "json"})
        .then(page => {
            axios.get(getFbUrl(page.data.FacebookToken, page.data.SeitenId))
                .then(news => {
                    //Get only active posts with no only-link message
                    let filteredObj = news.data.data.filter(e => e.message !== undefined && e.is_expired === false && e.is_hidden === false && !validURL(e.message));
                    let newsObj = filteredObj.map(e => {
                        var returnObj = {};

                        returnObj.id = e.id;
                        returnObj.created_time = getConvertedTime(e.created_time);
                        returnObj.messageHTML = getSafeString(e.message);

                        if(e.full_picture !== undefined)
                            returnObj.picLink = e.full_picture;

                        return returnObj;
                    });
                    
                    res.render('news', {active:{news:true}, news:newsObj, newsNum:page.data.AnzahlNewsProSeite});
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
        });
});

//TODO: remove function as it is just for testing sort functions
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

router.get('/geschichte', (req, res) => {
    axios.get(apiUrl + '/geschichtsabschnitts', {responseType: "json"})
        .then(entries => {
            var historyEntries = entries.data.map(e => {
                e.Inhalt = getSafeString(e.Inhalt);

                return e;
            });

            historyEntries.sort((a, b) => {
                if(a.Jahr.substring(0, 4) > b.Jahr.substring(0, 4))
                    return 1;
                else if(a.Jahr.substring(0, 4) < b.Jahr.substring(0, 4))
                    return -1;
                else if(a.Jahr.length > b.Jahr.length)
                    return 1;
                else if(a.Jahr.length < b.Jahr.length)
                    return -1;
                else
                    return 0;
            });

            res.render('history', {active:{verein:true}, historyEntries:historyEntries});
        }).catch(err => {
            console.log(err);
        });
});

router.get('/downloads', (req, res) => {
    axios.get(apiUrl + '/downloads', {responseType: "json"})
        .then(downloads => {
            var downloadsArr = {
                Statute: null,
                Documents: [],
                Others: []
            }

            downloads.data.forEach(elem => {
                if(elem.LokaleDatei)
                    elem.Link = apiUrl + elem.Link;

                if(elem.Typ === 'Satzung')
                    downloadsArr.Statute = elem;
                else if(elem.Typ === 'Dokument')
                    downloadsArr.Documents.push(elem);
                else if(elem.Typ === 'Sonstiges')
                    downloadsArr.Others.push(elem);
            });

            res.render('downloads', {active:{downloads:true}, downloads:downloadsArr});
        })
        .catch(err => {
            console.log(err);
        });
});

router.get('/datenschutz', (req, res) => {
    axios.get(apiUrl + '/datenschutz', {responseType: "json"})
        .then(page => {
            page.data.Verantwortlicher = getSafeString(page.data.Verantwortlicher);

            res.render('datenschutz', {page:page.data});
        }).catch(err => {
            console.log(err);
        });
});

router.get('/verein', (req, res) => {
    axios.all([
        axios.get(apiUrl + '/funktionaeres', {responseType: "json"}),
        axios.get(apiUrl + '/schiedsrichters', {responseType: "json"}),
        axios.get(apiUrl + '/teams', {responseType: "json"}),
        axios.get(apiUrl + '/geschaeftsstelle', {responseType: "json"})
    ]).then(axios.spread((officials, referees, teams, gs) => {
        teams.data.sort((a, b) => {
            if(a.index > b.index)
                return 1;
            else if(a.index < b.index)
                return -1;
            else
                return 0;
        });

        gs.data.Text = getSafeString(gs.data.Text);

        res.render('verein', {active:{verein:true}, officials:officials.data, referees:referees.data, teams:teams.data, gs:gs.data});
    })).catch(err => {
        console.log(err);
    });
});

router.get('/shop', (req, res) => {
    axios.all([
        axios.get(apiUrl + '/fanshop', {responseType: "json"}),
        axios.get(apiUrl + '/shop-produkts', {responseType: "json"})
    ]).then(axios.spread( (page, products) => {
        var productsArr = products.data.map(function(e) {
            e.Preis = formatter.format(parseFloat(e.Preis));
            e.BilderTyp = {};

            if(e.Bilder.length > 1) {
                if(e.Bilder[0].width > e.Bilder[0].height)
                    e.BilderTyp.horizontal = true;
                else
                    e.BilderTyp.vertical = true;
            } else {
                e.BilderTyp.single = true;
            }

            return e;
        });

        page.data.Info = getSafeString(page.data.Info);
        
        res.render('shop', {active:{shop:true}, page:page.data, products: productsArr})
    })).catch(err => {
        console.log(err);
    });
});

router.get('/galerie', (req, res) => {
    axios.get(apiUrl + '/galerie', {responseType: "json"})
        .then(page => {
            res.render('gallery', {page:page.data, active:{galerie:true}});
        }).catch(err => {
            console.log(err);
        });
});

router.get('/kleiderboerse', (req, res) => {
    axios.all([
        axios.get(apiUrl + '/kleiderboerse', {responseType: "json"}),
        axios.get(apiUrl + '/produkt-bietes', {responseType: "json"}),
        axios.get(apiUrl + '/produkt-suches', {responseType: "json"}),
    ]).then(axios.spread((page, offerProducts, searchProducts) => {
        var offerProductsArr = offerProducts.data.map(function(e) {
            e.Preis = formatter.format(parseFloat(e.Preis));
            
            return e;
        });
        page.data.Info = getSafeString(page.data.Info);
        
        res.render('boerse', {active:{boerse:true}, page:page.data, offerProducts:offerProductsArr, searchProducts:searchProducts.data});
    })).catch(err => {
        console.log(err);
    });
});

router.get('/team/:id', (req, res) =>  {
    var teamId = req.params.id;
    
    axios.get(apiUrl + '/teams/' + teamId, {responseType: "json"})
        .then(team => {
            team.data = getTeamArray(team.data);

            res.render('team', {active:{verein:true}, data: team.data});
        })
        .catch(err => {
            console.log(err);
        });
});

function getTeamArray(data) {
    if(data.Torschuetzen) {
        data.Torschuetzen = Object.values(data.Torschuetzen);

        data.Torschuetzen.sort((a, b) => {
            if(a.goals > b.goals)
                return -1;
            else if(a.goals < b.goals)
                return 1;
            else
                return 0;
        });

        let prevGoals = 0;
        let prevPlace = 1;
        data.Torschuetzen.forEach(scorer => {
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

    return data;
}

function getFbUrl(accessToken, siteId) {
    return 'https://graph.facebook.com/v7.0/' + siteId + '/posts?access_token=' + accessToken + '&fields=id,created_time,full_picture,is_expired,is_hidden,message&date_format=U';
}

function getSafeString(str) {
    return new handlebars.SafeString(showdownConverter.makeHtml(str).replace(/<\/p>(\r\n|\n|\r)<p>/gm, '</p><p>').replace(/(\r\n|\n|\r)/gm, '<br>'));
}

function getConvertedTime(unixDate) {
    let date = new Date(unixDate * 1000);
    let timeStr = '';

    if(date.getDate() < 10)
        timeStr += '0';

    timeStr += date.getDate() + '.';

    if(date.getMonth() < 10)
        timeStr += '0';

    timeStr += (date.getMonth()+1) + '.' + date.getFullYear() + ' um ' + date.getHours() + ':';

    if(date.getMinutes() < 10)
        timeStr += '0';
    
    timeStr += date.getMinutes() + ' Uhr';

    return timeStr;
}

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

function renderHome(req, res) {
    axios.all([
        axios.get(apiUrl + '/banner', {responseType: "json"}),
        axios.get(apiUrl + '/home', {responseType: "json"}),
        axios.get(apiUrl + '/news-seite', {responseType: "json"}),
        axios.get(apiUrl + '/teams', {responseType: "json"}),
    ]).then(axios.spread((banner, page, newsPage, teams) => {
        axios.get(getFbUrl(newsPage.data.FacebookToken, newsPage.data.SeitenId))
            .then(news => {
                //Get only active posts with no only-link message
                let filteredObj = news.data.data.filter(e => e.message !== undefined && e.is_expired === false && e.is_hidden === false && !validURL(e.message));
                let newsObj = filteredObj.slice(0, page.data.NewsAnzahl).map(e => {
                    var returnObj = {};

                    returnObj.id = e.id;
                    returnObj.created_time = getConvertedTime(e.created_time);
                    returnObj.messageHTML = getSafeString(e.message);

                    if(e.full_picture !== undefined)
                        returnObj.picLink = e.full_picture;

                    return returnObj;
                });

                if(page.data.Spielertext !== undefined)
                    page.data.Spielertext = getSafeString(page.data.Spielertext);
                
                if(page.data.Trainertext !== undefined)
                    page.data.Trainertext = getSafeString(page.data.Trainertext);
                
                if(page.data.Schiedsrichtertext !== undefined)
                    page.data.Schiedsrichtertext = getSafeString(page.data.Schiedsrichtertext);
                
                if(page.data.Sponsorentext !== undefined)
                    page.data.Sponsorentext = getSafeString(page.data.Sponsorentext);
                
                if(page.data.Geschichtstext !== undefined)
                    page.data.Geschichtstext = getSafeString(page.data.Geschichtstext);

                teams.data.sort((a, b) => {
                    if(a.index > b.index)
                        return 1;
                    else if(a.index < b.index)
                        return -1;
                    else
                        return 0;
                });

                res.render('home', {active:{home:true}, banner:banner.data, page:page.data, news:newsObj, teams:teams.data});
            })
            .catch(err => {
                console.log(err);
            });
    })).catch(err => {
        console.log(err);
    });
}

module.exports = router;