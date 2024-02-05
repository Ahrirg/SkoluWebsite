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

async function asyncfunction(user, data, returnjson, length) { // reads all data sync and returns to main function

    for(var i = 0; i < length; i++) {
         const person = data[i];
        var txtdata = fs.readFileSync(__dirname + '/../Users/' + user + '/'+ person + "/BendraSuma.txt");
        returnjson[person] = txtdata.toString('utf-8');
    }

    return returnjson;
}

router.post('/switch',uploads.array('files') , (req, res) => {
    const user = req.body.user;

    fs.readdir(__dirname + '/../Users/' + user, (err, data) => {
        if (err) {
            console.log(err);
        }
        var returnjson = {}

        asyncfunction(user, data, returnjson, data.length);

        res.json(returnjson)
    })
})

async function ReWrite(user, name, suma) {
    var oldtxtdata = fs.readFileSync(__dirname + "/../Users/" + user + "/" + name + "/BendraSuma.txt");
    
    // async code for writing into Bendra suma.txt
    var content;

    //console.log(parseInt(oldtxtdata))

    if (parseInt(oldtxtdata) == NaN) { // krc neveik kazkode duod NaN jei jau yra empty
        content = parseInt(suma);
    } else {
        content = (parseInt(oldtxtdata) + parseInt(suma));
    }
    var contentString = content.toString()

    fs.writeFile(__dirname + "/../Users/" + user + "/" + name + "/BendraSuma.txt", contentString, err=> {
        if (err) {
            console.log(err);
        }
    })

    // async code for skolulist.txt
    const dateTimeObject = new Date();

    var content2 = `Eurai:${suma}  Date:${dateTimeObject.getFullYear()}-${dateTimeObject.getMonth()}-${dateTimeObject.getDay()}`
    await fs.appendFileSync(__dirname + "/../Users/" + user + "/" + name + "/SkoluList.txt", content2)
}

async function checkDirIfUser(Name) {
    var arr = await fs.readdirSync(__dirname + "/../Users/");

    for (var i = 0; i< arr.length; i++) {
        if (arr[i] == Name) {
            return true;
        }
    }
    
    return false;
}

async function UpdateNameUser(User, Name, Suma) {
    if(await checkDirIfUser(Name) == true) {

        var sum = parseInt('-' + Suma.toString())
        console.log(sum)
        ReWrite(Name, User, sum);

        const dateTimeObject = new Date();

        var content = `Suma:${sum} User: ${User} Date:${dateTimeObject.getFullYear()}-${dateTimeObject.getMonth()}-${dateTimeObject.getDay()}`
        await fs.appendFileSync(__dirname + "/../Users/" + Name + "/" + User + "/IncomingSkolos.txt", content)
    }
}


router.post('/add',uploads.array('files') , (req, res) => {
    var User = req.body.User;
    var Name = req.body.Name;
    var Suma = req.body.Suma;
    res.json({message: "ok"})

    ReWrite(User, Name, Suma);

    UpdateNameUser(User, Name, Suma)
})

module.exports = router;