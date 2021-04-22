const express = require('express');
const {isLoggedIn} = require('../lib/auth');
const pool = require('../database');
const { route } = require('.');

const router = express.Router();

router.get('/home', isLoggedIn, async (req, res) => {
    const user = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const data  = await pool.query('SELECT * FROM data WHERE user_id = ?', [req.user.id]);
    console.log(data)
    res.render('home', {user, data});
});
router.post('/add-data', async(req, res) => {
    const { title, description, image } = req.body;
    const newData = {
        title,
        description,
        image,
        user_id: req.user.id
    };
    console.log(newData);
    await pool.query('INSERT INTO data SET ?', [newData]);
    req.flash('success', 'New data added!');
    res.redirect('/home')
});

router.get('/data-delete/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params;
    await pool.query('DELETE FROM data WHERE ID = ?', [id]);
    req.flash('success', 'Data delete');
    res.redirect('/home')
});

router.get('/data-edit/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params;
    const data = await pool.query('SELECT * FROM data WHERE id = ?', [id]);
    console.log(data[0]);
    res.render('edit', {data: data[0]});
});
router.post('/data-edit/:id', async(req, res) => {
    const {id} = req.params;
    const { title, description, image } = req.body;
    const newData = {
        title,
        description,
        image
    };
    await pool.query('UPDATE data SET ? WHERE id = ?', [newData , id]);
    console.log(newData);
    req.flash('success', 'Data updated');
    res.redirect('/home');
});


module.exports = router;