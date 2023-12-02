const express = require("express");
const router = express.Router();

const authController = require("../controllers/Auth.controller");
const validateFields = require("../validators/index.middleware");
const { registerUserValidator, registerCompanyValidator } = require("../validators/auth.validators");
const { authentication, authorization } = require("../middlewares/auth.middlewares");
const ROLES = require("../data/roles.constants.json");

//Register User
router.post(
  "/register-user",
  registerUserValidator,
  validateFields,
  authController.registerUser
);


//Register Company
router.post(
  "/register-company",
  registerCompanyValidator,
  validateFields,
  authController.registerCompany
);

//Edit user profile
router.patch(
  "/edit-user-profile/:id",
  authentication,
  authorization(ROLES.USER),
  authController.editUserProfile
);

//Edit testimony
router.patch(
  "/edit-testimony/:id",
  authentication,
  authorization(ROLES.USER),
  authController.editUserTestimony
);

//Edit company profile
router.patch(
  "/edit-company-profile/:id",
  authentication,
  authorization(ROLES.COMPANY),
  authController.editCompanyProfile
);

//Login
router.post("/login", authController.login);

//Who am I?
router.get("/whoami", authentication, authController.whoAmI);

module.exports = router;
