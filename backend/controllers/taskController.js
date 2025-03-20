const { db } = require("../config/database");
const userId = '6It6MZcP60EvHiWrEGDL';



exports.getMainTasks = async (req, res) => {
    try {
        // const userId = req.userId; // Ensure userId is coming from authentication middleware
        // if (!userId) {
        //     return res.status(400).json({ message: "User ID is missing from request." });
        // }

        const tasksRef = db.collection("users").doc(userId).collection("tasks");
        const tasksSnapshot = await tasksRef.get();

        if (tasksSnapshot.empty) {
            return res.status(200).json({ message: "No tasks found", tasks: [] });
        }

        const tasks = await Promise.all(
            tasksSnapshot.docs.map(async (taskDoc) => {
                const taskData = taskDoc.data();
                const taskRef = taskDoc.ref;

                // Check if "subtasks" collection exists for this task
                const collections = await taskRef.listCollections();
                const hasSubtasks = collections.some(col => col.id === "subtasks");

                let subtasks = [];
                if (hasSubtasks) {
                    const subtasksSnapshot = await taskRef.collection("subtasks").get();
                    subtasks = subtasksSnapshot.docs.map(subtaskDoc => subtaskDoc.data());
                }

                return { ...taskData, subtasks };
            })
        );

        res.json({ tasks });

    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getTasks = async (req, res) => {
    try {
        // const userId = req.userId;
        // if (!userId) {
        //     return res.status(400).json({ message: "User ID is missing from request." });
        // }

        // Fetch all tasks for the user
        const tasksCollection = db.collection("users").doc(userId).collection("tasks");
        const taskSnapshot = await tasksCollection.get();   
        let tasks = [];
        for (const taskDoc of taskSnapshot.docs) {
            const taskData = taskDoc.data();
            taskData.taskId = taskDoc.id;
            taskData.subtasks = await fetchSubtasks(tasksCollection, taskDoc.id);
            tasks.push(taskData);
        }

        res.json({ tasks: tasks });

    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
  // Function to fetch subtasks recursively
async function fetchSubtasks(parentCollection, parentId) {
    const subtasksCollection = parentCollection.doc(parentId).collection("subtasks");
    const subtaskSnapshot = await subtasksCollection.get();

    let subtasks = [];
    for (const subtaskDoc of subtaskSnapshot.docs) {
        const subtaskData = subtaskDoc.data();
        subtaskData.subtaskId = subtaskDoc.id;
        subtaskData.subtasks = await fetchSubtasks(subtasksCollection, subtaskDoc.id);
        subtasks.push(subtaskData);
    }

    return subtasks;
}


exports.addTask = async (req, res) => {
    try {
        // const userId = req.userId;
        // if (!userId) {
        //     return res.status(400).json({ message: "User ID is missing from request." });
        // }

        const { path, taskData } = req.body;

        if (!taskData || !taskData.title) {
            return res.status(400).json({ message: "Invalid task data. Title is required." });
        }

        // Get reference to the correct location (tasks or nested subtasks)
        let taskRef = db.collection("users").doc(userId).collection("tasks");

        for (let i = 0; i < path.length; i++) {
            taskRef = taskRef.doc(path[i]).collection("subtasks");
        }

        // Add the new task/subtask
        const newTaskRef = await taskRef.add({
            title: taskData.title,
            description: taskData.description || "",
            dueDate: taskData.dueDate || "",
            priority: taskData.priority || "low",
            repeat: taskData.repeat || "none",
            status: taskData.status || "pending",
            createdAt: new Date(),
            notes: taskData.notes || [],
            drawings: taskData.drawings || [],
        });

        // Handle nested subtasks recursively if provided
        if (taskData.subtasks) {
            await addSubtasks(newTaskRef.collection("subtasks"), taskData.subtasks);
        }

        res.json({ message: "Task added successfully!", taskId: newTaskRef.id });

    } catch (error) {
        console.error("Error adding task:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Function to add subtasks recursively
async function addSubtasks(subtasksCollection, subtasks) {
    if (!subtasks || subtasks.length === 0) return;

    for (const subtask of subtasks) {
        const subtaskRef = await subtasksCollection.add({
            title: subtask.title,
            description: subtask.description || "",
            dueDate: subtask.dueDate || "",
            priority: subtask.priority || "low",
            repeat: subtask.repeat || "none",
            status: subtask.status || "pending",
            createdAt: new Date(),
            notes: subtask.notes || [],
            drawings: subtask.drawings || [],
        });

        // Recursively add nested subtasks
        if (subtask.subtasks) {
            await addSubtasks(subtaskRef.collection("subtasks"), subtask.subtasks);
        }
    }
}


exports.updateTask = async (req, res) => {
    try {
        // const userId = req.userId;
        // if (!userId) {
        //     return res.status(400).json({ message: "User ID is missing from request." });
        // }

        const { path, updateData } = req.body;

        if (!Array.isArray(path) || path.length === 0 || !updateData) {
            return res.status(400).json({ message: "Invalid request. Provide a valid task path and update data." });
        }

        // Get reference to the specific task/subtask
        let taskRef = db.collection("users").doc(userId).collection("tasks");
        for (let i = 0; i < path.length -1; i++) {
            taskRef = taskRef.doc(path[i]).collection("subtasks");
        }
        taskRef = taskRef.doc(path[path.length -1]);
        const taskSnapshot = await taskRef.get();
        if (!taskSnapshot.exists) {
            return res.status(404).json({ message: "Task not found." });
        }

        // Update the specific task/subtask
        await taskRef.update({
            ...updateData,
        });

        res.json({ message: "Task updated successfully!" });

    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


exports.deleteTask = async (req, res) => {
    try {
        // const userId = req.userId;
        // if (!userId) {
        //     return res.status(400).json({ message: "User ID is missing from request." });
        // }

        const { path } = req.body;

        if (!Array.isArray(path) || path.length === 0) {
            return res.status(400).json({ message: "Invalid request. Provide a valid task path." });
        }

        // Get reference to the specific task/subtask
        let taskRef = db.collection("users").doc(userId).collection("tasks");
        for (let i = 0; i < path.length -1; i++) {
            taskRef = taskRef.doc(path[i]).collection("subtasks");
        }
        taskRef = taskRef.doc(path[path.length -1]);
        const taskSnapshot = await taskRef.get();
        if (!taskSnapshot.exists) {
            return res.status(404).json({ message: "Task not found." });
        }
        
        // Delete all nested subtasks first
        await deleteSubtasks(taskRef.collection("subtasks"));

        // Delete the specific task/subtask
        await taskRef.delete();

        res.json({ message: "Task deleted successfully!" });

    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Function to delete all subtasks recursively
async function deleteSubtasks(subtasksCollection) {
    const subtaskSnapshot = await subtasksCollection.get();

    for (const subtaskDoc of subtaskSnapshot.docs) {
        const nestedSubtasksCollection = subtaskDoc.ref.collection("subtasks");

        // Recursively delete all nested subtasks first
        await deleteSubtasks(nestedSubtasksCollection);

        // Delete the subtask document
        await subtaskDoc.ref.delete();
    }
}

