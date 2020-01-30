interface ClientDetailsModel {
  id: number;
  name: string;
  contactPerson: string;
  contactNumber: string;
  contactEmail: string;
  country: string;
  billingAddress: string;
  new?: boolean;
}
