class Clicker {
  game: Game;
  power: number = 1;

  constructor(game: Game) {
    this.game = game;

    const container = document.createElement("div");
    container.classList.add("clicker");

    const image = document.createElement("img");
    image.classList.add("Bottle")
    image.src = "/img/bottle.png";

    const cap = document.createElement("img");
    cap.classList.add("Cap");
    cap.src = "/img/cap.png";
    
    container.append(image);

    document.querySelector("body").prepend(container);
    
    image.onclick = () => {
      container.appendChild(cap.cloneNode(true));

      setTimeout(() => {
        container.querySelector(".Cap:not(.Fly)").classList.add("Fly_" + Math.ceil(Math.random() * 11));
        container.querySelector(".Cap:not(.Fly)").classList.add("Fly");
      }, 20);

      setTimeout(() => {
        container.querySelector(".Cap").remove();
      }, 200);
      game.score++;
    };
  }
}
