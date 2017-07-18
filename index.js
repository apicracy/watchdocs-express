const R = require('ramda')
const parseRequest = require('./lib/parse-request')

const buildReport = (...params) => Object.assign({}, ...params)

const wd = ({ app_id, app_secret }) => (req, res, next) => {
  const data = { endpoint: req.path }

  const report = buildReport(
    data,
    parseRequest(req)
  )

  res.report = report
  next && next();
}

module.exports = wd
// usage: app.use(wd(APP_ID, APP_SECRET));
