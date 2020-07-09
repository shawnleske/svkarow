const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) =>  {
    fs.readdir(path.join(__dirname, '..', '..', 'dist', 'img', 'banner'), (err, files) => {
        if (req.accepts('json')) {
            res.send(files);
        }
    });//TODO: add to strapi api
});

module.exports = router;