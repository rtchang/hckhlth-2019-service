const MemberApi = require('./members/memberController.js')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const PORT = process.env.PORT || 5000

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

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))