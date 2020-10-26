var Clicker = /** @class */ (function () {
    function Clicker(game) {
        this.power = 1;
        this.game = game;
        var container = document.createElement("div");
        container.classList.add("clicker");
        var image = document.createElement("img");
        image.classList.add("Bottle");
        var cap = document.createElement("img");
        cap.classList.add("Cap");
        cap.src = "/img/cap.png";
        image.src = "/img/bottle.png";
        container.append(image);
        document.querySelector("body").prepend(container);
        image.onclick = function () {
            container.appendChild(cap.cloneNode(true));
            setTimeout(function () {
                container.querySelector(".Cap:not(.Fly)").classList.add("Fly_" + Math.ceil(Math.random() * 11));
                container.querySelector(".Cap:not(.Fly)").classList.add("Fly");
            }, 20);
            setTimeout(function () {
                container.querySelector(".Cap").remove();
            }, 200);
            game.score++;
        };
    }
    return Clicker;
}());
