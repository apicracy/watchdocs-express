# watchdocs.io - express.js middleware  
[![CircleCI](https://circleci.com/gh/kkalamarski/watchdocs-express.svg?style=svg)](https://circleci.com/gh/kkalamarski/watchdocs-express)

Set of tools to plug your Express.js application into Watchdocs.io.

## Installation
Watchdocs middleware can be installed directly from github via `npm`.

```
$ npm install watchdocs-express --save
```

## Usage
Basic Watchdocs.io usage requires very little configuration:

Specify `appId` and `appSecret` (you can get them from settings page in https://app.watchdocs.io) and you are ready to go!
```javascript
const express = require('express')
const app = express()

const watchdocs = require('watchdocs-express')

const opts = {
  appId: APP_ID,
  appSecret: APP_SECRET
}
app.use(watchdocs(opts))

app.get('/api/hello', function (req, res) {
  res.json({ hello: 'world' })
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

```

After running this code you should see following message in console:

`[Watchdocs.io]: * Watchdocs.io middleware is listening for api calls *`

To begin collecting endpoint data open your application and start using it casually or run E2E tests.

Each endpoint call will be recorded, data sanitized and stored in temporary store file which will be later send to Watchdocs.io.

*It is highly recommended to run this middleware only on dev (or testing) envirovement.*

## Advanced usage
Watchdocs.io middleware for express.js let's you configure it for more advanced usage.

Everything will be done via `opts` object passed to `watchdocs` function.

Here's example:

```javascript
// ...

const opts = {
  appId: 'YOURAPP-123',
  appSecret: 'FHQFN^Gwhgw^FNFNWAQ34dDF',
  host: 'https://[your-self-hosted-watchdocs.io]/api/v1/reports',
  batchSize: 25
}
app.use(watchdocs(opts))

// ...
```

### opts object properties
* *appId* (required)
  * Your application identifier. You can find it in Settings section of your Watchdocs.io project.


* *appSecret* (required)
  * Used to authenticate middleware report requests. You can find it in Settings section of your Watchdocs.io project.


* *host* (optional, defaults to: `https://watchdocs-api.herokuapp.com/api/v1/reports`)
  * Watchdocs.io endpoint to which gathered data will be sent. Do not change it unless you have hosted plan of Watchdocs.io.


* *batchSize* (optional, defaults to `10`)
  * Size of report batch sent to Watchdocs.io. Value can be any positive integer.


## Contribution
If you'd like to help improving this middleware please clone it on your machine and then open a Pull Request describing made changes.

```
$ git clone https://github.com/kkalamarski/watchdocs-express.git
$ cd watchdocs-express

$ npm install
```

### Running Tests
To run unit tests run this command inside project directory:
```
$ npm test
```

To see test code coverage use this command in the same directory:
```
$ npm run coverage
```
