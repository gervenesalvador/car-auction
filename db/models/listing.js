'use strict';
import connection from '../connection';
import { Model, DataTypes } from 'sequelize';

const initListing = (sequelize, DataTypes) => {
  class listings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  listings.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image_link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    opening_price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      get() {
        return parseFloat(this.getDataValue('opening_price'));
      }
    },
    price_increment: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      get() {
        return parseFloat(this.getDataValue('price_increment'));
      }
    },
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    /* winner_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }, */
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
  }, {
    sequelize,
    modelName: 'listings',
  });
  return listings;
};

export default initListing(connection, DataTypes);
