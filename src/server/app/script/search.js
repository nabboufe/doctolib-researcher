const profileFinder = require('./puppet.js').profileFinder;

const func = () => {
    profileFinder(['psychologue', 'lyon'])
        .then((e) => {
            e[0].then((e) => console.log(e))
    })
}
func();
