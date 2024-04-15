import { body } from "express-validator";
import UserRoles from "../../config/rolesList";

const schema = [
  body("userList.*.schoolNumber").exists().isString(),
  body("userList.*.email").exists().isEmail(),
  body("userList.*.name").exists().isString(),
  body("userList.*.lastName").exists().isString(),
  body("userList.*.userType")
    .exists()
    .isString()
    .isIn([UserRoles.student, UserRoles.comission, UserRoles.admin]),
];

export { schema as addMultipleUserSchema };
