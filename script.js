// ========================================
// 1. SELECT ELEMENTS FROM HTML
// ========================================

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");


// ========================================
// 2. CHECK SELECTED ELEMENTS
// ========================================

console.log(totalTasks);
console.log(completedTasks);
console.log(pendingTasks);
console.log(taskForm);
console.log(taskInput);
console.log(taskList);


// ========================================
// 3. UPDATE TASK SUMMARY
// ========================================

function updateTaskSummary() {

    const tasks = document.querySelectorAll(".task");

    const completed = document.querySelectorAll(".task.completed");

    totalTasks.textContent = tasks.length;

    completedTasks.textContent = completed.length;

    pendingTasks.textContent = tasks.length - completed.length;
}


// Run when page loads
updateTaskSummary();


// ========================================
// 4. CHECKBOX FUNCTIONALITY
// ========================================

const checkboxes = document.querySelectorAll(".task-checkbox");

checkboxes.forEach(function(checkbox) {

    checkbox.addEventListener("change", function() {

        const task = checkbox.closest(".task");

        if (checkbox.checked) {

            task.classList.add("completed");

        } else {

            task.classList.remove("completed");
        }

        updateTaskSummary();
    });
});


// ========================================
// 5. ADD NEW TASK
// ========================================

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }

    // Create <li>
    const li = document.createElement("li");

    // Create <article>
    const article = document.createElement("article");

    article.classList.add("task");

    // Create checkbox
    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.classList.add("task-checkbox");

    // Give checkbox a unique ID
    checkbox.id = "task-" + Date.now();

    // Create label
    const label = document.createElement("label");

    label.htmlFor = checkbox.id;
    label.textContent = taskText;

    // Create delete button
    const deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.classList.add("delete-btn");
    deleteButton.textContent = "🗑";

    deleteButton.setAttribute(
        "aria-label",
        "Delete " + taskText
    );

    // Add elements inside article
    article.appendChild(checkbox);
    article.appendChild(label);
    article.appendChild(deleteButton);

    // Add article inside li
    li.appendChild(article);

    // Add li to task list
    taskList.appendChild(li);


    // Checkbox functionality for new task
    checkbox.addEventListener("change", function() {

        if (checkbox.checked) {

            article.classList.add("completed");

        } else {

            article.classList.remove("completed");
        }

        updateTaskSummary();
    });


    // Delete functionality for new task
    deleteButton.addEventListener("click", function() {

        li.remove();

        updateTaskSummary();
    });


    // Clear input
    taskInput.value = "";

    // Update summary
    updateTaskSummary();
});


// ========================================
// 6. DELETE EXISTING TASKS
// ========================================

const deleteButtons = document.querySelectorAll(".delete-btn");

deleteButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const task = button.closest("li");

        task.remove();

        updateTaskSummary();
    });
});