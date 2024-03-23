import { body } from "express-validator";

const schema = [body("email").exists().isEmail()];

export { schema as passwordResetSchema };
