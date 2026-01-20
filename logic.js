// --- 1. STATE (The Data) ---
let player = {
    hp: 100,
    maxHp: 100,      // Needed so we know how much to heal on Level Up
    xp: 0,
    xpToNextLevel: 100, // Starting goal
    lvl: 1,
    coins: 0         // New Economy system
};

let tasks = [
    { id: 1, title: "Submit Assignment", deadline: "2023-01-01", status: "pending" }, // Past Date
    { id: 2, title: "Gym", deadline: "2030-01-01", status: "pending" } // Future Date
];


function runGameLoop() {
    console.log("Checking deadlines..."); // Debugging check

    tasks.forEach(task => {
        let deadlineDate = new Date(task.deadline);
        let now = Date.now();

        // If time is up AND task is still pending
        if (now > deadlineDate && task.status === "pending") {

            console.log(`You missed the deadline for: ${task.title}`);
            takeDamage(20); // Ouch

            // Mark as missed so we don't take damage again next time
            task.status = "missed";
        }
    });

    // Update screen again to show the task is now "missed" (red line)
    updateScreen();
}




// --- 2. GAME LOGIC ---

function takeDamage(amount) {
    player.hp -= amount;

    // Check for death
    if (player.hp <= 0) {
        player.hp = 0;
        alert("💀 GAME OVER! YOU DIED.");
    }

    // IMPORTANT: Data changed, so we must update the screen
    updateScreen();
}



// --- 3. DOM MANIPULATION (The Bridge) ---

function updateScreen() {
    // A. Update HP Text
    const hpSpan = document.getElementById('hp-display');
    hpSpan.innerText = player.hp;

    // Visual Feedback: Turn red if low HP
    if (player.hp <= 50) {
        hpSpan.style.color = "red";
    } else {
        hpSpan.style.color = "green";
    }

    // B. Update Task List
    const listDiv = document.getElementById('task-list');
    listDiv.innerHTML = ""; // Clear the list to prevent duplicates

    tasks.forEach(task => {
        let style = "";
        let buttonHTML = "";

        if (task.status === "missed") {
            style = "color: red; text-decoration: line-through;";
            buttonHTML = "❌"; // Can't complete a failed task
        } else if (task.status === "done") {
            style = "color: grey; text-decoration: line-through;";
            buttonHTML = "✅"; // Already done
        } else {
            // If pending, show a button that calls completeTask(id)
            buttonHTML = `<button onclick="completeTask(${task.id})">Complete</button>`;
        }

        // Add the task text + the button
        listDiv.innerHTML += `
            <div style="margin: 10px 0; ${style}">
                ${task.title} (Due: ${task.deadline}) 
                ${buttonHTML}
            </div>`;
    });
}

// --- 4. INITIALIZATION ---
// Run this once when page loads to show the starting data
updateScreen();


function addTask() {
    // 1. Get the text from the inputs
    let titleInput = document.getElementById("task-title");
    let dateInput = document.getElementById("task-date");

    let title = titleInput.value;
    let deadline = dateInput.value;

    // 2. Validation: If title is empty, stop here
    if (title === "") {
        alert("You need a quest name, traveler!");
        return;
    }

    // 3. Create the new task object
    // YOU WRITE THIS PART:
    // make an object with id (use Date.now()), title, deadline, and status: "pending"
    let newTask = {
        id: Date.now(),
        title: title,
        deadline: deadline,
        status: "pending",
    };

    // 4. Add to array
    // YOU WRITE THIS PART:
    // tasks.push(......)
    tasks.push(newTask);

    // 5. Cleanup
    titleInput.value = ""; // Clear the box
    updateScreen(); // Show the new task
}


function completeTask(id) {
    // STEP 1: Find the task in the array that matches the ID passed in
    // HINT: Use the .find() method: tasks.find(t => t.id === id)
    let task = tasks.find(t => t.id === id);

    // STEP 2: Safety Check (Only if task exists and is pending)
    if (task && task.status === "pending") {

        // STEP 3: Change the status to 'done'
        task.status = "done";

        // STEP 4: Reward the player
        player.xp += 20;
        player.hp += 10;
        console.log("Quest Complete!");

        if (player.hp > 100) {
            player.hp = 100;
        }

        // STEP 5: Update the screen to show the new status
        updateScreen();
    }
}