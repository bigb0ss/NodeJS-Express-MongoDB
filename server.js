var express = require('express')
var bodyParser = require('body-parser')
var MongoClient = require("mongodb").MongoClient

var ObjectID = require('mongodb').ObjectID;
const cors = require('cors')




let db;
MongoClient.connect("mongodb://144.24.148.147:27017", {}, (err, client) => {
    ''
    if (err) {
        console.log(err)
        console.log("Mongo DB Connection Error")
        process.exit(1)
    }
    db = client.db('revvv')
    console.log("DB Connected")

});

var app = express()
app.use(cors())
app.use(bodyParser.json())


var createRecord = async function (req, res) {
    var body = req.body

    body['data'].isdeleted = false;
    body['data'].id = await db.collection(body['collection']).count() + 1

    db.collection(body['collection']).insertOne(body['data'])
    res.status(200).json(body)
}


var editRecord = async function (req, res) {
    var body = req.body

    body['data'].isdeleted = false;
    await db.collection(body['collection']).updateOne(body.find, { $set: body.data }, function (err, resu) {
        if (err)
            console.log(err + " document(s) updated");

    })
    res.status(200).json(body)
}

var deleteRecord = async function (req, res) {
    var body = req.body

    await db.collection(body['collection']).updateOne(body.find, { $set: { isdeleted: true } })


    res.status(200).json(body)
}


var findAllRecord = async function (req, res) {
    var body = req.body

    await db.collection(body['collection']).find({ isdeleted: false }).toArray((err, resp) => {

        if (!err)
            res.status(200).json(resp)
    })

}

var findOneRecord = async function (req, res) {
    var body = req.body

    body['find'].isdeleted = false
    await db.collection(body['collection']).find( body.find ).toArray((err, resp) => {
        if (!err)
            res.status(200).json(resp)
    })
}

app.get("/", (req, res) => {
    res.status(200).json({ "status": "success" })
})

app.post('/create', createRecord)

app.post('/update', editRecord)

app.post('/delete', deleteRecord)

app.post('/findAll', findAllRecord)

app.post('/find', findOneRecord)





app.listen(5000, '0.0.0.0', () => {
    console.log(" Server Started")
})

