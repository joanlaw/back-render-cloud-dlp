import User from '../models/User.js';
import passport from 'passport';
import DiscordStrategy from 'passport-discord';

const strategy = new DiscordStrategy({
    clientID: DISCORD_CLIENT_ID,
    clientSecret: DISCORD_CLIENT_SECRET,
    callbackURL: 'TU_URL_CALLBACK',
    scope: ['identify', 'guilds'],
}, (accessToken, refreshToken, profile, done) => {
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
});

passport.use(strategy);

export const login = passport.authenticate('discord');
export const logout = (req, res) => {
    req.logout();
    res.redirect('/');
};

export const callback = (req, res) => {
    // Puedes manejar lo que sucede después de que el usuario sea autenticado aquí
    res.redirect('/');
};
