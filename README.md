# RPG Task Manager

A fun and gamified to-do list application that turns task management into an RPG adventure! Manage your quests (tasks) with deadlines, earn XP, level up, and avoid losing HP by completing tasks on time.

## Features

- **Quest Management**: Add tasks with titles and deadlines as quests in your quest log.
- **RPG Elements**:
  - Player HP (Health Points): Starts at 100. Completing quests heals HP, missing deadlines causes damage.
  - XP and Leveling: Gain XP by completing quests to level up with increasing XP requirements (level display included).
  - Economy System: Earn coins by completing tasks and leveling up for future use.
  - Death Mechanics: If HP drops to 0, suffer penalties including level down, coin loss (half your coins), and respawn at low HP.
- **Task Status Tracking**: Tasks can be pending, completed, or missed (with visual indicators - red strikethrough for missed, grey for completed).
- **Task Filtering**: Switch between viewing active (pending) quests or your full quest log (completed and missed tasks).
- **Task Editing**: Edit the title of pending tasks to update quest details.
- **Task Deletion**: Delete tasks from your quest log with confirmation to clean up completed or irrelevant quests.
- **Rewards Shop**: Spend earned coins on rewards like gaming time or cheat meals through a modal interface.
- **Game Reset**: Reset all progress (stats and tasks) with confirmation to start fresh.
- **Deadline Simulation**: "Check Deadlines" button simulates time passing, applying penalties for overdue tasks.
- **Persistent Progress**: Automatically save and load game state using localStorage to maintain HP, XP, level, coins, and tasks between sessions.
- **Audio Feedback**: Sound effect plays when leveling up.
- **Dark Mode UI**: Retro-styled interface with dark theme, glowing effects, and game-like aesthetics.
- **Visual Feedback**: HP display changes color based on health status (green when healthy, red when low).

## How to Use

1. **Open the App**: Open `index.html` in your web browser.
2. **Add a Quest**: Enter a task name and deadline, then click "Add Task".
3. **Filter Quests**: Use the "Active Quests" button to see only pending tasks, or "Quest Log" to view completed and missed tasks.
4. **Complete Quests**: Click the "Complete" button next to a pending task to mark it done, gain XP, heal HP, and earn coins.
5. **Edit Quests**: Click the pencil icon (✏️) next to a pending task to edit its title.
6. **Delete Quests**: Click the trash icon (🗑️) next to any task to delete it from your quest log (with confirmation).
7. **Check Deadlines**: Click "Check Deadlines" to simulate time and see if any tasks are overdue (causes HP damage if missed).
8. **Open Shop**: Click "🛒 Open Shop" to access the rewards shop and spend coins on items.
9. **Buy Rewards**: In the shop modal, click on reward buttons to purchase items if you have enough coins.
10. **Reset Progress**: Click "Reset All Progress" to clear all stats and tasks and start over (with confirmation).
11. **Monitor Stats**: Keep an eye on your HP, level, and coin displays. Level up for rewards, but avoid death penalties!
12. **Level Up**: Accumulate XP to level up, receiving full HP restoration and bonus coins.
13. **Persistent Progress**: Your game state (stats and tasks) is automatically saved and restored when you reopen the app.

## Technologies Used

- **HTML**: Structure of the web page.
- **CSS**: Dark mode styling and visual effects.
- **JavaScript**: Game logic, task management, DOM manipulation, and localStorage for data persistence.

## Project Structure

- `index.html`: Main HTML file with the UI.
- `logic.js`: JavaScript file containing all the game logic and functions.
- `style.css`: CSS file for dark mode styling and visual effects.

## Future Enhancements

- Add more RPG features like items, shops, or achievements.
- Expand the economy system with rewards and purchases.

## Contributing

Feel free to fork the repository and submit pull requests for improvements or new features.

## License

This project is open-source. Use it as you wish!</content>
<parameter name="filePath">c:\Users\babur\OneDrive\Desktop\to-do\README.md