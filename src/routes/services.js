const express = require('express');
const router = express.Router();

const { accounts, writeJSON } = require('../data');

router.get('/transfer', (req, res) => res.render('transfer'))
    .post('/transfer', (req, res) => {
        const { body } = req;
        accounts[body.from].balance -= parseInt(body.amount);
        accounts[body.to].balance += parseInt(body.amount);

        writeJSON();

        res.render('transfer', { message: 'Transfer Completed' });
    });

router.get('/payment', (req, res) => res.render('payment', { account: accounts.credit }))
    .post('/payment', (req, res) => {
        const { body } = req;
        accounts.credit.balance -= parseInt(body.amount);
        accounts.credit.available += parseInt(body.amount);

        writeJSON();

        res.render('payment', { message: "Payment Successful", account: accounts.credit });
    });

module.exports = router;