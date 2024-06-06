export const ROLE_PERMISSIONS = {
  STUDENT: 1,
  COMISSION: 2,
  ADMIN: 3,
};

export const permissionControll = (userRole, requiredRole) => {
  // console.log('permissionControl', userRole, requiredRole);
  const currentRole = userRole || "STUDENT";
  const reqRole = requiredRole || "ADMIN";
  return ROLE_PERMISSIONS[currentRole] >= ROLE_PERMISSIONS[reqRole];
};
