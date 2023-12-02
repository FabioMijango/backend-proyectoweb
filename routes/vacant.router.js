const express = require("express");
const router = express.Router();
const ROLES = require("../data/roles.constants.json");

const {
  createVacantValidator,
  idInParamsValidator,
} = require("../validators/vacant.validators");

const validateFields = require("../validators/index.middleware");
const {
  authentication,
  authorization,
} = require("../middlewares/auth.middlewares");

const vacantController = require("../controllers/Vacant.controller");

//-----------------------------------------------------------------------------------------------------------

//Find all vacants
router.get("/", vacantController.findAll);

//Find all vacants that are not internships
router.get("/work", vacantController.findJustWork); 


//Find all vacants that are internships
router.get("/intership", vacantController.findJustInternship);


//Find own saved vacants
router.get(
  "/saved",
  authentication,
  authorization(ROLES.USER),
  vacantController.findSavedVacants
);

//Find own vacants
router.get(
  "/own",
  authentication,
  authorization(ROLES.COMPANY),
  vacantController.findOwn
);

//Find one vacant by id
router.get(
  "/:id",
  idInParamsValidator,
  validateFields,
  vacantController.findOneById
);

//Find interships by category
router.get(
  "/intership/category/:category",
  vacantController.findIntershipByCategory
);

//Find work by category
router.get(
  "/work/category/:category",
  vacantController.findWorkByCategory
);

//Find all vacants by user id
router.get(
  "/user/:id",
  idInParamsValidator,
  validateFields,
  vacantController.findByUserId
);

//Create or update vacant
router.post(
  ["/", "/:id"],
  authentication,
  authorization(ROLES.COMPANY),
  createVacantValidator,
  validateFields,
  vacantController.save
);

//Toggle hidden vacant
router.patch(
  "/visibility/:id",
  authentication,
  authorization(ROLES.COMPANY),
  idInParamsValidator,
  validateFields,
  vacantController.toggleHidden
);

//Apply to a vacant
router.patch(
  "/apply/:id",
  authentication,
  authorization(ROLES.USER),
  idInParamsValidator,
  validateFields,
  vacantController.applyVacant
);

//Save or post a vacant
router.patch(
  "/save/:id",
  authentication,
  authorization(ROLES.USER),
  idInParamsValidator,
  validateFields,
  vacantController.saveVacant
);

//Delete vacant
router.delete(
  "/:id",
  authentication,
  authorization(ROLES.COMPANY),
  idInParamsValidator,
  validateFields,
  vacantController.deleteById
);

module.exports = router;
