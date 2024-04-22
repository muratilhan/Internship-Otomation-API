export const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(403);
    const rolesArray = [...allowedRoles];

    const result = rolesArray.map((role) => role === req.roles);
    if (!result) return res.sendStatus(403);
    next();
  };
};
