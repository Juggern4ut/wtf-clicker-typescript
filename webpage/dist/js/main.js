window.onload = function () {
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
        var index = number.toLocaleString().split(",").length - 1;
        var outNumber = (number / Math.pow(1000, index)).toFixed(2);
        return outNumber + " " + scales[index];
    };
    window["clicker"] = new Game();
};
