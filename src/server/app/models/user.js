const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, type) =>
    sequelize.define(
        'User', {
            id: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            UUID: {
                type: type.UUID,
                defaultValue: Sequelize.DataTypes.UUIDV4,
            },
            first_name: type.STRING,
            last_name: type.STRING,
            email: type.STRING,
            emailValid: {
                type: type.BOOLEAN,
                defaultValue: false,
            },
            username: {
                type: type.STRING,
                allowNull: false,
            },
            userPrivilege: {
                type: type.ENUM('admin', 'user'),
                defaultValue: 'user',
            },
            password: {
                type: type.STRING,
                allowNull: false,
            },
            createdAt: {
                type: type.DATE,
                allowNull: false,
            }
        },
        {
            freezeTableName: true,
            hooks: {
                beforeCreate: async (user) => {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
            classMethods: {
                associate: (models) => {
                    User.hasMany(models.Profile,
                        { foreignKey: 'UUID' } )
                }
            },
        }
    );
