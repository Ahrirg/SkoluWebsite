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
        //console.log(person)
        if (person != "Logs.txt") {
            var txtdata = fs.readFileSync(__dirname + '/../Users/' + user + '/'+ person + "/BendraSuma.txt");
            returnjson[person] = txtdata.toString('utf-8');
        }
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

    var content2 = `Eurai:${suma}  Date:${dateTimeObject.getFullYear()}-${dateTimeObject.getMonth()}-${dateTimeObject.getDay()}\n`
    await fs.appendFileSync(__dirname + "/../Users/" + user + "/" + name + "/SkoluList.txt", content2)
    await fs.appendFileSync(__dirname + "/../Users/" + user + "/Logs.txt", `Simple - ${name}  ` + content2)
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

        var sum
        if (Suma.toString()[0] == '-') {
            sum = parseInt(Suma.toString().slice(1))
        } else {
            sum = parseInt('-' + Suma.toString())
        }

        //console.log(sum)
        ReWrite(Name, User, sum);

        const dateTimeObject = new Date();

        var content = `Suma:${sum} User: ${User} Date:${dateTimeObject.getFullYear()}-${dateTimeObject.getMonth()}-${dateTimeObject.getDay()}\n`
        await fs.appendFileSync(__dirname + "/../Users/" + Name + "/" + User + "/IncomingSkolos.txt", content)
        await fs.appendFileSync(__dirname + "/../Users/" + Name + "/Logs.txt", "INCOMING! " + content)
    }
}

async function tikrinam(User, Name, Suma ,data) {
    //console.log(data)
    for (var i = 0; i < data.length; i++) {
        if (data[i] == Name) {
            await yes(User, Name, Suma);
            return 0;
        }
    }
    await no(User, Name, Suma);
    return 0;
}

async function yes(User, Name, Suma){
    await ReWrite(User, Name, Suma);
    await UpdateNameUser(User, Name, Suma)
}
async function no(User, Name, Suma) {
    await fs.mkdirSync(__dirname + "/../Users/" + User + "/" + Name)
    await fs.writeFileSync(__dirname + "/../Users/" + User + "/" + Name + '/BendraSuma.txt', "0")
    await fs.writeFileSync(__dirname + "/../Users/" + User + "/" + Name + '/IncomingSkolos.txt', '')
    await fs.writeFileSync(__dirname + "/../Users/" + User + "/" + Name + '/SkoluList.txt', '')

	await ReWrite(User, Name, Suma);
    await UpdateNameUser(User, Name, Suma)
}

router.post('/add',uploads.array('files') , (req, res) => {
    var User = req.body.User;
    var Name = req.body.Name;
    var Suma = req.body.Suma;
    res.json({message: "ok"})

    fs.readdir(__dirname + "/../Users/" + User, (err, data) => {
        tikrinam(User, Name, Suma ,data);
    }) 
})

module.exports = router;