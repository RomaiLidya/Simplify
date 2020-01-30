interface UserDetailsModel {
  id: number;
  roleId: number;
  role: string;
  displayName: string;
  email: string;
  contactNumber: string;
  active: boolean;
  lock: boolean;
  new?: boolean;
}
