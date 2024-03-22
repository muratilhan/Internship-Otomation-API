import { body } from "express-validator";

const schema = [body("password").exists().isString()];

export { schema as changePasswordSchema };
