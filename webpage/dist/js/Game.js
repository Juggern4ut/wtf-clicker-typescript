import { Buff } from "./Buff.js";
import { Clicker } from "./Clicker.js";
import { ClickerUpgrade } from "./ClickerUpgrade.js";
import { GoldenPelo } from "./GoldenPelo.js";
import { Inventory } from "./Inventory.js";
import { Member } from "./Member.js";
import { Save } from "./Save.js";
import { Score } from "./Score.js";
import { Upgrade } from "./Upgrade.js";
/**
 * Coordinates the overall game state, loading, saving, and update loop.
 */
export class Game {
    /**
     * Returns an existing upgrade save entry or creates a default one.
     * @param saveEntries The upgrade save collection to read from.
     * @param id The upgrade id.
     * @returns A mutable save entry for the requested upgrade.
     */
    getOrCreateUpgradeSaveEntry(saveEntries, id) {
        let entry = saveEntries.find((item) => item.id === id);
        if (!entry) {
            entry = { id, bought: false };
            saveEntries.push(entry);
        }
        return entry;
    }
    /**
     * Creates a new game instance and starts its update loops.
     */
    constructor() {
        this.intervalSpeed = 100;
        this.members = [];
        this.membersSave = [];
        this.upgrades = [];
        this.upgradesSave = [];
        this.clickerUpgrades = [];
        this.clickerUpgradesSave = [];
        this.score = 0;
        this.showBoughtUpgrades = false;
        this.lastUpdate = 0;
        this.dailyBonusGot = 0;
        this.handmadeCaps = 0;
        this.capsPerSecond = 0;
        this.totalMembers = 0;
        this.runDuration = 0;
        this.missedGoldenPelo = 0;
        this.scoreElement = new Score(document.querySelector(".score"), document.querySelector(".scorePerSeconds"));
        this.clicker = new Clicker(this);
        this.goldenPelo = new GoldenPelo(this);
        this.instantiateMembers();
        this.buff = new Buff(this.members);
        this.inventory = new Inventory(this.buff);
        this.save = new Save(this);
        this.saveDialog = document.querySelector(".saveDialog");
        this.loadDialog = document.querySelector(".loadDialog");
        this.inventoryContainer = document.querySelector(".inventory__content");
        this.runStarted = Date.now();
        const showBoughtButton = document.querySelector(".showBought");
        showBoughtButton.onclick = () => {
            this.showBoughtUpgrades = !this.showBoughtUpgrades;
            showBoughtButton.innerHTML = this.showBoughtUpgrades ? "Gekaufte Upgrades ausblenden" : "Gekaufte Upgrades anzeigen";
        };
        this.saveInterval = setInterval(() => {
            this.save.save();
        }, 5000);
        this.stepInterval = setInterval(() => {
            this.step();
        }, this.intervalSpeed);
        this.addSaveAndLoadDialogLogic();
    }
    /**
     * Loads and instantiates all members from the JSON source.
     */
    instantiateMembers() {
        fetch("/data/members.json")
            .then((res) => res.json())
            .then((res) => {
            res.forEach((mem) => {
                const tmp = new Member(mem.name, mem.basePower, mem.basePrice, mem.image, mem.id);
                this.members.push(tmp);
                this.membersSave.push({ id: mem.id, amount: 0 });
            });
            this.members.forEach((member) => {
                member.dom.buyHandler.onclick = () => {
                    if (member.getPrice() <= this.score) {
                        this.score -= member.getPrice();
                        const entry = this.membersSave.find((item) => item.id === member.id);
                        entry.amount++;
                        member.setAmount(member.getAmount() + 1);
                        this.save.save();
                    }
                };
                member.dom.statHandler.onclick = () => {
                    alert(`${member.amount} ${member.amount == 1 ? member.name : member.name + "s"} à ${member.basePower * member.getMultiplier()} = ${member.amount * member.basePower * member.getMultiplier()} cps.`);
                };
            });
            this.instantiateClickerUpgrades();
        });
    }
    /**
     * Loads and instantiates all clicker upgrades.
     */
    instantiateClickerUpgrades() {
        fetch("/data/clickerUpgrades.json")
            .then((res) => res.json())
            .then((res) => {
            res.forEach((up) => {
                const tmp = new ClickerUpgrade(up.name, up.description, up.requirement, up.type, up.power, up.price, up.id);
                this.clickerUpgrades.push(tmp);
                this.clickerUpgradesSave.push({ id: up.id, bought: false });
                if (tmp.buyHandler) {
                    tmp.buyHandler.onclick = () => {
                        if (tmp.price <= this.score) {
                            this.score -= tmp.price;
                            this.getOrCreateUpgradeSaveEntry(this.clickerUpgradesSave, up.id).bought = true;
                            tmp.buy();
                            this.save.save();
                        }
                    };
                }
            });
            this.instantiateUpgrades();
        });
    }
    /**
     * Loads and instantiates all member upgrades.
     */
    instantiateUpgrades() {
        fetch("/data/upgrades.json")
            .then((res) => res.json())
            .then((res) => {
            res.forEach((up) => {
                const tmp = new Upgrade(up.name, up.description, up.requirement, up.multiplier, up.price, up.id);
                const refMember = this.members.find((member) => member.id === up.referenceId);
                refMember.addUpgrade(tmp);
            });
            this.members.forEach((member) => {
                member.upgrades.forEach((upgrade) => {
                    this.upgradesSave.push({ id: upgrade.id, bought: false });
                    if (upgrade.dom && upgrade.buy) {
                        upgrade.buy.onclick = () => {
                            if (this.score >= upgrade.price && !upgrade.bought) {
                                upgrade.bought = true;
                                this.getOrCreateUpgradeSaveEntry(this.upgradesSave, upgrade.id).bought = true;
                                this.score -= upgrade.price;
                                this.save.save();
                            }
                        };
                    }
                });
            });
            this.save.load();
        });
    }
    /**
     * Resets the current save after user confirmation.
     */
    reset() {
        if (confirm("Wirklich den gesamten Fortschritt löschen?")) {
            this.save.reset();
        }
    }
    /**
     * Rebuilds the statistics panel.
     */
    updateStats() {
        const container = document.querySelector(".stats__content");
        container.innerHTML = "";
        const date = new Date(this.runStarted).toLocaleString();
        const dateEntry = document.createElement("div");
        dateEntry.classList.add("stats__entry");
        dateEntry.innerHTML = "<span>Spielbeginn:</span><span>" + date + "</span>";
        const handMadeEntry = document.createElement("div");
        handMadeEntry.classList.add("stats__entry");
        handMadeEntry.innerHTML = "<span>Von Hand geöffnete Biere:</span><span>" + window.numberAsText(this.handmadeCaps) + "</span>";
        const missedPeloEntry = document.createElement("div");
        missedPeloEntry.classList.add("stats__entry");
        missedPeloEntry.innerHTML = "<span>Verpasste goldene PeLos:</span><span>" + this.goldenPelo.missedGoldenPelo + "</span>";
        const membersEntry = document.createElement("div");
        membersEntry.classList.add("stats__entry");
        membersEntry.innerHTML = "<span>Anzahl Mitglieder:</span><span>" + this.totalMembers + "</span>";
        container.append(dateEntry);
        container.append(handMadeEntry);
        container.append(missedPeloEntry);
        container.append(membersEntry);
    }
    /**
     * Advances the game state by one update tick.
     */
    step() {
        this.buff.update();
        let difference = 1;
        if (this.lastUpdate && Date.now() - this.lastUpdate > 1000) {
            difference = (Date.now() - this.lastUpdate) / 100;
        }
        const tmp = new Date();
        if (tmp.getDate() !== this.dailyBonusGot) {
            this.dailyBonusGot = 0;
        }
        this.lastUpdate = Date.now();
        let increase = 0;
        this.members.forEach((member) => {
            increase += member.getIncrease(this.buff.activeBuff);
        });
        increase *= difference;
        this.members.forEach((member) => {
            member.updateBuyability(this.score);
            member.update(this.score, this.showBoughtUpgrades, this.buff.activeBuff);
        });
        this.clickerUpgrades.forEach((clickerUpgrade) => {
            clickerUpgrade.updateBuyability(this.score);
            clickerUpgrade.updateVisibility(this.members[0].amount, this.handmadeCaps, this.showBoughtUpgrades);
        });
        this.totalMembers = 0;
        this.members.forEach((member) => {
            this.totalMembers += member.amount;
        });
        let buffedIncrease = 0;
        if (this.buff.activeBuff && this.buff.activeBuff.id === 2) {
            this.score += (increase / (1000 / this.intervalSpeed)) * this.buff.activeBuff.power;
            buffedIncrease = increase * this.buff.activeBuff.power;
        }
        else {
            this.score += increase / (1000 / this.intervalSpeed);
            buffedIncrease = increase;
        }
        this.scoreElement.updateScore(this.score, buffedIncrease);
        this.capsPerSecond = buffedIncrease;
        if (increase > 1000000) {
            document.querySelector(".inventory").classList.add("visible");
            this.goldenPelo.spawnRandomItem();
        }
        else {
            document.querySelector(".inventory").classList.remove("visible");
        }
        this.runDuration = Date.now() - this.runStarted;
    }
    /**
     * Wires the save and load dialog interactions.
     */
    addSaveAndLoadDialogLogic() {
        const showSaveButton = document.querySelector(".navigation__list-item.save");
        const showLoadButton = document.querySelector(".navigation__list-item.load");
        showSaveButton.addEventListener("click", () => {
            this.saveDialog.classList.add("saveDialog__open");
            const saveString = this.save.save();
            this.saveDialog.querySelector("textarea").innerHTML = saveString;
        });
        this.saveDialog.addEventListener("click", (event) => {
            const tmp = event.target;
            if (tmp.classList.contains("saveDialog")) {
                this.saveDialog.classList.remove("saveDialog__open");
            }
        });
        showLoadButton.addEventListener("click", () => {
            this.loadDialog.classList.add("loadDialog__open");
        });
        this.loadDialog.addEventListener("click", (event) => {
            const tmp = event.target;
            if (tmp.classList.contains("loadDialog")) {
                this.loadDialog.classList.remove("loadDialog__open");
            }
        });
        this.loadDialog.querySelector("button").addEventListener("click", () => {
            const loadState = this.loadDialog.querySelector("textarea").value;
            JSON.parse(atob(loadState));
            this.save.load(loadState);
            this.loadDialog.querySelector("textarea").value = "";
            this.loadDialog.classList.remove("loadDialog__open");
        });
    }
}
//# sourceMappingURL=Game.js.map