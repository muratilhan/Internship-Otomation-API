import errorCodes from "../enums/errorCodes";
import { AuthorizationError } from "../errors/AuthorizationError";
import { permissionControll } from "../handlers/permission.handler";

export const verifyRoles = (requiredRole) => {
  return (req, res, next) => {
    try {
      if (!req?.roles) {
        throw new AuthorizationError(errorCodes.NOT_PERMISSION);
      }

      const result = permissionControll(req.roles, requiredRole);

      if (!result) {
        throw new AuthorizationError(errorCodes.NOT_PERMISSION);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
