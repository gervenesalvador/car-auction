'use strict';
import connection from '../connection';
import { Model, DataTypes } from 'sequelize';

const initBid = (sequelize, DataTypes) => {
  class bid extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  bid.init({
    listing_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      get() {
        return parseFloat(this.getDataValue('amount'));
      }
    }
  }, {
    sequelize,
    modelName: 'bid',
  });
  return bid;
};

export default initBid(connection, DataTypes);
