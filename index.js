const MemberApi = require('./members/memberController.js')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const PORT = process.env.PORT || 5000
const AggregatePatientWorkflow = require('./fhir/aggregatePatientWorkflow.js')
const AggregateGlucoseWorkflow = require('./fhir/aggregateGlucoseWorkflow.js')
const DexcomGlucoseWorkflow = require('./dexcom/dexcomGlucoseWorkflow.js')
const MemberManager = require('./members/memberManager.js')
const Config = require('./config.js')

const memberManager = new MemberManager()
const ClientOAuth2 = require('client-oauth2')
const azureAuth = new ClientOAuth2({
  clientId: Config.CLIENT_ID,
  clientSecret: Config.CLIENT_SECRET,
  accessTokenUri: 'https://login.microsoftonline.com/79fe009c-79e0-4bc9-baec-a76d3145bde5/oauth2/token',
  authorizationUri: 'https://login.microsoftonline.com/79fe009c-79e0-4bc9-baec-a76d3145bde5/oauth2/authorize?resource=https://azurehealthcareapis.com',
  redirectUri: 'https://hlth.azurewebsites.net/auth/azure/callback',
  scopes: []
})

const app = express()
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))

app.use((req, res, next) => {
  res.header('Content-Type', 'application/json');
  next()
})

// yea, this isn't going to scale out really well
// probably swap this over to Azure and spin up a
// jvm server where we will program in kotlin
// because then we could handle intercept for authentication
// and all the nice jazz, then move to JWT and whatnot later

const memberApi = new MemberApi(app, memberManager)
memberApi.getUser()
memberApi.getUserDashboard()
memberApi.addEvent()
memberApi.getTimeline()
memberApi.likeEvent()
memberApi.getDoses()
memberApi.addDose()
memberApi.updateDose()
memberApi.removeDose()
memberApi.updateIncome()

// not-restful-things below -- these should be triggered via scenarios/jobs/events -- just exposing it for testing purposes
app.get('/start-aggregate-patient-workflow', (req, res) => {
  const { source } = req.body

  if (source == null) {
    sign('get', Config.FHIR_URL)
      .then(accessToken => {
        const aggregatePatientWorkflow = new AggregatePatientWorkflow(source, memberManager)

        aggregatePatientWorkflow.execute()
        res.sendStatus(201)
      })
  }
})

app.get('/start-aggregate-glucose-workflow', (req, res) => {
  const { source } = req.body

  const aggregateGlucoseWorkflow = new AggregateGlucoseWorkflow(source, memberManager)

  aggregateGlucoseWorkflow.execute()
  res.sendStatus(201)
})

app.get('/start-dexcom-glucose-workflow', (req, res) => {
  //TODO(have some permissioning instead of passing userId and not checking it *awkward*)
  const { userId, startDate, endDate } = req.body

  const dexcomGlucoseWorkflow = new DexcomGlucoseWorkflow(memberManager)

  dexcomGlucoseWorkflow.execute(userId, startDate, endDate)
})

// oath thing
app.get('/auth/azure', function (req, res) {
  var uri = azureAuth.code.getUri()
 
  res.redirect(uri)
})
 
app.get('/auth/azure/callback', function (req, res) {
  sign('get', req.originalUrl)
    .then(res.send)
})

function sign(method, url) {
  return new Promise((resolve, reject) => {
    console.log('what is going on', url)
    azureAuth.code.getToken(url)
      .then(function (user) {
        console.log(user) //=> { accessToken: '...', tokenType: 'bearer', ... }
   
        // Refresh the current users access token.
        user.refresh().then(function (updatedUser) {
          console.log(updatedUser !== user) //=> true
          console.log(updatedUser.accessToken)
        })
   
        // Sign API requests on behalf of the current user.
        user.sign({
          method,
          url: 'https://hlth.azurewebsites.net/auth/azure/callback'
        })

        resolve(user.accessToken)
      })
  })
}

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))