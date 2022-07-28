const socket = io("/");

document.cookie = "session=yes"

socket.emit('join');

socket.on('join', function (e) {
    if (e == 2) {
        setTimeout(() => {
            const menu = document.createElement("a")
            menu.setAttribute("href", "/menu")
            document.body.appendChild(menu)
            menu.click()
        },200)
    }
})

window.addEventListener('beforeunload', function (e) {
    fetch('/quit') 
    e.returnValue = '';
});