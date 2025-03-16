const { db } = require("../config/database");
const userId = '6It6MZcP60EvHiWrEGDL';

exports.createTask = async (req, res) => {
    const { title, description, dueDate, priority, repeat, subtasks } = req.body;

    const taskRef = db.collection("users").doc(userId).collection("tasks").doc();

    await taskRef.set({
        taskId: taskRef.id,
        title,
        description,
        dueDate,
        priority,
        repeat,
        status: "pending",
        subtasks: subtasks || [],
        notes: [],
        drawings: [],
        createdAt: new Date()
    });

    res.status(201).json({ message: "Task created", taskId: taskRef.id });
};

exports.getTasks = async (req, res) => {
    const tasksSnapshot = await db.collection("users").doc(req.userId).collection("tasks").get();
    const tasks = tasksSnapshot.docs.map(doc => doc.data());
    res.json(tasks);
};
