window.onload = function () {
    window["numberWithCommas"] = function (number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
    };
    window["clicker"] = new Game();
};
