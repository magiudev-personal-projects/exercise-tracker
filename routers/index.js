const {Router} = require("express");
const userRouter = require("./user");

const router = Router();

router.use("/users", userRouter);

module.exports = router;