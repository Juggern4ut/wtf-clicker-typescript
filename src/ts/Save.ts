import type { Game } from "./Game.js";
import type { InventoryAmount } from "./Inventory.js";

interface MemberSaveEntry {
  id: number;
  amount: number;
}

interface UpgradeSaveEntry {
  id: number;
  bought: boolean;
}

interface GameSaveState {
  score: number;
  dailyBonusGot: number;
  handmadeCaps: number;
  runStarted: number;
  missedGoldenPelo: number;
}

interface SaveData {
  inventory_new: InventoryAmount[];
  members_new: MemberSaveEntry[];
  upgrades_new: UpgradeSaveEntry[];
  clicker_upgrades_new: UpgradeSaveEntry[];
  game: GameSaveState;
}

/**
 * Serializes and restores the game state.
 */
export class Save {
  game: Game;

  /**
   * Creates a new save manager.
   * @param game The current game instance.
   */
  constructor(game: Game) {
    this.game = game;
  }

  /**
   * Merges stored upgrade flags into the currently known upgrade defaults.
   * This preserves new upgrade ids that older saves do not know about.
   * @param currentEntries The runtime default save entries.
   * @param loadedEntries The saved entries loaded from storage.
   * @returns The merged save entries.
   */
  mergeUpgradeEntries(currentEntries: UpgradeSaveEntry[], loadedEntries: UpgradeSaveEntry[]): UpgradeSaveEntry[] {
    const loadedById = new Map(loadedEntries.map((entry) => [entry.id, entry.bought]));

    return currentEntries.map((entry) => ({
      id: entry.id,
      bought: loadedById.get(entry.id) ?? entry.bought,
    }));
  }

  /**
   * Saves the current game state into local storage.
   * @returns The serialized save string.
   */
  save(): string {
    const saveData: SaveData = {
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
  load(fromString?: string): void {
    let localStorageData: string | null;
    if (fromString) {
      localStorageData = fromString;
      this.game.inventory.clearInventory();
    } else {
      localStorageData = localStorage.getItem("WtfClickerGame2");
    }

    if (localStorageData) {
      const data = JSON.parse(atob(localStorageData)) as Partial<SaveData> & Record<string, unknown>;

      if (data.members_new) {
        this.game.membersSave = data.members_new;
        data.members_new.forEach((memberSave: MemberSaveEntry) => {
          (this.game.members.find((member) => member.id === memberSave.id) as NonNullable<(typeof this.game.members)[number]>)?.setAmount(memberSave.amount);
          (this.game.membersSave.find((item) => item.id === memberSave.id) as MemberSaveEntry).amount = memberSave.amount;
        });
      }

      if (data.upgrades_new) {
        this.game.upgradesSave = this.mergeUpgradeEntries(this.game.upgradesSave, data.upgrades_new);
        this.game.members.forEach((member) => {
          member.upgrades.forEach((upgrade) => {
            const found = this.game.upgradesSave.find((item) => item.id === upgrade.id);
            if (found) {
              upgrade.bought = found.bought;
            }
          });
        });
      }

      if (data.clicker_upgrades_new) {
        this.game.clickerUpgradesSave = this.mergeUpgradeEntries(this.game.clickerUpgradesSave, data.clicker_upgrades_new);
        this.game.clickerUpgradesSave.forEach((upgrade: UpgradeSaveEntry) => {
          const clickerUpgrade = this.game.clickerUpgrades.find((item) => item.id === upgrade.id);
          if (clickerUpgrade) {
            clickerUpgrade.bought = upgrade.bought;
          }
        });
      }

      if (data.inventory_new) {
        data.inventory_new.forEach((item: InventoryAmount) => {
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
      } else if (data.score || data.handmadeCaps) {
        this.game.score = parseInt(String(data.score), 10);
        const handmadeCaps = data.handmadeCaps ? parseInt(String(data.handmadeCaps), 10) : 0;
        this.game.handmadeCaps = handmadeCaps;
      }
    }
  }

  /**
   * Removes the current save and reloads the page.
   */
  reset(): void {
    localStorage.removeItem("WtfClickerGame2");
    window.location.reload();
  }
}
