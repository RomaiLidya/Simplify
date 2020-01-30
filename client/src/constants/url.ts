const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const LOGIN_URL = `${BASE_URL}/login`;
export const LOGOUT_URL = `${BASE_URL}/logout`;
export const FORGOT_PASSWORD_URL = `${BASE_URL}/forgotpassword`;
export const RESET_PASSWORD_URL = `${BASE_URL}/resetpassword`;
export const CHANGE_PASSWORD_URL = `${BASE_URL}/changepassword`;

export const SERVICE_BASE_URL = `${BASE_URL}/services`;
export const GET_DELETE_SERVICES = (serviceId: number[]) => `${SERVICE_BASE_URL}/${serviceId}`;
export const GET_EDIT_INVOICE_URL = (serviceId: number) => `${SERVICE_BASE_URL}/${serviceId}`;

export const JOB_BASE_URL = `${BASE_URL}/jobs`;
export const GET_DELETE_JOBS = (jobId: number[]) => `${JOB_BASE_URL}/${jobId}`;

export const ENTITY_BASE_URL = `${BASE_URL}/entities`;
export const GET_DELETE_ENTITY = (entityId: number) => `${ENTITY_BASE_URL}/${entityId}`;
export const GET_EDIT_ENTITY_URL = (entityId: number) => `${ENTITY_BASE_URL}/${entityId}`;

export const SERVICE_ITEM_TEMPLATE_BASE_URL = `${BASE_URL}/serviceitemtemplates`;
export const GET_EDIT_SERVICE_ITEM_TEMPLATE_URL = (serviceItemTemplateId: number) => `${SERVICE_ITEM_TEMPLATE_BASE_URL}/${serviceItemTemplateId}`;
export const GET_DELETE_SERVICE_ITEM_TEMPLATE = (serviceItemTemplateId: number) => `${SERVICE_ITEM_TEMPLATE_BASE_URL}/${serviceItemTemplateId}`;

export const VEHICLE_BASE_URL = `${BASE_URL}/vehicles`;
export const GET_EDIT_VEHICLE_URL = (vehicleId: number) => `${VEHICLE_BASE_URL}/${vehicleId}`;
export const GET_DELETE_VEHICLE = (vehicleId: number) => `${VEHICLE_BASE_URL}/${vehicleId}`;
export const GET_DEACTIVATE_VEHICLE_URL = (vehicleId: number) => `${VEHICLE_BASE_URL}/${vehicleId}/deactivate`;
export const GET_ACTIVATE_VEHICLE_URL = (vehicleId: number) => `${VEHICLE_BASE_URL}/${vehicleId}/activate`;
  
export const USER_BASE_URL = `${BASE_URL}/users`;
export const GET_CURRENT_USER_URL = `${USER_BASE_URL}/current`;
export const GET_ACTIVE_USERS_URL = `${USER_BASE_URL}/active`;
export const GET_EDIT_USER_URL = (userId: number) => `${USER_BASE_URL}/${userId}`;

export const GET_UNLOCK_USER_URL = (userId: number) => `${USER_BASE_URL}/${userId}/unlock`;
export const GET_DEACTIVATE_USER_URL = (userId: number) => `${USER_BASE_URL}/${userId}`;
export const GET_ACTIVATE_USER_URL = (userId: number) => `${USER_BASE_URL}/${userId}/activate`;

export const CLIENT_BASE_URL = `${BASE_URL}/clients`;
export const GET_CLIENT_BY_ID_URL = (clientId?: string) => `${CLIENT_BASE_URL}/${clientId}`;

export const ROLE_BASE_URL = `${BASE_URL}/roles`;
