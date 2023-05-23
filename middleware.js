const { plasticSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Plastic = require('./models/plastics');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in');
        return res.redirect('../');
    }
    next();
}

module.exports.validatePlastic = (req, res, next) => {
    const {error} = plasticSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}