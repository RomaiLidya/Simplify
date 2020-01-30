interface ServiceAddressModel {
  id: number;
  contactPerson: string;
  contactNumber: string;
  secondaryContactPerson: string;
  secondaryContactNumber: string;
  country: string;
  address: string;
  postalCode: string;
  ClientId: number;
  new?: boolean;
}
