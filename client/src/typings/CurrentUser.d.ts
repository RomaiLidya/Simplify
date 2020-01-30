interface CurrentUser {
  id: number;
  displayName: string;
  email: string;
  contactNumber: string;
  permissions: string[];
  tenant: string;
}

interface permissions {
  module: string;
  accessLevel: string;
}

interface tenant {
  key: string;
  name: string;
  numberOfLicense: number;
  salesPerson: string;
}
