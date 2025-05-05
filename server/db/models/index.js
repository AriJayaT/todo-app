// db/models/index.js - Export all models and define relationships
const User = require('./User');
const Task = require('./Task');
const Session = require('./Session');
const PasswordReset = require('./PasswordReset');
const UserSetting = require('./UserSetting');
const sequelize = require('../config');

// Define relationships between models
User.hasMany(Task, { foreignKey: 'user_id', sourceKey: 'uid' });
Task.belongsTo(User, { foreignKey: 'user_id', targetKey: 'uid' });

User.hasMany(Session, { foreignKey: 'user_id', sourceKey: 'uid' });
Session.belongsTo(User, { foreignKey: 'user_id', targetKey: 'uid' });

User.hasMany(PasswordReset, { foreignKey: 'email', sourceKey: 'email' });
PasswordReset.belongsTo(User, { foreignKey: 'email', targetKey: 'email' });

User.hasOne(UserSetting, { foreignKey: 'user_id', sourceKey: 'uid' });
UserSetting.belongsTo(User, { foreignKey: 'user_id', targetKey: 'uid' });

module.exports = {
  sequelize,
  User,
  Task,
  Session,
  PasswordReset,
  UserSetting
};


const { sequelize } = require('./models');

sequelize.sync({ alter: true })  // or { force: true } for dev only
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Database sync error:', err));
