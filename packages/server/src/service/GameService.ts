import { BaseService } from "../abstract";
import { IGameService, GameOptions, IGame } from "./IGameService";
import { IPhoneService } from "./IPhoneService";
import { EntityManager } from "typeorm";
import { Server } from "socket.io";

export class GameService extends BaseService implements IGameService {
  private phoneService: IPhoneService;
  private game?: IGame;

  constructor(manager: EntityManager, io: Server, phoneService: IPhoneService) {
    super(manager, io);
    this.phoneService = phoneService;
  }

  getGame() {
    return new Promise<IGame | undefined>((resolve, reject) => {
      if (!this.game) {
        reject("There is no current game");
      }
      resolve(this.game);
    });
  }

  startGame(options: GameOptions) {
    return new Promise<IGame>((resolve, reject) => {
      if (this.game) {
        reject("Game already running");
      }

      this.game = {
        options,
        activeDeliverySession: undefined
      };
      this.phoneService.init(this.game?.options?.phoneFrequencyMultiplier);
      this.io.emit("game-started", this.game);
      resolve(this.game);
    });
  }

  stopGame() {
    this.game = undefined;
  }

  setGameOptions(options: GameOptions) {
    return new Promise<IGame>((resolve, reject) => {
      if (this.game) {
        reject("Cannot update a running game - stop game first");
      }

      this.game = {
        options,
        activeDeliverySession: undefined
      };

      resolve(this.game);
    });
  }
}
