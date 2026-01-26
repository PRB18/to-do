// --- 1. STATE (The Data) ---
// Minor change for commit 1
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

let currentFilter = "pending";


function runGameLoop() {
    console.log("Checking deadlines..."); // Debugging check
    // Minor change for commit 2

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
//2. IF player.hp is LESS THAN OR EQUAL TO 0:
// Minor change for commit 3
function takeDamage(amount) {
    player.hp -= amount;

    // Check for death
    if (player.hp <= 0) {
        //a. Alert: "You died! Level Down & Coin Penalty applied."
        alert("💀 You died! Level Down & Coin Penalty applied.");

        /*b. PUNISHMENT 1 (Level Down): 
           Subtract 1 from player.lvl.
           IF level goes below 1, reset it to 1 (No level 0).*/
        player.lvl--;
        if (player.lvl < 1) {
            player.lvl = 1;
        }

        /*c. PUNISHMENT 2 (Wallet Hit): 
           Set player.coins equal to player.coins * 0.5. (Lose half money).
           Use Math.floor() to keep it clean.*/
        player.coins = Math.floor(player.coins * 0.5);


        /*d. PUNISHMENT 3 (Respawn Weak): 
           Set player.hp to 20. */
        player.hp = 20;
    }

    //3. CALL updateScreen().
    // IMPORTANT: Data changed, so we must update the screen
    updateScreen();

}



// --- 3. DOM MANIPULATION (The Bridge) ---

function updateScreen() {



    //save data each time there is a change in the screen
    saveData();


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


    //To filter the tasks list accordig to the currentFilter
    //only the filtered tasks will be present in the filteredTasks
    let filteredTasks = tasks.filter(task => {
        //to only show the pending tasks
        if (currentFilter === "pending") {
            return task.status === "pending";
        }
        //to show all the tasks which are not pending
        else {
            return task.status !== "pending";
        }
    })

    filteredTasks.forEach(task => {

        let style = "";
        let statusBtn = ""; // Renamed for clarity (was buttonHTML)
        let editBtn = "";
        let extdlbtn = "";

        // 1. Determine Status & Style
        if (task.status === "missed") {
            style = "color: #ef4444; text-decoration: line-through;";
            statusBtn = "❌";
        } else if (task.status === "done") {
            style = "color: #888; text-decoration: line-through;";
            statusBtn = "✅";
        } else {
            style = "color: white;";
            statusBtn = `<button onclick="completeTask(${task.id})">Complete</button>`;
            editBtn = `<button onclick="editTask(${task.id})" style="margin-left:5px;">✏️</button>`;
            extdlbtn = `<button onclick="extendDeadline(${task.id},${100})" style="margin-left:5px;">📅</button>`
        }

        // 2. The Delete Button (Always available)
        // Notice: NO 's' at the end of deleteTask
        let deleteBtn = `<button onclick="deleteTasks(${task.id})" style="margin-left:5px;">🗑️</button>`;

        // 3. Render
        // NOTICE: style="${style}" (Quotes added)
        // NOTICE: I put the text in a <span> so the buttons don't get crossed out
        listDiv.innerHTML += `
        <div style="margin: 10px 0; display: flex; justify-content: space-between; align-items: center;">
            <span style="${style}">
                ${task.title} <small>(Due: ${task.deadline})</small> 
            </span>
            
            <div>
                ${statusBtn}
                ${editBtn}
                ${deleteBtn}
                ${extdlbtn}
            </div>
        </div>`;
    });

    document.getElementById('lvl-display').innerHTML = player.lvl;
    document.getElementById('coin-display').innerHTML = player.coins;
}



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

function setFilter(newStatus) {
    currentFilter = newStatus; // 1. Update the "memory"
    updateScreen();            // 2. Redraw the screen with the new filter
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
        if (player.hp > 100) player.hp = 100;
        player.coins += 20;
        console.log("Quest Complete!");

        /*if (player.hp > 100) {
            player.hp = 100;
        }*/
        //SOUND
        const sound = document.getElementById("levelup-sound");
        sound.play();
        checkLevelUp();

        // STEP 5: Update the screen to show the new status
        updateScreen();
    }
}

function checkLevelUp() {
    //1. IF player's XP is GREATER OR EQUAL TO player's xpToNextLevel:
    if (player.xp >= player.xpToNextLevel) {
        //a. Subtract xpToNextLevel from player's XP. (Don't set it to 0, just subtract the cost).
        player.xp = player.xp - player.xpToNextLevel;

        //b. Add 1 to player's Level.
        player.lvl++;

        //c. UPDATE xpToNextLevel: Current Target * 1.5. 
        //(CRITICAL: Use Math.floor() or Math.round() so you don't get decimals).
        player.xpToNextLevel = Math.round(player.xpToNextLevel * 1.5);

        //d. REWARD 1: Set player.hp equal to player.maxHp.
        player.hp = player.maxHp;

        //e. REWARD 2: Add 10 to player.coins.
        player.coins += 10;

        //f. Alert the user: "Level Up! You are now Lvl X"
        alert(`"Level Up! You are now LvL ${player.lvl}"`);

        //g. (Optional but smart): Call checkLevelUp() AGAIN inside itself. 
        //(Why? If I earned 500 XP at once, I might level up 3 times instantly).
        checkLevelUp();

    }
}

function saveData() {
    // 1. Save the Player object
    // Hint: use JSON.stringify(player) as the second argument
    localStorage.setItem("rpgPlayer", JSON.stringify(player));

    // 2. Save the Tasks array
    // Hint: use JSON.stringify(tasks)
    localStorage.setItem("rpgTasks", JSON.stringify(tasks));
}

function loadData() {
    try {
        // 1. Try to get the data from the locker
        let savedPlayer = localStorage.getItem("rpgPlayer");
        let savedTasks = localStorage.getItem("rpgTasks");

        // 2. Check if savedPlayer exists (is it not null?)
        if (savedPlayer) {
            // 3. Parse it and update the global 'player' variable
            // player = JSON.parse(......);
            player = JSON.parse(savedPlayer);
        }

        // 4. Check if savedTasks exists
        if (savedTasks) {
            // 5. Parse it and update the global 'tasks' variable
            // tasks = JSON.parse(......);
            tasks = JSON.parse(savedTasks);
        }
    } catch (error) {
        console.warn("Failed to load saved data:", error);
    }
}

function deleteTasks(id) {
    // 1. Ask for confirmation (optional, but good practice)
    if (confirm("You sure?")) {

        // 2. UPDATE THE 'tasks' VARIABLE
        // Write the code to filter 'tasks' so that we keep everything EXCEPT the matching 'id'
        // Hint: tasks = tasks.filter( ... )
        tasks = tasks.filter(task => {
            if (task.id !== id) {
                return task;
            }
            else {
                return;
            }
        });

        // 3. Save and Update Screen
        // (Call the functions we always call to save and redraw)
        updateScreen();
    }
}

//to reset the entire game 
function resetGame() {
    if (confirm("You will lose all the progress. You sure?")) {
        localStorage.removeItem("rpgPlayer");
        localStorage.removeItem("rpgTasks");
        location.reload();
    }
}

//to edit the task 
function editTask(id) {
    //find the task that matches the id
    let task = tasks.find(t => t.id === id);

    //get the updated task title from the user
    let editedTask = prompt("Update the task: ", task.title);

    //check if the user actually entered anything
    //if entered then update the title with the edited one 
    if (editTask) {
        task.title = editedTask;
        updateScreen();
    }
}


function toggleShop() {
    let shop = document.getElementById("shop-modal");

    shop.classList.toggle("hidden");

}

//logic to buy hp from the store 
function buyPotion(cost) {
    if (player.coins >= cost && player.hp < player.maxHp) {
        player.coins = player.coins - cost;
        player.hp = player.hp + 20;
        if (player.hp > player.maxHp) {
            player.hp = player.maxHp;
        }
    }
    else {
        alert("insufficient coins or max hp");
    }
    updateScreen();
}


function buyXp(cost) {
    if (player.coins >= cost) {
        player.coins = player.coins - cost;
        player.xp = player.xp + 50;
        checkLevelUp();
    }
}

function extendDeadline(id, cost) {
    let conf = confirm("Do you wanna extend deadline at the cost of " + cost + " coins?");
    if (player.coins >= cost && conf) {

        player.coins = player.coins - cost;

        let task = tasks.find(t => t.id === id);
        // 1. Get the current day number, add 1
        let currentDate = new Date(task.deadline);


        // 2. Set the date object to that new number
        currentDate.setDate(currentDate.getDate() + 1);

        // 3. Convert back to string (The Ugly Part)
        // .toISOString() gives you "2026-01-27T00:00:00.000Z"
        // .split('T')[0] gives you "2026-01-27"
        task.deadline = currentDate.toISOString().split('T')[0];

        updateScreen();
    }
    //else {
    //  alert("insufficient coins");
    //}
}

loadData();
updateScreen();

