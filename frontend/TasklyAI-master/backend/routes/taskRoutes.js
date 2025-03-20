const express = require("express");
const authMiddleware = require("../middlewares/auth");
const { createTask, getTasks } = require("../controllers/taskController");

const router = express.Router();
// router.post("/", authMiddleware, createTask);
// router.get("/", authMiddleware, getTasks);


router.post("/createTask", createTask);
router.get("/getTasks", getTasks);
module.exports = router;
