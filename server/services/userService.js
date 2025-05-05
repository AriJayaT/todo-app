const { User } = require('../db/models');

async function createUser(data) {
  return await User.create({
    uid: data.uid,
    email: data.email,
    name: data.name,
    auth_provider: data.auth_provider,
    photo_url: data.photo_url
  });
}

module.exports = { createUser };
