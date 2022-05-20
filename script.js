let colors = {
    "free":{   
        "red":"#e50000",
        "orange":"#e59500",
        "yellow":"#e5d900",
        "lime":"#94e044",
        "green":"#02be01",
        "cyan":"#00d3dd",
        "teal":"#0083c7",
        "blue":"#0000ea",
        "purple":"#820080",
        "magenta":"#cf6ee4",
        "pink":"#ffa7d1",
        "brown":"#a5714b",
        "black":"#222222",
        "gray":"#8e8e8e",
        "lightgrey":"#e4e4e4",
        "white":"#ffffff",
    },
    "experimental":{
        "__proto__":"#000000"
    }
}

let color = "black"
let brushsize = 16
let colorpickerdiv = document.getElementById("colpick")

// Load the color picker!
for (let i = 0; i < Object.keys(colors.free).length; i++) {
    let colorEle = document.createElement("div")
    colorpickerdiv.appendChild(colorEle)
    colorEle.classList.add('col')
    colorEle.setAttribute('colorname', Object.keys(colors.free)[i])
    colorEle.style.backgroundColor = colors.free[Object.keys(colors.free)[i]]
    colorEle.setAttribute('onclick', `color = '${colorEle.getAttribute('colorname')}';//place.style.outlineColor = '${colors.free[colorEle.getAttribute('colorname')]}'`)
}

var place = document.getElementById('place')
var ctx = place.getContext('2d')

ctx.fillStyle = '#ffffff'
ctx.fillRect(0, 0, place.width, place.height)

var ismousedown = 0;
document.body.onmousedown = function() {
    ++ismousedown;  
}
document.body.onmouseup = function() {
    --ismousedown;  
}
document.body.onmousemove = function(event) {
    if (!ismousedown) {return}
    var tx = event.pageX - place.offsetLeft + place.clientLeft
    var ty = event.pageY - place.offsetTop + place.clientTop

    var x = Math.floor(tx/16)
    var y = Math.floor(ty/16)

    ctx.fillStyle = colors.free[color]
    ctx.fillRect(x*16, y*16, 16, 16)
}

function resetplace() {
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, place.width, place.height)
}


// Size cycling
var sizes = [[512, 512],[1024, 512],[1024, 1024]]
var currentsize = 1
var title = document.getElementsByClassName('title')
function cyclesize() {

    switch (currentsize) {
        case 1:
            currentsize = 2
            place.width = 512
            place.height = 256
            brushsize = 8
            title.innerText = "Place Planner [64x32]"
            break;
        case 2:
            currentsize = 3
            place.width = 512
            place.height = 512
            brushsize = 8
            title.innerText = "Place Planner [64x64]"
            break;
        case 3:
            currentsize = 1
            place.width = 512
            place.height = 512
            brushsize = 16
            title.innerText = "Place Planner [32x32]"
            break;
    }
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, place.width, place.height)
}
