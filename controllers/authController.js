import User from '../models/User.js';
import passport from 'passport';

export const discordLogin = (accessToken, refreshToken, profile, done) => {
    User.findOne({ discordId: profile.id })
      .then(existingUser => {
        if (existingUser) {
          return done(null, existingUser);
        }
  
        const avatarURL = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`;
        
        const newUser = new User({
          discordId: profile.id,
          username: profile.username,
          avatar: avatarURL,
          // ...
        });
  
        return newUser.save();
      })
      .then(savedUser => done(null, savedUser))
      .catch(err => done(err));
  };
  
export const login = passport.authenticate('discord');
export const logout = (req, res) => {
    req.logout();
    res.redirect('/');
};

export const callback = (req, res) => {
    // Puedes manejar lo que sucede después de que el usuario sea autenticado aquí
    res.redirect('/');
};

export const getUserImage = (req, res) => {
    // Aquí puedes obtener la información del usuario autenticado (por ejemplo, a través de req.user si estás usando sesiones)
    // Luego, puedes enviar la URL de la imagen como respuesta
    res.json({ image: req.user.avatar });
  };
  
