'use strict'

const { Auth, Config, HttpClient, Player, Request, VolleyMatch } = require('./dist/sdk.cjs')

Config.use({
  appId: 'd4993f6073f04d418418edd50836f569',
  debug: true,
})

// Player.all({ key: 100096, fields: ['No', 'FirstName', 'LastName'] })
//   .then(data => console.log('index', data.toJSON()))
  // .catch(e => console.log('index', e))

// Auth.attempt({ username: 'romain.lanz', password: 'simplex' })
//   .then(data => console.log(data))
//   .catch(e => console.log(e))

// Auth.validateSession({
//     accessToken: 'Token'
//   })
//   .then(data => console.log('index ', data))
//   .catch(e => console.log('index ', e))

// const request = new Request({ type: 'GetVolleyMatchList' })
// request.setAttributes([
//   { name: 'No', value: '7203' },
//   { name: 'Options', value: '65535' },
// ])

// const client = new HttpClient()

// client.send({
//   body: request.toString({ wrapped: true }),
//   headers: [
//     { name: 'Accept', value: 'application/xml' }
//   ]
// })
//   .then(response => {
//     console.log(response)
//   })
//   .catch(e => console.log(e))
