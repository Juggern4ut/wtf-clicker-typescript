var Save = /** @class */ (function () {
    function Save(game) {
        this.saveData = {};
        this.game = game;
    }
    Save.prototype.save = function (members, score) {
        this.saveData["members"] = members;
        this.saveData["score"] = score;
        document.cookie = "data=" + JSON.stringify(this.saveData);
    };
    Save.prototype.load = function (members) {
        if (document.cookie) {
            var data_1 = document.cookie.replace("data=", "");
            data_1 = JSON.parse(data_1);
            members.forEach(function (member, index) {
                if (data_1["members"][index]) {
                    member.amount = data_1["members"][index].amount;
                    member.update();
                }
            });
            this.game.score = data_1["score"];
        }
    };
    return Save;
}());
