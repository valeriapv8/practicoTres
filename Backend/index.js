require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const db = require('./models')

const app = express()
const port = 3000

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(fileUpload({ limits: { fileSize: 10 * 1024 * 1024 } }))

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

db.sequelize.sync({
    // force: true // drop tables and recreate8+
}).then(() => {
    console.log("db resync");
});

require('./routes')(app)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
