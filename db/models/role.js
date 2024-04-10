'use strict';
import connection from '../connection';
import { Model, DataTypes } from 'sequelize';

const initRole = (sequelize, DataTypes) => {
  class roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  roles.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'roles',
    timestamps: false
  });
  return roles;
};

export default initRole(connection, DataTypes);
