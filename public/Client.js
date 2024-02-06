
var CurrentUser = ""

function start(){
    document.getElementById("User").addEventListener("change", addActivityItem, false);
    }

function addActivityItem(){
    //console.log("User Switched");

    var formData = new FormData;
    formData.append('user', document.getElementById("User").value)
    CurrentUser = document.getElementById("User").value;

    fetch('/api/switch', {
        method: 'POST',
        body: formData
    }).then(res => res.json()).then(data => {
        //console.log(data);
        document.getElementById("Skolininkai").innerHTML = ""

        for (var i in data) {

            var innerhtml = `<div>${i}</div>`;

            if(data[i][0] == '-') {
                innerhtml += `<div class="red">${data[i]}</div>`
            } else {
                innerhtml += `<div class="green">${data[i]}</div>`
            }

            // console.log(innerhtml + "sitas")
            document.getElementById("Skolininkai").innerHTML += innerhtml;
        }
    })
}

async function summa() {
    var suma = parseInt(document.getElementById('Suma').value);
    console.log(suma)
    if (suma.toString() == "NaN") {
        //alert('Suma yra ne interger')
        return 0;
    } else {
        //alert('Suma yra')
        return(await document.getElementById('Suma').value);
    }
}

async function Submit(){

    var Name = document.getElementById('Name').value
    //console.log('veik')
    var Suma = await summa();

    var formData = new FormData;

    formData.append('User', CurrentUser)
    formData.append('Name', Name);
    formData.append('Suma', Suma);


    if (CurrentUser != "" && Name != "" && Suma != "") {
        fetch('/api/add', {
            method: 'POST',
            body: formData
        }).then(res => res.json()).then(data => {
            if (data.message = "ok") {
                addActivityItem();
            }
        })
    } else {
        var Printed = false;

        if (CurrentUser == "" && Printed != true) {
            alert('User not selected')
            Printed = true;
        }
        if (Name == "" && Printed != true) {
            alert('Name not selected')
            Printed = true;
        }
        if (Suma == "" && Printed != true) {
            alert('Suma not selected')
            Printed = true;
        }
    }
}

window.addEventListener("load", start, false);