const [User, Profile] = require('./sequelize');

User.findOne({
    where: { username: "nlaroussi" }
}) 
    .then(user => {
        if (user !== null) {
            console.log('user already exists');
        } else {
            
            User.create({
                first_name: "Nabil",
                last_name: "Laroussi",
                username: "nlaroussi",
                email: "nabil.boufeldja@gmail.com",
                password: "nabil123",
                })    
                .then(() => console.log('user created'))
                .catch((error) => console.log(error));            
        }
    })  .catch((error) => console.log(error));
