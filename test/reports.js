const fs = require('fs')
const path = require('path')
const { generateReport, getReportPath, sendReport } = require('../lib/reports')

const defaultOptions = {
  appId: '123',
  appSecret: '1234567890',
  host: 'https://watchdocs-api.herokuapp.com/api/v1/reports',
  batchSize: 10
}

describe('Reports', () => {

  it('#getReportPath() should return valid absolute file path', () => {
    getReportPath(defaultOptions).should.be.a.String()
    path.isAbsolute(getReportPath(defaultOptions)).should.equal(true)
  })

  describe('writing to and reading from storage file', () => {
    let reportFilePath

    beforeEach(() => {
      reportFilePath = getReportPath(defaultOptions)

      if(fs.existsSync(reportFilePath)) {
        fs.unlinkSync(reportFilePath)
      }
    })

    it('should create new file it it doesnt exist', () => {
      generateReport({ data: 'test'}, defaultOptions)

      fs.existsSync(reportFilePath).should.equal(true)
    })

    it('should write report data to file', () => {
      generateReport({ data: 'test'}, defaultOptions)

      const fileContent = fs.readFileSync(reportFilePath, { encoding: 'utf8'})
      fileContent.should.be.a.String()

      JSON.parse(fileContent).should.be.an.Array()
    })

    it('should update record file if it exists', () => {
      generateReport({ data: 'test'}, defaultOptions)
      generateReport({ data: 'test2'}, defaultOptions)

      const fileContent = fs.readFileSync(reportFilePath, { encoding: 'utf8'})
      JSON.parse(fileContent).length.should.equal(2)
    })
  })

  describe('#sendReport()', () => {

    it('should return a promise', () => {
      sendReport(defaultOptions).should.be.a.Promise()
    })

    it('should not throw error when report file doesnt exist', () => {
      sendReport(defaultOptions)
    })
  })
})
