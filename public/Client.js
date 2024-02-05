
function start(){
    document.getElementById("User").addEventListener("change", addActivityItem, false);
    }

function addActivityItem(){
    console.log("User Switched");

    var formData = new FormData;
    formData.append('user', document.getElementById("User").value)

    fetch('/api/switch', {
        method: 'POST',
        body: formData
    }).then(res => res.json()).then(data => {
        console.log(data);
    })
}

window.addEventListener("load", start, false);