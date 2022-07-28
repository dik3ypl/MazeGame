if (document.cookie != "session=yes") {
    window.location.replace('/')
} else {
    document.cookie = "session=no"

    var center = document.createElement('center')
    var a = document.createElement("a")
    var button = document.createElement("button")

    a.setAttribute("href", "/")
    button.innerText = 'Play Again'

    a.appendChild(button)
    center.appendChild(a)

    setTimeout(function () {
        document.body.appendChild(center)
    }, 1500)
}