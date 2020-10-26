window.onload = () => {
  window["numberWithCommas"] = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  };
  window["clicker"] = new Game();
};
