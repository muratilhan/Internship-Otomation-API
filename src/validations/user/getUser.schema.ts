import { param } from "express-validator";

const schema = [param("name").optional().isString()];

export { schema as updateProfileSchema };
