interface VehiclesModel {
  id: number;
  model: string;
  carplateNumber: string;
  coeExpiryDate: Date;
  vehicleStatus: boolean;
  employeeInCharge: number;
  displayName?: string;
  new?: boolean;
}
