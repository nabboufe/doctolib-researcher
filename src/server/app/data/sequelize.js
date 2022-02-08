const Sequelize = require('sequelize');
const UserModel = require('../models/user');
const ProfileModel = require('../models/profile');
const bcrypt = require('bcrypt');

const sequelize = new Sequelize('doctolib_researcher', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

const User = UserModel(sequelize, Sequelize);
const Profile = ProfileModel(sequelize, Sequelize);

User.prototype.validPassword = async (user, check) =>
    await bcrypt.compare(user, check);

module.exports = [User, Profile, sequelize];
