import User from '../models/User.js';
import passport from 'passport';

export const discordLogin = (accessToken, refreshToken, profile, done) => {
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

            return newUser.save(); // Retorna la promesa aquí
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
