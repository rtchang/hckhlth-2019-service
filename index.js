const Member = require('./members/member.js')
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const app = express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))

app.use((req, res, next) => {
  res.header('Content-Type', 'application/json');
  next()
  })

app.get(`/api/member`, (req, res) => {
  res.send(JSON.stringify(new Member('fake', 'PATIENT', 'Neil Gandhi', 'super-amazing-person@test.com')));
})
 
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))