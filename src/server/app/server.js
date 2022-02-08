const express           = require('express');
const bodyParser        = require('body-parser');
const profileFinder     = require('./script/puppet.js').profileFinder;
const flash             = require('connect-flash');
const morgan            = require('morgan');
const cookieParser      = require('cookie-parser');
const jwt               = require('jsonwebtoken');
const { Op }            = require("sequelize");
const [Users, Profile,
    sequelize]          = require('./data/sequelize');

sequelize.sync()
    .then(() => {
        console.log('doctolib-researcher db, user and profile table created!');
});

const port  = 4800;
const app   = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
                "Origin, X-Requested-With, " +
                "Content-Type, Accept");
    next();
});

app.get('/', (req, res) => {
    res.send('OK');
});

app.post('/getResearch', async (req, res) => {
    var research = await Profile.findAll({
        where : { researchID: req.body.id } ,
        raw: true,
    });

    if (!research) {
        res.json({ error: "Error while searching for research" })
    }
    console.log(research);
    res.json(research);
})

app.post('/userProfile', async (req, res) => {
    var username = jwt.decode(req.cookies['token']).username;
    var userDB = await Users.findOne({ where: { username } });
    
    if (!userDB) {
        res.json({ error: "Error while searching for user.", err });
    }

    var allUserResearch = await Profile.findAll({
        where: { UUID: userDB.UUID },
        raw: true,
    });

    if (!allUserResearch) {
        res.json({ error: "No profile found" });
    }

    console.log(allUserResearch);
    res.json(allUserResearch);
});

app.post('/doct', async (req, res) => {    
    const ret = profileFinder(
        [req.body.activity, req.body.location],
        req.body.index
    );
    
    ret.then((scraped) => {
        var token = req.cookies['token'];
    
        if (!!token) {
            console.log('\n\nVOUI\n\n');
            token = jwt.decode(token);
            Users.findOne({
                where: { username: token.username },
            })  .then((user) => {
                if (user) {
                    var profile = scraped;
                    var loc = req.body.location;
                    var act = req.body.activity;
    
                    profile['number'] = '';
                    profile['callHours'] = '';
                    profile['UUID'] = user.UUID;
                    profile['researchID'] = req.body.researchID;
                    profile['keyword'] = scraped.keyword.join('|');
                    profile['creditCard'] = 'undefined';
                    profile['socialSecurityCard'] = 'undefined';
                    profile['activity'] = act.charAt(0).toUpperCase() + act.slice(1);
                    profile['location'] = loc.charAt(0).toUpperCase() + loc.slice(1);
                    console.log(loc, act);

                    Profile.create(profile,
                        { raw: true, plain: true })
                        .then((e) => console.log(e))
                        .catch((err) => console.log(err));
                }
            })  .catch((err) => console.log(err))
        }
        res.send(scraped);

    })  .catch((err) => console.log(err));
});

app.post('/register', async (req, res) => {
    Users.findOne({
        where: {
            [Op.or]: [
                { email: req.body.email },
                { username: req.body.username },
            ]
        }
    })  .then((e) => {
        if (e === null) {
            Users.create(req.body, { raw: true, plain: true })
                .then((ret) => {
                    console.log("succes:\n", ret);
                    return res.send({ userCreated: 'yes', ret });
                })
                .catch((err) => {
                    console.log("error:\n", err);
                    return res.send({ userCreated: 'no', err });
                })
        } else {
            res.send( { userCreated: 'alreadyExists' });
        }
    })
        .catch((err) => { res.send({ userCreated: 'checkFailed', err }) })
});

app.post('/signin', async (req, res) => {
    Users.findOne({
        where: { username: req.body.username },
    })
    .then(async (ret) => {
        if (await ret.validPassword(req.body.password, ret.password)) {
            var token = jwt.sign({ username: req.body.username },
                ret.UUID, { expiresIn: "24h" });
            res.cookie('loggedIn', ret.username, { httpOnly: false });
            res.cookie('token', token, { httpOnly: true });
            res.send({ connection : "success", username: ret.username, token });
        } else {
            res.send({ connection : "failed" })
        }
    })
    .catch((err) => res.send(err));
});

app.post('/logout', async (req, res) => {
    res.clearCookie('loggedIn');
    res.clearCookie('token');
    res.send( {cleared: "yes"} );
})

app.post('/userExistence', async (req, res) => {
    Users.findOne({
        where: { username: req.body.username },
        raw: true, plain: true, })
        .then((user) => {
            console.log(user);
            res.send(user);
        })
        .catch((err) => {
            console.log(err);
            res.send('/userExistence error');
        });
});

app.post('/checkEmail', async (req, res) => {
    Users.findOne({
        where: { email: req.body.email },
        raw: true, plain: true, })
        .then((email) => {
            console.log(email);
            res.send(email);
        })
        .catch((err) => {
            console.log(e);
            res.send('/checkEmail error')
        })
});

app.listen(port,
    () => console.log('Listening on port 4800'));
