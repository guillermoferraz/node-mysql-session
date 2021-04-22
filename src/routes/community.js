const express = require('express');
const { isLoggedIn } = require('../lib/auth');
const pool = require('../database');
const router = express.Router();


router.get('/community', isLoggedIn, async (req, res) => {
    const data = await pool.query('SELECT * FROM data')
    res.render('community', {data});
});



module.exports = router;