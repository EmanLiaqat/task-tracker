
// SELECT HTML ELEMENTS (TASKS)
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const filterButtons = document.querySelectorAll(".filter-btn");

// UPDATE TASK COUNTERS

function updateTaskCounts() {

    const tasks = taskList.querySelectorAll(".task");
    const total = tasks.length;

    const completed = taskList.querySelectorAll(
        ".task.completed"
    ).length;

    const pending = total - completed;

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;
}
// ADD NEW TASK

taskForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }

    const li = document.createElement("li");

    const article = document.createElement("article");
    article.className = "task";

    const taskLeft = document.createElement("div");
    taskLeft.className = "task-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";

    const taskId = "task-" + Date.now();
    checkbox.id = taskId;

    const label = document.createElement("label");
    label.htmlFor = taskId;
    label.textContent = taskText;

    taskLeft.appendChild(checkbox);
    taskLeft.appendChild(label);

    // Buttons
    const taskActions = document.createElement("div");
    taskActions.className = "task-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "edit-btn";
    editButton.innerHTML = '<i class="fas fa-pen"></i> Edit';

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.innerHTML = '<i class="fas fa-trash"></i> Delete';

    taskActions.appendChild(editButton);
    taskActions.appendChild(deleteButton);

    // Build task
    article.appendChild(taskLeft);
    article.appendChild(taskActions);
    li.appendChild(article);
    taskList.appendChild(li);

    taskInput.value = "";

    updateTaskCounts();
    applyFilter();
});

// CHECKBOX - COMPLETE TASK

taskList.addEventListener("change", function (event) {

    if (event.target.classList.contains("task-checkbox")) {

        const checkbox = event.target;
        const task = checkbox.closest(".task");

        if (checkbox.checked) {
            task.classList.add("completed");
        } else {
            task.classList.remove("completed");
        }

        updateTaskCounts();
        applyFilter();
    }
});

// EDIT + DELETE

taskList.addEventListener("click", function (event) {

    const target = event.target.closest("button");

    if (!target) return;

    // EDIT
    if (target.classList.contains("edit-btn")) {

        const task = target.closest(".task");
        const label = task.querySelector("label");
        const currentText = label.textContent;

        const newText = prompt("Edit your task:", currentText);

        if (newText !== null && newText.trim() !== "") {
            label.textContent = newText.trim();
        }
    }

    // DELETE
    if (target.classList.contains("delete-btn")) {

        const task = target.closest(".task");
        const li = task.closest("li");

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

// FILTER BUTTONS

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        filterButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        applyFilter();
    });
});

// APPLY FILTER


function applyFilter() {

    const activeButton = document.querySelector(".filter-btn.active");

    if (!activeButton) return;

    const filter = activeButton.dataset.filter;

    const listItems = taskList.querySelectorAll("li");

    listItems.forEach(function (li) {

        const task = li.querySelector(".task");
        if (!task) return;

        const isCompleted = task.classList.contains("completed");

        if (filter === "all") {
            li.style.display = "";
        } else if (filter === "completed") {
            li.style.display = isCompleted ? "" : "none";
        } else if (filter === "pending") {
            li.style.display = !isCompleted ? "" : "none";
        }
    });
}


// ===============================
// INITIAL COUNTS
// ===============================

updateTaskCounts();

// DAILY MOTIVATION API


const quote = document.getElementById("quote");
const refreshQuote = document.getElementById("refreshQuote");

async function getQuote() {

    try {

        quote.textContent = "Loading new quote...";

        const response = await fetch(
            "https://dummyjson.com/quotes/random"
        );

        if (!response.ok) {
            throw new Error("Failed to fetch quote");
        }

        const data = await response.json();

        quote.textContent = `"${data.quote}" — ${data.author}`;

    } catch (error) {

        console.log("Error:", error);

        quote.textContent =
            "Small steps every day lead to big results. Keep going!";
    }
}

getQuote();

refreshQuote.addEventListener("click", function () {
    getQuote();
});

// WEATHER API (Open-Meteo) - Searchable

const cityInput = document.getElementById("cityInput");
const citySuggestions = document.getElementById("citySuggestions");
const searchWeatherBtn = document.getElementById("searchWeatherBtn");

const weatherCityDisplay = document.getElementById("weatherCityDisplay");
const weatherTemp = document.getElementById("weatherTemp");
const weatherCondition = document.getElementById("weatherCondition");
const weatherIcon = document.getElementById("weatherIcon");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");


// Map WMO weather codes → text + FontAwesome icon
function getWeatherInfo(code) {
    const map = {
        0: { text: "Clear Sky", icon: "fa-sun" },
        1: { text: "Mainly Clear", icon: "fa-sun" },
        2: { text: "Partly Cloudy", icon: "fa-cloud-sun" },
        3: { text: "Overcast", icon: "fa-cloud" },
        45: { text: "Foggy", icon: "fa-smog" },
        48: { text: "Rime Fog", icon: "fa-smog" },
        51: { text: "Light Drizzle", icon: "fa-cloud-rain" },
        53: { text: "Drizzle", icon: "fa-cloud-rain" },
        55: { text: "Dense Drizzle", icon: "fa-cloud-rain" },
        61: { text: "Light Rain", icon: "fa-cloud-rain" },
        63: { text: "Rain", icon: "fa-cloud-showers-heavy" },
        65: { text: "Heavy Rain", icon: "fa-cloud-showers-heavy" },
        71: { text: "Light Snow", icon: "fa-snowflake" },
        73: { text: "Snow", icon: "fa-snowflake" },
        75: { text: "Heavy Snow", icon: "fa-snowflake" },
        80: { text: "Rain Showers", icon: "fa-cloud-showers-heavy" },
        81: { text: "Rain Showers", icon: "fa-cloud-showers-heavy" },
        82: { text: "Violent Showers", icon: "fa-cloud-bolt" },
        95: { text: "Thunderstorm", icon: "fa-cloud-bolt" },
        96: { text: "Thunderstorm", icon: "fa-cloud-bolt" },
        99: { text: "Thunderstorm", icon: "fa-cloud-bolt" }
    };
    return map[code] || { text: "Unknown", icon: "fa-cloud" };
}


// Fetch and display weather for a city
async function getWeather(city) {

    if (!city || city.trim() === "") return;

    try {

        // Loading state
        weatherCondition.textContent = "Loading...";
        weatherTemp.textContent = "--°C";
        weatherCityDisplay.textContent = city;
        humidity.textContent = "--%";
        wind.textContent = "-- km/h";
        feelsLike.textContent = "--°";

        // Geocode city name → coordinates
        const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!geoRes.ok) throw new Error("Geocoding failed");

        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found");
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        weatherCityDisplay.textContent = country ? `${name}, ${country}` : name;

        // Fetch current weather
        const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`
        );

        if (!weatherRes.ok) throw new Error("Weather fetch failed");

        const weatherData = await weatherRes.json();
        const current = weatherData.current;

        const info = getWeatherInfo(current.weather_code);

        // Update UI
        weatherTemp.textContent = `${Math.round(current.temperature_2m)}°C`;
        weatherCondition.textContent = info.text;
        weatherIcon.className = `fas ${info.icon}`;
        humidity.textContent = `${current.relative_humidity_2m}%`;
        wind.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
        feelsLike.textContent = `${Math.round(current.apparent_temperature)}°`;

    } catch (error) {

        console.log("Weather error:", error);

        weatherCondition.textContent = "City not found";
        weatherTemp.textContent = "--°C";
        humidity.textContent = "--%";
        wind.textContent = "-- km/h";
        feelsLike.textContent = "--°";
        weatherIcon.className = "fas fa-cloud";
    }
}
// CITY SUGGESTIONS (autocomplete)

let suggestTimer = null;

function showSuggestions(list) {

    citySuggestions.innerHTML = "";

    if (!list || list.length === 0) {
        citySuggestions.innerHTML =
            '<li class="empty">No cities found</li>';
        citySuggestions.classList.add("show");
        return;
    }

    list.forEach(function (city) {
        const li = document.createElement("li");
        li.setAttribute("role", "option");

        const label = city.admin1
            ? `${city.name}, ${city.admin1}`
            : city.name;

        li.innerHTML = `${label} <span class="country">${city.country || ""}</span>`;

        li.addEventListener("click", function () {
            cityInput.value = city.name;
            citySuggestions.classList.remove("show");
            getWeather(city.name);
        });

        citySuggestions.appendChild(li);
    });

    citySuggestions.classList.add("show");
}


async function fetchCitySuggestions(query) {

    if (!query || query.trim().length < 2) {
        citySuggestions.classList.remove("show");
        return;
    }

    citySuggestions.innerHTML =
        '<li class="loading">Searching...</li>';
    citySuggestions.classList.add("show");

    try {

        const res = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`
        );

        if (!res.ok) throw new Error("Suggestion fetch failed");

        const data = await res.json();

        showSuggestions(data.results || []);

    } catch (err) {

        console.log("Suggestion error:", err);

        citySuggestions.innerHTML =
            '<li class="empty">Error loading cities</li>';
    }
}


// Debounced input
cityInput.addEventListener("input", function () {

    clearTimeout(suggestTimer);

    const value = cityInput.value.trim();

    suggestTimer = setTimeout(function () {
        fetchCitySuggestions(value);
    }, 300);
});


// Enter key → get weather
cityInput.addEventListener("keydown", function (e) {

    if (e.key === "Enter") {

        e.preventDefault();

        citySuggestions.classList.remove("show");

        getWeather(cityInput.value.trim());
    }
});


// Search button
searchWeatherBtn.addEventListener("click", function () {

    citySuggestions.classList.remove("show");

    getWeather(cityInput.value.trim());
});


// Hide suggestions on outside click
document.addEventListener("click", function (e) {

    if (!e.target.closest(".weather-search")) {
        citySuggestions.classList.remove("show");
    }
});


// Initial load — default city
getWeather("Lahore");