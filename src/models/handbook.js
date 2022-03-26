'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class HandBook extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // Specialty.hasMany(models.Doctor_info, { foreignKey: 'specialtyId', as: 'nameData' })
        }
    };
    HandBook.init({
        name: DataTypes.STRING,
        image: DataTypes.TEXT,
        descriptionHTML: DataTypes.TEXT,
        descriptionMarkdown: DataTypes.TEXT,
    }, {
        sequelize,
        modelName: 'HandBook',
    });
    return HandBook;
};