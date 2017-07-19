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

  if(recordedEndpoints.length >= options.batchSize) {
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
         [Watchdocs.io]: * Report sent successfully.
       `)
     } else if (!error) {
       console.error(`
         [Watchdocs.io]: * There were some problems with sending your report.
         HTTP Status Code: ${response.statusCode}
         Body: ${body}
       `)
     } else {
       console.error(`
         [Watchdocs.io]: * Sending report filed.
         ${error}

         If you think this is a bug please report it to hi@watchdocs.io
       `)
     }

    })
  } else {
    return fs.writeFileSync(filePath, JSON.stringify(recordedEndpoints))
  }
}
exports.generateReport = generateReport
