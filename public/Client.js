

var CurrentUser = ""

function start(){
    document.getElementById("User").addEventListener("change", addActivityItem, false);
    }

function addActivityItem(){
    //console.log("User Switched");
    var formData = new FormData;
    formData.append('user', document.getElementById("User").value)
    CurrentUser = document.getElementById("User").value;

    if (CurrentUser != ""){
        fetch('/api/Logs', {
            method: 'POST',
            body: formData
        }).then(res => res.json()).then(data => {
            var arr = data.message.toString().split('\n')
            //console.log(arr)
            document.getElementById('incomingDiv').innerHTML = ``
            for(var i = 0; i < arr.length; i++) {
                //console.log(arr[i])
                document.getElementById('incomingDiv').innerHTML += `<p>${arr[i]}</p>`
            }
        })

        fetch('/api/switch', {
            method: 'POST',
            body: formData
        }).then(res => res.json()).then(data => {
            document.getElementById("Skolininkai").innerHTML = ""

            for (var i in data) {
                if(data[i] != 0) {
                    var innerhtml = `<div class="listText right">${i}:</div>`;

                    var number = parseFloat(data[i]).toFixed(2)

                    console.log(number)
                    console.log(data[i])
                    if(data[i][0] == '-') {                        
                        innerhtml += `<div class="red listText">${number} €</div>`
                    } else {
                        innerhtml += `<div class="green listText">${number} €</div>`
                    }
                
                    // console.log(innerhtml + "sitas")
                    document.getElementById("Skolininkai").innerHTML += innerhtml;
                }
            }
        })
    }
}

async function summa() {
    var suma = parseInt(document.getElementById('Suma').value);
    //console.log(suma)
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