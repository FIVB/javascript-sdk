const { VolleyTransfer, Config } = require('./dist/sdk.cjs')

Config.use({
  hostname: 'http://ordinasoft.ddns.net',
  appId: 'd4993f6073f04d418418edd50836f569',
  debug: true,
})

VolleyTransfer.all({ fields: ['No'] })
  .then(console.log)
  .catch(console.log)

// BeachTeam.all({
//   fields: ['No', 'Version'],
//   relations: [
//     { name: 'Player1', fields: ['No', 'FirstName'] },
//     { name: 'Player2', fields: ['No', 'FirstName'] },
//   ],
//   version: 100000,
// })
//   .then(data => console.log('index', data.toJSON()))
//   .catch(e => console.log('index', e))

// Player.all({ fields: ['No', 'FirstName', 'LastName'] })
//   .then()
//   .catch(console.log)

// Auth.attempt({ username: 'romain.lanz', password: 'simplex' })
//   .then(data => console.log(data))
//   .catch(e => console.log(e))

// Auth.validateSession({
//     accessToken: ''
//   })
//   .then(data => console.log('index ', data))
//   .catch(e => console.log('index ', e.errors[0]))

// request.setAttributes([
//   { name: 'No', value: '7203' },
//   { name: 'Options', value: '65535' },
// ])

// const client = new HttpClient()
// const request = new Request({ type: 'GetVolleyMatchList' })

// client.send({
//     body: request.toString({ wrapped: true }),
//     headers: [
//       { name: 'Accept', value: 'application/xml' }
//     ]
//   })
//   .then(response => {
//     console.log(response)
//   })
//   .catch(e => console.log(e))
