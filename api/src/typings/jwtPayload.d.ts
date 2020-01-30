import { PermissionResponseModel } from './ResponseFormats';

export interface JwtPayload {
  id: number;
  tenant: string;
  permissions: PermissionResponseModel[];
  jti: string;
}
