const Sequelize = require("sequelize");

module.exports = (sequelize, type) =>
    sequelize.define(
        'Profile', {

            researchID: type.UUID,
            UUID: type.UUID,

            url: type.STRING(512),
            imgUrl: type.STRING(512),
            name: type.STRING(256),
            keyword: type.STRING(2048),
            creditCard: type.ENUM('true', 'false', 'undefined'),
            socialSecurityCard: type.ENUM('true', 'false', 'undefined'),
            address: type.STRING(512),
            presText: type.STRING(8192),
            number: type.STRING(64),
            callHours: type.STRING(256),
            activity: type.STRING(128),
            location: type.STRING(128),
            filters: {
                type: type.STRING(256),
                defaultValue: 'No filters',
            },

            createdAt: {
                type: type.DATE,
                defaultValue: Sequelize.DataTypes.NOW,
            },
        },
        {
            classMethods: {
                associate: (models) => {
                    History.belongsTo(models.User,
                        { foreignKey: 'UUID' });
                }
            }
        }
    );
