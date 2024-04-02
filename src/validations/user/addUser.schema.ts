import { body } from "express-validator";
import UserRoles from "../../config/rolesList";

const schema = [
  body("studentId").exists().isString(),
  body("email").exists().isEmail(),
  body("name").exists().isString(),
  body("lastName").exists().isString(),
  body("userType")
    .exists()
    .isString()
    .isIn([UserRoles.student, UserRoles.comission, UserRoles.admin]),
];

export { schema as addUserSchema };
