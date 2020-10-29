class Clicker {
  game: Game;
  power: number = 1;

  constructor(game: Game) {
    this.game = game;

    const container = document.createElement("div");
    container.classList.add("clicker");

    const image = document.createElement("img");
    image.classList.add("Bottle");
    image.src = "/img/bottle.png";
    image.draggable = false;

    const cap = document.createElement("img");
    cap.classList.add("Cap");
    cap.src = "/img/cap.png";

    container.append(image);

    document.querySelector("body").prepend(container);

    image.onclick = (e) => {
      container.appendChild(cap.cloneNode(true));

      setTimeout(() => {
        container.querySelector(".Cap:not(.Fly)").classList.add("Fly_" + Math.ceil(Math.random() * 11));
        container.querySelector(".Cap:not(.Fly)").classList.add("Fly");
      }, 20);

      setTimeout(() => {
        container.querySelector(".Cap").remove();
      }, 200);

      let power = 1;
      game.clickerUpgrades.forEach((c) => {
        if (!c.bought) return false;

        if (c["type"] === "multiplier") {
          power = power * c.power;
        } else if (c["type"] === "percentage") {
          power = power + game.capsPerSecond * (c.power / 100);
        } else if (c["type"] === "buildingAddition") {
          power = power + game.totalMembers * c.power;
        }
      });

      let tmp = document.createElement("p");
      tmp.classList.add("clickIncrease");
      tmp.innerHTML = "+ " + window["numberAsText"](power);
      tmp.style.top = e.clientY + "px";
      tmp.style.left = e.clientX + "px";
      document.querySelector("body").append(tmp);
      setTimeout(() => {
        tmp.classList.add("clickIncrease--fade");
      }, 10);

      setTimeout(() => {
        tmp.remove();
      }, 500);

      game.score += power;
      game.handmadeCaps += power;
    };
  }
}
