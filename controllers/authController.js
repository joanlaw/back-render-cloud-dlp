import User from '../models/User.js';
import passport from 'passport';

export const discordLogin = (accessToken, refreshToken, profile, done) => {
  console.log('Inicio de sesión de Discord iniciado', profile);

  User.findOne({ discordId: profile.id })
    .then(existingUser => {
      if (existingUser) {
        console.log('Usuario existente encontrado', existingUser);
        return done(null, existingUser);
      }

      const avatarURL = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`;

      const newUser = new User({
        discordId: profile.id,
        username: profile.username,
        avatar: avatarURL,
      });

      console.log('Creando nuevo usuario', newUser);

      return newUser.save()
        .then(savedUser => {
          console.log('Usuario guardado', savedUser);
          done(null, savedUser);
        });
    })
    .catch(err => {
      console.error('Error en la autenticación de Discord', err);
      done(err);
    });
};

export const login = passport.authenticate('discord');
export const logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

export const callback = (req, res) => {
  if (req.isAuthenticated()) {
    console.log('Usuario autenticado:', req.user);
    // Aquí puedes añadir lógica adicional, como actualizar la información del usuario en la base de datos
  } else {
    console.log('Autenticación fallida');
    // Aquí puedes manejar el caso en el que la autenticación falló
  }
  res.redirect('/');
};

export const getUserImage = (req, res) => {
  // Aquí puedes obtener la información del usuario autenticado (por ejemplo, a través de req.user si estás usando sesiones)
  // Luego, puedes enviar la URL de la imagen como respuesta
  res.json({ image: req.user.avatar });
};