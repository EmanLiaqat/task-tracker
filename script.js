// ===============================
// SELECT HTML ELEMENTS
// ===============================

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const filterButtons = document.querySelectorAll(".filter-btn");


// ===============================
// UPDATE TASK COUNTERS
// ===============================

function updateTaskCounts() {

    // Get all tasks
    const tasks = taskList.querySelectorAll(".task");

    // Count total
    const total = tasks.length;

    // Count completed
    const completed = taskList.querySelectorAll(
        ".task.completed"
    ).length;

    // Pending = total - completed
    const pending = total - completed;


    // Display values
    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;
}


// ===============================
// ADD NEW TASK
// ===============================

taskForm.addEventListener("submit", function(event) {

    // Prevent page refresh
    event.preventDefault();


    // Get input value
    const taskText = taskInput.value.trim();


    // Don't add empty task
    if (taskText === "") {
        return;
    }


    // Create <li>
    const li = document.createElement("li");


    // Create task article
    const article = document.createElement("article");

    article.className = "task";


    // Create left side
    const taskLeft = document.createElement("div");

    taskLeft.className = "task-left";


    // Create checkbox
    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";

    checkbox.className = "task-checkbox";


    // Create unique ID
    const taskId = "task-" + Date.now();

    checkbox.id = taskId;


    // Create label
    const label = document.createElement("label");

    label.htmlFor = taskId;

    label.textContent = taskText;


    // Put checkbox + label inside left side
    taskLeft.appendChild(checkbox);

    taskLeft.appendChild(label);


    // ===============================
    // CREATE BUTTONS
    // ===============================

    const taskActions = document.createElement("div");

    taskActions.className = "task-actions";


    // Edit button
    const editButton = document.createElement("button");

    editButton.type = "button";

    editButton.className = "edit-btn";

    editButton.textContent = "✎ Edit";


    // Delete button
    const deleteButton = document.createElement("button");

    deleteButton.type = "button";

    deleteButton.className = "delete-btn";

    deleteButton.textContent = "Delete";


    // Put buttons inside actions
    taskActions.appendChild(editButton);

    taskActions.appendChild(deleteButton);


    // ===============================
    // BUILD TASK
    // ===============================

    article.appendChild(taskLeft);

    article.appendChild(taskActions);

    li.appendChild(article);

    taskList.appendChild(li);


    // Clear input
    taskInput.value = "";


    // Update counters
    updateTaskCounts();
});


// ===============================
// CHECKBOX - COMPLETE TASK
// ===============================

taskList.addEventListener("change", function(event) {

    // Check if changed element is a checkbox
    if (event.target.classList.contains("task-checkbox")) {

        const checkbox = event.target;

        const task = checkbox.closest(".task");


        if (checkbox.checked) {

            // Mark completed
            task.classList.add("completed");

        } else {

            // Mark pending
            task.classList.remove("completed");
        }


        // Update numbers
        updateTaskCounts();


        // Re-apply current filter
        applyFilter();
    }
});


// ===============================
// EDIT + DELETE
// ===============================

taskList.addEventListener("click", function(event) {

    // ===========================
    // EDIT
    // ===========================

    if (event.target.classList.contains("edit-btn")) {

        const task = event.target.closest(".task");

        const label = task.querySelector("label");


        // Current task text
        const currentText = label.textContent;


        // Ask user for new text
        const newText = prompt(
            "Edit your task:",
            currentText
        );


        // If user entered something
        if (newText !== null && newText.trim() !== "") {

            label.textContent = newText.trim();
        }
    }


    // ===========================
    // DELETE
    // ===========================

    if (event.target.classList.contains("delete-btn")) {

        const task = event.target.closest(".task");

        const li = task.closest("li");


        // Confirm before deleting
        const confirmDelete = confirm(
            "Are you sure you want to delete this task?"
        );


        if (confirmDelete) {

            li.remove();

            updateTaskCounts();

            applyFilter();
        }
    }
});


// ===============================
// FILTER BUTTONS
// ===============================

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        // Remove active class from all buttons
        filterButtons.forEach(function(btn) {

            btn.classList.remove("active");

        });


        // Add active class to clicked button
        button.classList.add("active");


        // Apply selected filter
        applyFilter();
    });
});


// ===============================
// APPLY FILTER
// ===============================

function applyFilter() {

    // Find active filter
    const activeButton = document.querySelector(
        ".filter-btn.active"
    );


    if (!activeButton) {
        return;
    }


    const filter = activeButton.dataset.filter;


    // Get all list items
    const listItems = taskList.querySelectorAll("li");


    listItems.forEach(function(li) {

        const task = li.querySelector(".task");

        const isCompleted = task.classList.contains(
            "completed"
        );


        // =========================
        // ALL
        // =========================

        if (filter === "all") {

            li.style.display = "";
        }


        // =========================
        // COMPLETED
        // =========================

        else if (filter === "completed") {

            if (isCompleted) {

                li.style.display = "";

            } else {

                li.style.display = "none";
            }
        }


        // =========================
        // PENDING
        // =========================

        else if (filter === "pending") {

            if (!isCompleted) {

                li.style.display = "";

            } else {

                li.style.display = "none";
            }
        }

    });
}


// ===============================
// INITIAL COUNTS
// ===============================

updateTaskCounts();

// ===============================
// DAILY MOTIVATION API
// ===============================

const quote = document.getElementById("quote");

const refreshQuote = document.getElementById("refreshQuote");


async function getQuote() {

    try {

        // Show loading message
        quote.textContent = "Loading new quote...";

        // Call API
        const response = await fetch(
            "https://dummyjson.com/quotes/random"
        );


        // Check if request was successful
        if (!response.ok) {

            throw new Error("Failed to fetch quote");
        }


        // Convert JSON response
        // into JavaScript object
        const data = await response.json();


        // Display new quote
        quote.textContent =
            `"${data.quote}" — ${data.author}`;


    } catch (error) {

        console.log("Error:", error);

        quote.textContent =
            "Small steps every day lead to big results. Keep going!";
    }
}


// Get quote when page first opens
getQuote();


// Get a new quote when refresh button is clicked
refreshQuote.addEventListener("click", function() {

    getQuote();

});