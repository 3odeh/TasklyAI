

// Function to dynamically add a subtask input field
function addSubtask() {
    const container = document.getElementById("subtasksContainer");

    const subtaskDiv = document.createElement("div");
    subtaskDiv.className = "subtask-container";

    subtaskDiv.innerHTML = `
        <input type="text" class="subtask-title" placeholder="Subtask Title" required>
        <input type="text" class="subtask-description" placeholder="Subtask Description">
        <input type="date" class="subtask-dueDate" required>
        <select class="subtask-priority">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
        </select>
        <select class="subtask-repeat">
            <option value="none">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="annually">Annually</option>
        </select>
    `;

    container.appendChild(subtaskDiv);
}
