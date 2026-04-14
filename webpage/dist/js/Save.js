/**
 * Serializes and restores the game state.
 */
export class Save {
    /**
     * Creates a new save manager.
     * @param game The current game instance.
     */
    constructor(game) {
        this.game = game;
    }
    /**
     * Saves the current game state into local storage.
     * @returns The serialized save string.
     */
    save() {
        const saveData = {
            inventory_new: this.game.inventory.stack,
            members_new: this.game.membersSave,
            upgrades_new: this.game.upgradesSave,
            clicker_upgrades_new: this.game.clickerUpgradesSave,
            game: {
                score: this.game.score,
                dailyBonusGot: this.game.dailyBonusGot,
                handmadeCaps: this.game.handmadeCaps,
                runStarted: this.game.runStarted,
                missedGoldenPelo: this.game.goldenPelo.missedGoldenPelo,
            },
        };
        const saveString = btoa(JSON.stringify(saveData));
        localStorage.setItem("WtfClickerGame2", saveString);
        return saveString;
    }
    /**
     * Loads the saved game state from local storage or a provided string.
     * @param fromString An optional external save string.
     */
    load(fromString) {
        let localStorageData;
        if (fromString) {
            localStorageData = fromString;
            this.game.inventory.clearInventory();
        }
        else {
            localStorageData = localStorage.getItem("WtfClickerGame2");
        }
        if (localStorageData) {
            const data = JSON.parse(atob(localStorageData));
            if (data.members_new) {
                this.game.membersSave = data.members_new;
                data.members_new.forEach((memberSave) => {
                    this.game.members.find((member) => member.id === memberSave.id)?.setAmount(memberSave.amount);
                    this.game.membersSave.find((item) => item.id === memberSave.id).amount = memberSave.amount;
                });
            }
            if (data.upgrades_new) {
                this.game.upgradesSave = data.upgrades_new;
                this.game.members.forEach((member) => {
                    member.upgrades.forEach((upgrade) => {
                        const found = data.upgrades_new?.find((item) => item.id === upgrade.id);
                        if (found) {
                            upgrade.bought = found.bought;
                        }
                    });
                });
            }
            if (data.clicker_upgrades_new) {
                data.clicker_upgrades_new.forEach((upgrade) => {
                    this.game.clickerUpgrades.find((item) => item.id === upgrade.id).bought = upgrade.bought;
                });
                this.game.clickerUpgradesSave = data.clicker_upgrades_new;
            }
            if (data.inventory_new) {
                data.inventory_new.forEach((item) => {
                    this.game.inventory.addItem(item.id, item.amount);
                });
                this.game.inventory.updateInventory();
            }
            if (data.game) {
                this.game.score = data.game.score;
                this.game.dailyBonusGot = data.game.dailyBonusGot;
                this.game.handmadeCaps = data.game.handmadeCaps;
                this.game.runStarted = data.game.runStarted;
                this.game.goldenPelo.missedGoldenPelo = data.game.missedGoldenPelo;
            }
            else if (data.score || data.handmadeCaps) {
                this.game.score = parseInt(String(data.score), 10);
                const handmadeCaps = data.handmadeCaps ? parseInt(String(data.handmadeCaps), 10) : 0;
                this.game.handmadeCaps = handmadeCaps;
            }
        }
    }
    /**
     * Removes the current save and reloads the page.
     */
    reset() {
        localStorage.removeItem("WtfClickerGame2");
        window.location.reload();
    }
}
