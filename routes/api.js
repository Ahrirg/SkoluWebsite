const express = require('express');
const router = express.Router();

const cors = require('cors');
const multer = require('multer');
const fs = require('fs');


const CC_dir = __dirname;

router.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
      callback(null, dbZIP);
  },
  // Sets file(s) to be saved in uploads folder in same directory
  filename: function (req, file, callback) {
      callback(null, file.originalname);
  }
  // Sets saved filename(s) to be original filename(s)
}) //shit idk, idc... (something that makes json files between frontend and backend)



const uploads = multer({ storage: storage })


router.post('/switch',uploads.array('files') , (req, res) => {
    const user = req.body.user;

    fs.readdir(__dirname + '/../Users/' + user, (err, data) => {
        if (err) {
            console.log(err);
        }
        var returnjson = {}

        for(var i = 0; i < data.length; i++) {
            const person = data[i];
            fs.readFile(__dirname + '/../Users/' + user + '/'+ person + "/BendraSuma.txt", (err, txtdata) => {
                console.log(txtdata.toString('utf-8'));
                returnjson[person] = txtdata.toString('utf-8'); // call an async function,
            })
        }

        res.json(returnjson)

    })
})


module.exports = router;