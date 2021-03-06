import React from "react";
import { DeliverySessionProvider } from "../../../hooks/DeliverySessionProvider";
import { DeliveryRoute } from "./DeliveryRoute";
import { GameStats } from "./GameStats";
import { VehicleSelection } from "./VehicleSelection";
import { PewQueue } from "./PewQueue";
import { PewClue } from "./PewClue";

export const XStreamDelivery = () => {
  return (
    <DeliverySessionProvider>
      <div className="absolute top-0 left-0 mt-40">
        <PewClue />
      </div>
      <div className="absolute top-0 right-0 w-1/4">
        <PewQueue />
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <GameStats />
        <VehicleSelection />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-20 bg-blue-300">
        <DeliveryRoute />
      </div>
    </DeliverySessionProvider>
  );
};
