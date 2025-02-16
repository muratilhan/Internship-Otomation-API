const errorCodes = {
  // User
  INVALID_CREDENTIALS: "USR001",
  USER_ALREADY_SIGNUP: "USR002",
  INVALID_EMAIL: "USR003",

  // Auth

  NOT_AUTHENTICATE: "AUTH001",
  NOT_TOKEN: "AUTH002",
  NOT_VALID_TOKEN: "AUTH003",
  NOT_VALID_REFRESH_TOKEN: "AUTH004",
  NOT_PERMISSION: "AUTH005",
  EMAIL_NOT_FOUND: "AUTH006",
  NOT_VALID_LINK: "AUTH007",

  // General
  NOT_FOUND: "GNR001",
  UNEXPECTED: "000000", // 500
  INVALID_INPUT: "GNR002",

  // InternForm
  INTF_TOTAL_DAY: "INTF001",
  INTF_DUPLICATE_FORM: "INTF002",
  INTF_RES_DATE: "INTF003",
  INTF_FOLLOW_UP: "INTF004",

  // Confidental Report
  CR_DUPLICATE_MAIL: "CR001",
  CR_MAIL_SENDED: "CR002",
  CR_DUPLICATE_TOKEN: "CR003",

  // Survey
  SUR_DUPLICATE: "SUR001",

  // Interview

  INV_DUPLICATE: "INV001",

  // InternShip Panel
  INP_FOLLOW_UP_DUPLICATE: "INP001",
};

export default errorCodes;
