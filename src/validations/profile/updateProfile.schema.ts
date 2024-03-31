import { body } from "express-validator";

const schema = [
  body("name").optional().isString(),
  body("lastName").optional().isString(),
  body("tcNumber").optional().isString(),
  body("avatarImg").optional().isURL(),
];

export { schema as updateProfileSchema };
