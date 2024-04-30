const errorCodes = {
  // User
  INVALID_INPUT: "USR001",
  INVALID_CREDENTIALS: "USR002",
  USER_ALREADY_SIGNUP: "USR003",

  // Auth

  NOT_AUTHENTICATE: "AUTH001",
  NOT_TOKEN: "AUTH002",
  NOT_VALID_TOKEN: "AUTH003",
  NOT_VALID_REFRESH_TOKEN: "AUTH004",
  NOT_PERMISSION: "AUTH005",

  // General
  NOT_FOUND: "GNR001",

  // InternForm
  INTF_TOTAL_DAY: "INTF001",
  INTF_DUPLICATE_FORM: "INTF002",
};

export default errorCodes;
