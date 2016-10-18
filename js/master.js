const {ipcRenderer} = require('electron')

$(".ButtonColseWindow").click(function(){
    ipcRenderer.send("close-main-window","close");
})
$(".ButtonMaximize").click(function(){
    ipcRenderer.send("window-max-size");
})
$(".ButtonMinimizable").click(function(){
    ipcRenderer.send("window-min-size");
})
