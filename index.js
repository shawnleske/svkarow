global.apiUrl = 'https://svkarowapi.herokuapp.com';
global.helpers = 'dist/view/helpers';

const express = require('express');
const path = require('path');
const axios = require('axios');

axios.get(apiUrl + '/sponsorens', {responseType: "json"})
    .then(sponsors => {
        helpers = {
            apiUrl: () => apiUrl,
            sponsors: () => sponsors.data
        };
    })
    .catch(err => {
        console.log(err);
    })
    .then(() => {
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
    });