/*
 * Watchdocs.io Express middleware
 * Reports Module
 */
const fs = require('fs')
const os = require('os')
const path = require('path')
const request = require('request');

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

const generateReport = (data, options) => {
  const filePath = getReportPath(options)
  let recordedEndpoints = []

  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf8'})
    const parsed = JSON.parse(fileContent)

    recordedEndpoints = Array.isArray(parsed) ? parsed : []
  } else {
    // Creates all needed parent folders
    prepareReportDirectory(filePath)
  }

  recordedEndpoints.push(data)

  if (recordedEndpoints.length >= options.batchSize) {
    fs.unlinkSync(filePath) // remove file

    const requestOptions = {
      url: options.host,
      method: 'POST',
      body: JSON.stringify(recordedEndpoints),
      auth: {
        'user': options.appId,
        'pass': options.appSecret
      },
      headers: {
        'Content-Type': 'application/json',
      }
    }

    return request(requestOptions, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        console.log(`
\x1b[32m[Watchdocs.io]: * Report sent successfully.\x1b[0m
        `)
      } else if (!error) {
        console.error(`
\x1b[31m[Watchdocs.io]: * There were some problems with sending your report.\x1b[0m
HTTP Status Code: ${response.statusCode}
Body: ${body}
       `)
     } else {
       console.error(`
\x1b[31m[Watchdocs.io]: * Sending report filed.\x1b[0m
HTTP Status Code: ${response.statusCode}
If you think this is a bug please report it to hi@watchdocs.io
       `)
     }

    })
  } else {
    return fs.writeFileSync(filePath, JSON.stringify(recordedEndpoints))
  }
}
exports.generateReport = generateReport
