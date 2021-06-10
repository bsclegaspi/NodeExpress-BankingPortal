const fs = require('fs');
const path = require('path');

const express = require('express');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

const accountData = fs.readFileSync('./src/json/accounts.json', { encoding: 'utf8' });
const accounts = JSON.parse(accountData);

const userData = fs.readFileSync('./src/json/users.json', { encoding: 'utf8' });
const users = JSON.parse(userData);

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.render('index', { title: 'Account Summary', accounts: accounts }))
    .get('/savings', (req, res) => res.render('account', { account: accounts.savings }))
    .get('/checking', (req, res) => res.render('account', { account: accounts.checking }))
    .get('/credit', (req, res) => res.render('account', { account: accounts.credit }))
    .get('/profile', (req, res) => res.render('profile', { user: users[0] }))
    .get('/transfer', (req, res) => res.render('transfer'))
    .post('/transfer', (req, res) => {
        const { body } = req;
        accounts[body.from].balance -= parseInt(body.amount);
        accounts[body.to].balance += parseInt(body.amount);

        const accountsJSON = JSON.stringify(accounts);
        fs.writeFileSync(path.join(__dirname, 'json/accounts.json'), accountsJSON, 'utf8');

        res.render('transfer', { message: 'Transfer Completed' });
    });

app.get('/payment', (req, res) => res.render('payment', { account: accounts.credit }))
    .post('/payment', (req, res) => {
        const { body } = req;
        accounts.credit.balance -= parseInt(body.amount);
        accounts.credit.available += parseInt(body.amount);

        const accountsJSON = JSON.stringify(accounts);
        fs.writeFileSync(path.join(__dirname, 'json/accounts.json'), accountsJSON, 'utf8');

        res.render('payment', { message: "Payment Successful", account: accounts.credit });
    });

app.listen(3000, () => console.log('PS Project Running on port 3000!'));