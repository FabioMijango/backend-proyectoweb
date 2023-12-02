const { body, param } = require("express-validator");
const debug = require("debug")("app:validators-auth");

const validators = {};

// username, email, telephone, address

validators.registerUserValidator = [
  body("firstName")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters")
    .custom((value) => {
      if (/[^a-zA-Z0-9\s]/.test(value)) {
        throw new Error("Username must not contain special characters");
      }
      return true;
    }),

  body("lastName")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters")
    .custom((value) => {
      if (/[^a-zA-Z0-9\s]/.test(value)) {
        throw new Error("Username must not contain special characters");
      }
      return true;
    }),

  body("department")
    .notEmpty()
    .withMessage("Department is required")
    .isString()
    .withMessage("Department must be a string"),

  body("municipality")
    .notEmpty()
    .withMessage("Municipality is required")
    .isString()
    .withMessage("Municipality must be a string"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email"),

  body("telephone")
    .notEmpty()
    .withMessage("Telephone is required")
    .isMobilePhone()
    .withMessage("Telephone must be a valid telephone"),

  body("birthDate")
    .notEmpty()
    .withMessage("Birthdate is required")
    .matches(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-(19|20)\d\d$/)
    .withMessage("Date must be in the format DD-MM-YYYY"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/)
    .withMessage("Password must contain only letters and numbers")
    .isLength({ min: 8, max: 32 })
    .withMessage("Password must be between 8 and 32 characters"),

  // body("habilities.*.value")
  //   .isInt({ min: 0, max: 100 })
  //   .withMessage("Hability value must be an integer between 0 and 100"),

  // body("competences.*.value")
  //   .isInt({ min: 0, max: 100 })
  //   .withMessage('Competence value must be an integer between 0 and 100'),

  // body("caracteristics.*.value")
  //   .isInt({ min: 0, max: 100 })
  //   .withMessage('Characteristic value must be an integer between 0 and 100')

  body("habilities.*.name").notEmpty().withMessage('Name is required'),
  body("habilities.*.value").isInt({ min: 0, max: 100 }).withMessage('Value should be an integer between 0 and 100'),
  body("competences.*.name").notEmpty().withMessage('Competence name is required'),
  body("competences.*.value").isInt({ min: 0, max: 100 }).withMessage('Competence value must be an integer between 0 and 100'),
  body("caracteristics.*.name").notEmpty().withMessage('Characteristic name is required'),
  body("caracteristics.*.value").isInt({ min: 0, max: 100 }).withMessage('Characteristic value must be an integer between 0 and 100')
];

// companyName, email, ruc, telephone, address, password, roles

validators.registerCompanyValidator = [
  body("companyName")
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Company name must be between 3 and 20 characters")
    .custom((value) => {
      if (/[^a-zA-Z0-9\s]/.test(value)) {
        throw new Error("Company name must not contain special characters");
      }
      return true;
    }),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email"),

  body("ruc")
    .notEmpty()
    .withMessage("RUC is required")
    .isNumeric()
    .withMessage("RUC must be a valid RUC - only numbers"),

  body("telephone")
    .notEmpty()
    .withMessage("Telephone is required")
    .isMobilePhone()
    .withMessage("Telephone must be a valid telephone"),

  body("department")
    .notEmpty()
    .withMessage("Department is required")
    .isString()
    .withMessage("Department must be a string"),

  body("municipality")
    .notEmpty()
    .withMessage("Municipality is required")
    .isString()
    .withMessage("Municipality must be a string"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/)
    .withMessage("Password must contain only letters and numbers")
    .isLength({ min: 8, max: 32 })
    .withMessage("Password must be between 8 and 32 characters"),
];

module.exports = validators;
