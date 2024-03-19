import { body } from "express-validator";

const schema = [body("email").exists().isEmail(), body("password").exists()];

export { schema as signinSchema };
