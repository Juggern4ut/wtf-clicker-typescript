/**
 * Handles item consumption and the currently active buff state.
 */
export class Buff {
    /**
     * Creates a new buff manager.
     * @param members The available members in the game.
     */
    constructor(members) {
        this.activeBuff = null;
        this.buffStart = null;
        this.members = members;
    }
    /**
     * Consumes an item and either activates a timed buff or applies its instant effect.
     * @param item The item being consumed.
     */
    consumeItem(item) {
        if (item.duration > 0) {
            this.activeBuff = item;
            this.buffStart = Date.now();
            const activeBuffImage = document.querySelector(".active_buff__image");
            activeBuffImage.src = "/img/items/" + this.activeBuff.imageString;
        }
        else {
            if (item.id === 1000) {
                const member = this.getRandomMember(true);
                member.amount++;
                alert("Gratuliere! 1x " + member.name);
            }
            else if (item.id === 4) {
                const wonMember = this.getRandomMember(true);
                const lostMember = this.getRandomMember(true);
                wonMember.amount++;
                lostMember.amount--;
                alert("Mitgliederveränderungen: +1 " + wonMember.name + ", -1 " + lostMember.name);
            }
        }
    }
    /**
     * Checks whether the current buff is still active.
     * @returns `true` when the current buff duration has not expired.
     */
    checkBuff() {
        if (!this.activeBuff || this.buffStart === null) {
            return false;
        }
        return this.buffStart + this.activeBuff.duration * 1000 > Date.now();
    }
    /**
     * Updates the active buff state and refreshes the related DOM.
     */
    update() {
        if (!this.checkBuff()) {
            this.activeBuff = null;
            this.buffStart = null;
        }
        this.updateDom();
    }
    /**
     * Updates the active buff UI.
     */
    updateDom() {
        const body = document.querySelector("body");
        const activeBuff = document.querySelector(".active_buff");
        const activeBuffInner = document.querySelector(".active_buff__time--inner");
        if (this.activeBuff && this.buffStart !== null) {
            const dur = this.activeBuff.duration * 1000;
            const remain = (this.buffStart + dur - Date.now()) / (this.activeBuff.duration * 1000);
            body.classList.add("buff");
            activeBuff.classList.add("active_buff--visible");
            activeBuffInner.style.width = remain * 100 + "%";
        }
        else {
            body.classList.remove("buff");
            activeBuff.classList.remove("active_buff--visible");
        }
    }
    /**
     * Returns a random member from the available pool.
     * @param bought Whether only already-owned members are allowed.
     * @returns A randomly selected member.
     */
    getRandomMember(bought = true) {
        const possible = [];
        this.members.forEach((member) => {
            if (member.amount > 0 || !bought) {
                possible.push(member);
            }
        });
        return possible[Math.floor(Math.random() * possible.length)];
    }
}
//# sourceMappingURL=Buff.js.map