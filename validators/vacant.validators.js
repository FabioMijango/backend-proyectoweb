const { body, param } = require("express-validator");
const CATEGORYS = require("../data/Categorias.json");

const validators = {};

// name, description, salary, image, esPasantia
validators.createVacantValidator = [
  param("id").optional().isMongoId().withMessage("Id must be a valid MongoId"),

  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 5 })
    .withMessage("Name must be at least 5 characters"),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 500 })
    .withMessage("Description must be less than 500 characters"),

  body("image")
    .notEmpty()
    .withMessage("Image is required")
    .isURL()
    .withMessage("Image must be a valid URL")
    .matches(/\.(jpg|jpeg|png|gif)$/)
    .withMessage("Image must be a valid URL"),

  body("salary")
    .notEmpty()
    .withMessage("Salary is required")
    .isNumeric()
    .withMessage("Salary must be a number")
    .isFloat({ min: 0, max: 1000000 })
    .withMessage("Salary must be between 0 and 1000000"),

  body("esPasantia")
    .notEmpty()
    .withMessage("EsPasantia is required")
    .isBoolean()
    .withMessage("EsPasantia must be a boolean"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .custom((value) => {
      if (!value) return true;
      if (!CATEGORYS.CATS.includes(value)) {
        throw new Error("Category must be valid");
      }
      return true;
    })
    .withMessage("Category must be valid"),

];

validators.idInParamsValidator = [
  param("id")
    .notEmpty()
    .withMessage("Id is required")
    .isMongoId()
    .withMessage("Id must be a valid MongoId"),
];

module.exports = validators;
