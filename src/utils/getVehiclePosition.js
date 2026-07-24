export function getVehiclePosition(vehicle) {
  const point =
    vehicle.route[vehicle.currentIndex];

  return [
    point[0],
    point[1],
  ];
}