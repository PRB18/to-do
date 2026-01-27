// player data
let player = {
    hp: 100,
    maxHp: 100,      // max health for healing on level up
    xp: 0,
    xpToNextLevel: 100, // next level threshold
    lvl: 1,
    coins: 0         // money system
};

let tasks = [
    { id: 1, title: "Submit Assignment", deadline: "2023-01-01", status: "pending" }, // old date to test
    { id: 2, title: "Gym", deadline: "2030-01-01", status: "pending" } // future date for testing
];

let currentFilter = "pending";


function runGameLoop() {
    console.log("Checking deadlines...");

    tasks.forEach(task => {
        let deadlineDate = new Date(task.deadline);
        let now = Date.now();

        // only if time ran out and task isn't done yet
        if (now > deadlineDate && task.status === "pending") {

            console.log(`You missed the deadline for: ${task.title}`);
            takeDamage(20); // pain

            // mark as missed so we don't keep punishing for it
            task.status = "missed";
        }
    });

    // refresh the display
    updateScreen();
}




// damage function - lose hp
function takeDamage(amount) {
    player.hp -= amount;

    // death check
    if (player.hp <= 0) {
        alert("💀 You died! Level Down & Coin Penalty applied.");

        // lose 1 level (min level is 1)
        player.lvl--;
        if (player.lvl < 1) {
            player.lvl = 1;
        }

        // lose half coins
        player.coins = Math.floor(player.coins * 0.5);

        // come back with low hp
        player.hp = 20;
    }

    // always update screen after changes
    updateScreen();

}



// update everything on the screen
function updateScreen() {

    // save stuff whenever something changes
    saveData();

    // update hp display
    const hpSpan = document.getElementById('hp-display');
    hpSpan.innerText = player.hp;

    // make it red when low
    if (player.hp <= 50) {
        hpSpan.style.color = "red";
    } else {
        hpSpan.style.color = "green";
    }

    // update task list
    const listDiv = document.getElementById('task-list');
    listDiv.innerHTML = ""; // clear before redrawing

    // filter tasks based on what we're looking at
    let filteredTasks = tasks.filter(task => {
        // just show pending
        if (currentFilter === "pending") {
            return task.status === "pending";
        }
        // show everything else (done/missed)
        else {
            return task.status !== "pending";
        }
    })

    filteredTasks.forEach(task => {

        let today = new Date();
        today.setHours(0, 0, 0, 0);
        let taskDate = new Date(task.deadline);
        let overdueClass = "";

        // mark as overdue if deadline passed and not done
        if (taskDate < today && task.status === "pending") {
            overdueClass = "overdue";
        }

        let statusBtn = "";
        let editBtn = "";
        let extdlbtn = "";
        let deleteBtn = `<button onclick="deleteTasks(${task.id})" style="margin-left:5px;">🗑️</button>`;

        // set status buttons based on task state
        if (task.status === "missed") {
            statusBtn = "❌";
        } else if (task.status === "done") {
            statusBtn = "✅";
        } else {
            statusBtn = `<button onclick="completeTask(${task.id})">Complete</button>`;
            editBtn = `<button onclick="editTask(${task.id})" style="margin-left:5px;">✏️</button>`;
            extdlbtn = `<button onclick="extendDeadline(${task.id},${100})" style="margin-left:5px;">📅</button>`
        }

        // build the html for this task
        document.getElementById("task-list").innerHTML += `
            <div class="task-card ${overdueClass} ${task.status === 'done' ? 'completed' : ''}">
                <h3>${task.title}</h3>
                <p>Due: ${task.deadline}</p>
                <div class="task-buttons">
                    ${statusBtn}
                    ${editBtn}
                    ${extdlbtn}
                    ${deleteBtn}
                </div>
            </div>
        `;
    });

    document.getElementById('lvl-display').innerHTML = player.lvl;
    document.getElementById('coin-display').innerHTML = player.coins;
}



function addTask() {
    // grab input values
    let titleInput = document.getElementById("task-title");
    let dateInput = document.getElementById("task-date");

    let title = titleInput.value;
    let deadline = dateInput.value;

    // need a title
    if (title === "") {
        alert("You need a quest name, traveler!");
        return;
    }

    // make the new task
    let newTask = {
        id: Date.now(),
        title: title,
        deadline: deadline,
        status: "pending",
    };

    // add it to the list
    tasks.push(newTask);

    // clear inputs and refresh
    titleInput.value = "";
    updateScreen();
}

function setFilter(newStatus) {
    currentFilter = newStatus;
    updateScreen();
}


function completeTask(id) {
    // find the task
    let task = tasks.find(t => t.id === id);

    // only if it exists and is pending
    if (task && task.status === "pending") {

        task.status = "done";

        // give rewards
        player.xp += 20;
        player.hp += 10;
        if (player.hp > 100) player.hp = 100;
        player.coins += 20;
        console.log("Quest Complete!");

        // play sound
        const sound = document.getElementById("levelup-sound");
        sound.play();
        checkLevelUp();

        updateScreen();
    }
}

function checkLevelUp() {
    // enough xp to level?
    if (player.xp >= player.xpToNextLevel) {
        player.xp = player.xp - player.xpToNextLevel;

        player.lvl++;

        // next level needs more xp
        player.xpToNextLevel = Math.round(player.xpToNextLevel * 1.5);

        // full heal on level up
        player.hp = player.maxHp;

        // bonus coins
        player.coins += 10;

        alert(`"Level Up! You are now LvL ${player.lvl}"`);

        // check again in case we leveled up multiple times
        checkLevelUp();

    }
}

function saveData() {
    // save player
    localStorage.setItem("rpgPlayer", JSON.stringify(player));

    // save tasks
    localStorage.setItem("rpgTasks", JSON.stringify(tasks));
}

function loadData() {
    try {
        // get saved data from storage
        let savedPlayer = localStorage.getItem("rpgPlayer");
        let savedTasks = localStorage.getItem("rpgTasks");

        // load player if exists
        if (savedPlayer) {
            player = JSON.parse(savedPlayer);
        }

        // load tasks if exists
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
        }
    } catch (error) {
        console.warn("Failed to load saved data:", error);
    }
}

function deleteTasks(id) {
    if (confirm("You sure?")) {
        // remove the task with this id
        tasks = tasks.filter(task => {
            if (task.id !== id) {
                return task;
            }
            else {
                return;
            }
        });

        updateScreen();
    }
}

// nuke everything and start fresh
function resetGame() {
    if (confirm("You will lose all the progress. You sure?")) {
        localStorage.removeItem("rpgPlayer");
        localStorage.removeItem("rpgTasks");
        location.reload();
    }
}

// let user change task name
function editTask(id) {
    // find it
    let task = tasks.find(t => t.id === id);

    // ask for new name
    let editedTask = prompt("Update the task: ", task.title);

    // if they entered something, save it
    if (editTask) {
        task.title = editedTask;
        updateScreen();
    }
}


// show/hide shop
function toggleShop() {
    let shop = document.getElementById("shop-modal");
    shop.classList.toggle("hidden");
}

// buy hp potion
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


// buy xp points
function buyXp(cost) {
    if (player.coins >= cost) {
        player.coins = player.coins - cost;
        player.xp = player.xp + 50;
        checkLevelUp();
    }
}

// buy extra time for a task
function extendDeadline(id, cost) {
    let conf = confirm("Do you wanna extend deadline at the cost of " + cost + " coins?");
    if (player.coins >= cost && conf) {

        player.coins = player.coins - cost;

        let task = tasks.find(t => t.id === id);
        // add 1 day
        let currentDate = new Date(task.deadline);
        currentDate.setDate(currentDate.getDate() + 1);

        // convert back to date string
        task.deadline = currentDate.toISOString().split('T')[0];

        updateScreen();
    }
}

loadData();
updateScreen();

