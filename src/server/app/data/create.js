const [User, Profile]   = require('./sequelize');

User.create({
    first_name: 'a',
    last_name: 'b',
    email: 'test@test.com',
    emailValid: true,
    username: 'test',
    userPrivilege: 'user',
    password: 'test',
})
    .then(e => console.log(e))
    .catch(e => console.log(e));
