window.onload = function () {
    document.querySelector(".navigation__burger").addEventListener("click", function () {
        document.querySelector(".navigation").classList.toggle("navigation--open");
    });
    document.querySelector(".stats-button").addEventListener("click", function () {
        window["clicker"].updateStats();
        document.querySelector(".stats").classList.add("stats--open");
    });
    document.querySelector(".stats__close").addEventListener("click", function () {
        document.querySelector(".stats").classList.remove("stats--open");
    });
    window["numberWithCommas"] = function (number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
    };
    window["numberAsText"] = function (number) {
        if (number < 1000000)
            return window["numberWithCommas"](number.toFixed(2));
        var scales = [
            "",
            "tausend",
            "millionen",
            "milliarden",
            "billionen",
            "billiarden",
            "trillionen",
            "trilliarden",
            "quadrillionen",
            "quadrilliarden",
            "quintillionen",
            "quintilliarden",
            "sextillionen",
            "sextilliarden",
            "septillionen",
            "septilliarden",
            "oktillionen",
            "oktilliarden",
            "nonillionen",
            "nonilliarden",
            "dezillionen",
            "dezilliarden",
        ];
        for (var power = 0; power < scales.length; power++) {
            var potence = Math.pow(1000, power);
            var division = number / potence;
            if (division < 1000) {
                return division.toFixed(2) + " " + scales[power];
            }
        }
        return (number / Math.pow(1000, scales.length - 1)).toFixed(2) + " " + scales[scales.length - 1];
    };
    window["clicker"] = new Game();
};
