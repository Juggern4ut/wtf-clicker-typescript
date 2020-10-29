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
