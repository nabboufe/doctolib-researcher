const [User, Profile] = require('./sequelize');

User.findOne({
    where: { username: "nlaroussi" }
})
    .then(user => {
        if (user !== null) {
            Profile.create({
                UUID: user.UUID,
                url: "localhost:3000",
                imgUrl: "localhost:4800/userImg",
                name: "Test Test",
                keyword: "Psychologie de l'enfant|Psychanalyse",
                creditCard: true,
                socialSecurityCard: true,
                address: "13 Rue de Pottiers",
                presText: "Oui-gentil",
                number: "0623846318",
                callHours: "08h00-12h00|13h30-18h00",
            })
            .then(() => console.log('Profile has been created'))
            .catch(error => console.log(error));
        } else {
            console.log('No user access found, cannot create Profile entry');
        }
    })
    .catch(error => console.log(error));
