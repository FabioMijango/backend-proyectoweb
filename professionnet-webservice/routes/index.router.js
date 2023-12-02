const express = require("express");
const router = express.Router();

const vacantRouter = require("./vacant.router");
const authRouter = require("./auth.router");

router.use("/vacant", vacantRouter);
router.use("/auth", authRouter);

module.exports = router;
