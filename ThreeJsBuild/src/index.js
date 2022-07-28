import Main from './components/Main';
import './components/style.css'

function init() {
    fetch("https://boletus-revenge.herokuapp.com/load")
        .then(res => res.json())
        .then(res => {
            if (res.size == 0) {
                alert("Na serwerze nie został zapisany żaden lvl")

                var quit = document.createElement("a")
                quit.setAttribute("href", "/")
                document.body.appendChild(quit)
                quit.click()
            }

            const container = document.getElementById('root');

            new Main(container, res);
        })
}

init();