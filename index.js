global.apiUrl = 'https://svkarowapi.herokuapp.com';
global.helpers = 'dist/view/helpers';

const express = require('express');
const path = require('path');
const axios = require('axios');
const showdown = require('showdown');
const handlebars = require('handlebars');

const showdownConverter = new showdown.Converter();

axios.all([
        axios.get(apiUrl + '/sponsorens', {responseType: "json"}),
        axios.get(apiUrl + '/index-seite', {responseType: "json"}),
    ]).then(axios.spread((sponsors, indexPage) => {
        indexPage.data.Kontakt = new handlebars.SafeString(showdownConverter.makeHtml(indexPage.data.Kontakt).replace(/<\/p>(\r\n|\n|\r)<p>/gm, '</p><p>').replace(/(\r\n|\n|\r)/gm, '<br>'));

        helpers = {
            apiUrl: () => apiUrl,
            sponsors: () => sponsors.data,
            contact: () => indexPage.data.Kontakt,
            showMaps: () => indexPage.data.MapsAnzeigen,
            isMainTrainer: (sorte) => sorte === 'Trainer' ? true : false
        };
    })).catch(err => {
        console.log(err);
    }).then(() => {
        initExpress();
    });

function initExpress() {
    const hbs = require('./handlebars');
    const app = express();
    const PORT = process.env.PORT || 5000;

    app.engine('handlebars', hbs.engine);

    app.set('view engine', 'handlebars');
    app.set('views', path.join(__dirname, 'dist', 'view'));

    app.use(express.static(path.join(__dirname, 'dist')));
    app.use('/', require('./routes/routes'));

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
}