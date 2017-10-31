const { Auth, User, VolleyTransfer, Config } = require('./dist/sdk.cjs')

Config.use({
  hostname: 'http://ordinasoft.ddns.net',
  appId: 'd4993f6073f04d418418edd50836f569',
  debug: true,
})


// VolleyTransfer
//   .query()
//   .with('Player', ['No'])
//   .find(53499, ['No'])
//   .then((transfer) => {
//     console.log(transfer.toJSONIndexed())
//   })

// VolleyTransfer
//   .query()
//   .filterBy('Season', '2017/18')
//   .with('Player', ['No'])
//   .fetch(['No'])
//   .then((transfer) => {
//     console.log(transfer.toJSONIndexed())
//   })

// BeachTeam
//   .all(['No'])
//   .then((teams) => {
//     console.log(teams.getMetadata())
//   })

// BeachTeam.query()
//   .with('Player1', ['No'])
//   .fetch(['No', 'Version'])
//   .then((teams) => {
//     console.log(teams.toJSONIndexed())
//   })

// Player.all({ fields: ['No', 'FirstName', 'LastName'] })
//   .then()
//   .catch(console.log)

Auth.attempt({ username: 'romain.lanz', password: 'simplex' })
  .then(data => {
    console.log(data)
    Config.accessToken = data.accessToken
    Auth.getUser()
      .then(console.log)
      .catch(console.log)
  })

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
