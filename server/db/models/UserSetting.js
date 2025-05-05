// db/models/UserSetting.js - User Settings Model
const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const UserSetting = sequelize.define('UserSetting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'uid'
    }
  },
  theme: {
    type: DataTypes.STRING(50),
    defaultValue: 'dark'
  },
  notification_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'user_settings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = UserSetting;