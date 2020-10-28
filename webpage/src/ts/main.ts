window.onload = () => {
  window["numberWithCommas"] = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  };

  window["numberAsText"] = (number) => {
    if(number < 1000000) return window["numberWithCommas"](number.toFixed(2));
    const scales = [
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

    const index = number.toLocaleString().split(",").length - 1;
    const outNumber = (number / Math.pow(1000, index)).toFixed(2);
    return outNumber+" "+scales[index];

  };

  window["clicker"] = new Game();
};
