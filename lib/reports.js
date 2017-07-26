/*
 * Watchdocs.io Express middleware
 * Reports Module
 */
const fs = require('fs')
const os = require('os')
const path = require('path')
const request = require('request-promise');

const getReportPath = options => {
  return path.join(os.tmpdir(), 'watchdocs', `report-${options.appId}.json`)
}
exports.getReportPath = getReportPath

const prepareReportDirectory = filePath => {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  prepareReportDirectory(dirname);
  fs.mkdirSync(dirname);
}
exports.prepareReportDirectory = prepareReportDirectory

const readReportFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf8'})
    const parsed = JSON.parse(fileContent)

    return Array.isArray(parsed) ? parsed : []
  } else {
    return []
  }
}
exports.readReportFile = readReportFile

const writeRaportFile = (filePath, content) => {
  prepareReportDirectory(filePath)
  fs.writeFileSync(filePath, JSON.stringify(content))
}

const sendReport = options => {
  const reportPath = getReportPath(options)

  if (!fs.existsSync(reportPath)) {
    return Promise.reject()
  }

  const requestOptions = {
    url: options.host,
    method: 'POST',
    body: JSON.stringify(readReportFile(reportPath)),
    auth: {
      'user': options.appId,
      'pass': options.appSecret
    },
    headers: {
      'Content-Type': 'application/json',
    }
  }

  return request(requestOptions)
    .then(response => {
      options.verbose && console.log(`
\x1b[32m[Watchdocs.io]:\x1b[0m * Report sent. *
      `)

      try {
        fs.unlink(reportPath)
      } catch (err) {}

      return response
    })
    .catch(err => {
      options.verbose && console.error(`
\x1b[31m[Watchdocs.io]:\x1b[0m * Watchdocs.io express middleware error *
  ${err}
      `)
    })
}
exports.sendReport = sendReport

const generateReport = (data, options) => {
  const filePath = getReportPath(options)
  const recordedEndpoints = readReportFile(filePath)

  recordedEndpoints.push(data)
  writeRaportFile(filePath, recordedEndpoints)

  if (recordedEndpoints.length > options.batchSize) {
    return sendReport(options)
  }
}
exports.generateReport = generateReport
