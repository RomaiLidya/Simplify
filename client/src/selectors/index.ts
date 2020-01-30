export const isUserAuthenticated = (currentUser?: CurrentUser): boolean => {
  return currentUser ? true : false;
};

export const getCurrentUserDisplayName = (currentUser?: CurrentUser): string => {
  return currentUser ? currentUser.displayName : '';
};

export const getCurrentUserAvatarName = (currentUser?: CurrentUser): string => {
  return currentUser ? currentUser.displayName[0].toUpperCase() : '';
};

export const getCurrentCompanyName = (currentUser?: CurrentUser): string => {
  return currentUser ? currentUser.tenant : '';
};

export const getCurrentUserId = (currentUser?: CurrentUser): number => {
  return currentUser ? currentUser.id : 0;
};
