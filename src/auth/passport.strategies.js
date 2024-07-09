import passport from 'passport';
import local from 'passport-local';
import UsersManager from '../controllers/users.manager.mdb.js';
import { isValidPassword } from '../utils.js';
import GitHubStrategy from 'passport-github2';
import config from "../config.js";

const localStrategy = local.Strategy;
const manager = new UsersManager();

const initAuthStrategies = () => {
    passport.use('login', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            try {
                const foundUser = await manager.getOne({ email: username });

                if (foundUser && isValidPassword(password, foundUser.password)) {
                    const { password, ...filteredFoundUser } = foundUser;
                    return done(null, filteredFoundUser);
                } else {
                    return done(null, false);
                }
            } catch (err) {
                return done(err, false);
            }
        }
    ));

    passport.use('ghlogin', new GitHubStrategy(
        {
            clientID: config.GITHUB_CLIENT_ID,
            clientSecret: config.GITHUB_CLIENT_SECRET,
            callbackURL: config.GITHUB_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile._json?.email || null;

                if (email) {
                    let foundUser = await manager.getOne({ email: email });

                    if (!foundUser) {
                        const user = {
                            firstName: profile._json.name.split(' ')[0],
                            lastName: profile._json.name.split(' ')[1],
                            email: email,
                            password: 'none',
                            githubAccessToken: accessToken,
                            githubRefreshToken: refreshToken
                        };

                        foundUser = await manager.add(user);
                    } else {
                        
                        foundUser.githubAccessToken = accessToken;
                        foundUser.githubRefreshToken = refreshToken;
                        await manager.update(foundUser._id, foundUser);
                    }

                    return done(null, foundUser);
                } else {
                    return done(new Error('Faltan datos de perfil'), null);
                }
            } catch (err) {
                return done(err, false);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });
};

export default initAuthStrategies;
