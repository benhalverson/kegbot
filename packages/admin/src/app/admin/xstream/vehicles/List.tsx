import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { IVehicle } from "../../../../interfaces";

export const VehicleList = () => {
  const match = useRouteMatch();
  const [vehicles, setVehicles] = React.useState<IVehicle[]>([]);

  React.useEffect(() => {
    fetch("http://localhost:4040/xstream/vehicles")
      .then(res => res.json())
      .then(res => setVehicles(res))
      .catch(console.error);
  }, []);

  const handleReset = () => {
    setVehicles([]);
  };

  return (
    <div>
      <h1 className="text-3xl tracking-wide text-indigo-600 uppercase">
        Vehicles
      </h1>
      <div className="flex justify-end w-full mb-12">
        <Link to={`${match.url}/create`}>Create New</Link>
      </div>
      <div className="flex flex-wrap items-center space-x-8">
        {vehicles.map(vehicle => {
          return (
            <div key={vehicle.id} className="bg-white rounded shadow">
              <div className="p-4">
                <h3 className="text-lg text-orange-400">{vehicle.name}</h3>
                <Link to={`/xstream/vehicles/${vehicle.id}`}>Edit</Link>
              </div>
              <div className="flex items-center p-4 bg-gray-200 space-x-4">
                <div className="flex flex-col items-center">
                  <p className="tracking-wide text-gray-600 uppercase">Cost</p>
                  <p>{vehicle.cost}</p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="tracking-wide text-gray-600 uppercase">
                    Health
                  </p>
                  <p>{vehicle.baseHealth}</p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="tracking-wide text-gray-600 uppercase">Speed</p>
                  <p>{vehicle.baseSpeed}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
