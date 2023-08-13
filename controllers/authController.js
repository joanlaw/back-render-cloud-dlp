const User = require('../models/User');

exports.discordLogin = (accessToken, refreshToken, profile, done) => {
  User.findOne({ discordId: profile.id })
    .then(existingUser => {
      if (existingUser) {
        return done(null, existingUser);
      }

      const newUser = new User({
        discordId: profile.id,
        username: profile.username,
        // Puedes agregar más campos aquí si es necesario
      });

      newUser.save()
        .then(user => done(null, user))
        .catch(err => done(err));
    })
    .catch(err => done(err));
};
