import User from '../models/User.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';

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
        const token = jwt.sign({ discordId: req.user.discordId }, process.env.JWT_SECRET, {
            expiresIn: '15d',
        });

        // Guarda el token en el localStorage del cliente y cierra la ventana emergente
const script = `
    window.opener.postMessage({ type: 'AUTH_SUCCESS', token: "${token}" }, "*");
    window.close();
`;

res.send(`<script>${script}</script>`);
    } else {
        res.json({
            success: false,
            message: 'Autenticación fallida',
        });
    }
};




export const getUserImage = (req, res) => {
  // Aquí puedes obtener la información del usuario autenticado (por ejemplo, a través de req.user si estás usando sesiones)
  // Luego, puedes enviar la URL de la imagen como respuesta
  res.json({ image: req.user.avatar });
};

export const getUserInfo = (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      discordId: req.user.discordId,  // Añadir esto
      image: req.user.avatar,
      username: req.user.username,
      puntos: req.user.puntos,
    });
  } else {
    res.json({
      authenticated: false
    });
  }
};

//info de usuarios sin autenticar
export const getUserBasicInfo = (req, res) => {
  // Obtener la información básica de todos los usuarios
  User.find({}, '_id username avatar')
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      console.error('Error al obtener información de usuarios', err);
      res.status(500).json({
        success: false,
        message: 'Error al obtener información de usuarios',
      });
    });
};

export const updateUserPoints = (req, res) => {
  const { discordId, points } = req.body;

  User.findOneAndUpdate({ discordId: discordId }, { $inc: { puntos: points } }, { new: true })
    .then(updatedUser => {
      res.json({
        success: true,
        message: 'Puntos actualizados exitosamente',
        updatedUser,
      });
    })
    .catch(err => {
      console.error('Error actualizando los puntos del usuario', err);
      res.status(500).json({
        success: false,
        message: 'Error actualizando los puntos del usuario',
      });
    });
};

