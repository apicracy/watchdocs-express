const R = require('ramda')

const wd = ({ app_id, app_secret }) => (req, res, next) => {
  next();
}

module.exports = wd
// usage: app.use(wd(APP_ID, APP_SECRET));
