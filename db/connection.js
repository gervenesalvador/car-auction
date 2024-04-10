import Sequelize from 'sequelize';
import config from './config/config.js';

const env = process.env.NODE_ENV || 'development';
const CONFIG = config[env];

let sequelize;
if (CONFIG.use_env_variable) {
  sequelize = new Sequelize(process.env[CONFIG.use_env_variable], CONFIG);
} else {
  sequelize = new Sequelize(CONFIG.database, CONFIG.username, CONFIG.password, CONFIG);
}

const connection = sequelize;

export default connection;
