app.get('/', (req, res) => {
    res.send('OK');
});
app.get('/doct', async (req, res) => {
    res.send('Pending implementation');
});

app.post('/doct', async (req, res) => {
    console.log(req.body);
    const ret = profileFinder([req.body.activity,
        req.body.location], req.body.index);

    ret.then((e) => {
        res.send(e)
    });
});
