'use strict';
import connection from '../connection';
import { Model, DataTypes } from 'sequelize';

// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
const initUser = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  users.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue('name', value.toLowerCase());
      },
      get() {
        const name = this.getDataValue('name');
        const nameArray = name.split(" ");
        const wordsArray = nameArray.map((word) => word[0].toUpperCase() + word.substring(1));
        return wordsArray.join(" ");

      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};

export default initUser(connection, DataTypes);
