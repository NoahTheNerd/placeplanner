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

var brush_history = [];
var brush_tmphist = [];
var brush_future = [];

document.body.onmousedown = function(e) {
    ++ismousedown;  
    brush_future = [];
    brush_tmphist = [];

    var tx = e.pageX - place.offsetLeft + place.clientLeft
    var ty = e.pageY - place.offsetTop + place.clientTop

    var x = Math.floor(tx/16)
    var y = Math.floor(ty/16)

    // get hex color
    var prevCol = ctx.getImageData(x*16, y*16, 1, 1).data
    var prevCol = [prevCol[0], prevCol[1], prevCol[2]]

    // check if the position is already in the tmp history
    var found = 0
    for (let i = 0; i < brush_tmphist.length; i++) {
        if (brush_tmphist[i].x == x && brush_tmphist[i].y == y) {
            found = 1
            break
        }
    }
    if (found == 1) {return}

    ctx.fillStyle = colors.free[color]
    ctx.fillRect(x*16, y*16, 16, 16)

    brush_tmphist.push({x:x, y:y, color:color, prevCol:prevCol})


}
document.body.onmouseup = function() {
    --ismousedown;
    if (brush_tmphist.length == 0) {return}
    brush_history.push(brush_tmphist)
    brush_tmphist = []
    brush_future = []
}
document.body.onmousemove = function(e) {
    if (!ismousedown) {return}
    var tx = e.pageX - place.offsetLeft + place.clientLeft
    var ty = e.pageY - place.offsetTop + place.clientTop

    var x = Math.floor(tx/16)
    var y = Math.floor(ty/16)

    // get hex color
    var prevCol = ctx.getImageData(x*16, y*16, 1, 1).data
    var prevCol = [prevCol[0], prevCol[1], prevCol[2]]

    // check if the position is already in the tmp history
    var found = 0
    for (let i = 0; i < brush_tmphist.length; i++) {
        if (brush_tmphist[i].x == x && brush_tmphist[i].y == y) {
            found = 1
            break
        }
    }
    if (found == 1) {return}

    ctx.fillStyle = colors.free[color]
    ctx.fillRect(x*16, y*16, 16, 16)

    brush_tmphist.push({x:x, y:y, color:color, prevCol:prevCol})
}

function rgbtohex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

document.body.onkeydown = function(e) {
    if (e.keyCode != 90) {return}
    if (!e.metaKey && !e.ctrlKey) {return}
    e.preventDefault()

    if (!e.shiftKey) {
        if (brush_history.length <= 0) {return}
        var last = brush_history.pop()
        brush_future.push(last)

        for (let i = 0; i < last.length; i++) {
            ctx.fillStyle = rgbtohex(last[i].prevCol[0], last[i].prevCol[1], last[i].prevCol[2])
            ctx.fillRect(last[i].x*16, last[i].y*16, 16, 16)
        }
    } else {
        if (brush_future.length <= 0) {return}
        console.log('forward')
        var last = brush_future.pop()
        brush_history.push(last)

        for (let i = 0; i < last.length; i++) {
            ctx.fillStyle = colors.free[last[i].color]
            ctx.fillRect(last[i].x*16, last[i].y*16, 16, 16)
        }
    }
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
