import { UserProfileResponseModel, PermissionResponseModel } from './ResponseFormats';

interface UserProfileWithPermissionsModel extends UserProfileResponseModel {
  permissions?: PermissionResponseModel[];
  tenant?: string;
}
