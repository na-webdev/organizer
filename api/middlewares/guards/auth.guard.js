const passport = require("passport");
const passportJWT = require("passport-jwt");
const UserService = require("../services/user.service");
const dotenv = require("dotenv");

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

dotenv.config();

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JWTStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await UserService.getUserById(jwt_payload._id);

      if (user) {
        return done(null, user);
      }

      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

const auth = passport.authenticate("jwt", { session: false });

module.exports = auth;
