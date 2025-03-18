const express = require("express");
const authMiddleware = require("../middlewares/auth");
const {getTasks,addTask, getMainTasks,updateTask,deleteTask } = require("../controllers/taskController");

const router = express.Router();
// router.post("/", authMiddleware, createTask);
// router.get("/", authMiddleware, getTasks);


router.post("/addTask", addTask);
router.get("/getTasks", getTasks);
router.get("/getMainTasks", getMainTasks);
router.put("/updateTask", updateTask);
router.delete("/deleteTask", deleteTask );

module.exports = router;
