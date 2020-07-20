import { Container } from "../utils/Container";
import { IUserService } from "./IUserService";
import { TYPES } from "../abstract";
import { UserService } from "./UserService";
import { ICommandService } from "./ICommandService";
import { CommandService } from "./CommandService";
import { IPhoneService } from "./IPhoneService";
import { PhoneService } from "./PhoneService";
import { IDeliverySessionService } from "./IDeliverySession";
import { DeliverySessionService } from "./DeliverySession";
import { IPewService } from "./IPewService";
import { PewService } from "./PewService";
import { IVehicleService } from "./IVehicleService";
import { VehicleService } from "./VehicleService";

export class ServiceRegistry {
  private container: Container;

  constructor(container: Container) {
    this.container = container;
  }

  registerServices() {
    this.container.bind<IUserService>(
      TYPES.UserService,
      resolver =>
        new UserService(
          resolver.resolve(TYPES.EntityManager),
          resolver.resolve(TYPES.IOServer),
          resolver.resolve(TYPES.VehicleService)
        )
    );

    this.container.bind<ICommandService>(
      TYPES.CommandService,
      resolver =>
        new CommandService(
          resolver.resolve(TYPES.EntityManager),
          resolver.resolve(TYPES.IOServer)
        )
    );

    this.container.bind<IPewService>(
      TYPES.PewService,
      resolver =>
        new PewService(
          resolver.resolve(TYPES.EntityManager),
          resolver.resolve(TYPES.IOServer)
        )
    );

    this.container.bind<IPhoneService>(
      TYPES.PhoneService,
      new PhoneService(
        this.container.resolve(TYPES.EntityManager),
        this.container.resolve(TYPES.IOServer)
      )
    );

    this.container.bind<IDeliverySessionService>(
      TYPES.DeliverySessionService,
      () =>
        new DeliverySessionService(
          this.container.resolve(TYPES.EntityManager),
          this.container.resolve(TYPES.IOServer),
          this.container.resolve(TYPES.UserService)
        )
    );

    this.container.bind<IVehicleService>(
      TYPES.VehicleService,
      resolver =>
        new VehicleService(
          resolver.resolve(TYPES.EntityManager),
          resolver.resolve(TYPES.IOServer)
        )
    );
  }
}
