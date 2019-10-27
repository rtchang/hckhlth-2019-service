const MemberApi = require('./members/memberController.js')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const PORT = process.env.PORT || 5000
const AggregatePatientWorkflow = require('./fhir/aggregatePatientWorkflow.js')
const AggregateGlucoseWorkflow = require('./fhir/aggregateGlucoseWorkflow.js')
const DexcomGlucoseWorkflow = require('./dexcom/dexcomGlucoseWorkflow.js')

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

const memberApi = new MemberApi(app)
memberApi.getUser()
memberApi.getUserDashboard()
memberApi.addEvent()
memberApi.getTimeline()
memberApi.likeEvent()
memberApi.getDoses()
memberApi.addDose()
memberApi.updateDose()
memberApi.removeDose()

// not-restful-things below -- these should be triggered via scenarios/jobs/events -- just exposing it for testing purposes
app.get('/start-aggregate-patient-workflow', (req, res) => {
  const { source } = req.body

  const aggregatePatientWorkflow = new AggregatePatientWorkflow(source)

  aggregatePatientWorkflow.execute()
  res.sendStatus(201)
})

app.get('/start-aggregate-glucose-workflow', (req, res) => {
  const { source } = req.body

  const aggregateGlucoseWorkflow = new AggregateGlucoseWorkflow(source)

  aggregateGlucoseWorkflow.execute()
  res.sendStatus(201)
})

app.get('/start-dexcom-glucose-workflow', (req, res) => {
  //TODO(have some permissioning instead of passing userId and not checking it *awkward*)
  const { userId, startDate, endDate } = req.body

  const dexcomGlucoseWorkflow = new DexcomGlucoseWorkflow()

  dexcomGlucoseWorkflow.execute(userId, startDate, endDate)
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))