'use strict';

import User from './user';
import Role from './role';
import Bid from './bid';
import Listing from './listing';

const UserRole = User.belongsTo(Role, {as: "role", foreignKey: "role_id"});
const UserBid = User.hasMany(Bid, {as: "bids", foreignKey: "user_id"});
const UserListings = User.hasMany(Listing, { as: "listings", foreignKey: "user_id"});

const ListingBids = Listing.hasMany(Bid, {as: "bids", foreignKey: "listing_id"});
const ListingOwner = Listing.belongsTo(User, {as: "owner_user", foreignKey: "user_id"});
// const ListingWinner = Listing.belongsTo(User, {as: "winner_user", foreignKey: "winner_user_id"});

const BidUser = Bid.belongsTo(User, {as: "user", foreignKey: "user_id"});
const BidListing = Bid.belongsTo(Listing, {as: "listing", foreignKey: "listing_id"});

export {
  User, Role, Bid, Listing,
  UserRole, UserListings, UserBid,
  ListingBids, ListingOwner, // ListingWinner,
  BidUser, BidListing
};

// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const process = require('process');
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.js')[env];
// const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       file.slice(-3) === '.js' &&
//       file.indexOf('.test.js') === -1
//     );
//   })
//   .forEach(file => {
//     console.log("files 2", file);
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;
