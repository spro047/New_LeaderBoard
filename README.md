# New_LeaderBoard

A dynamic, web-based Leaderboard application optimized for fitness or cycling events. The project features a public-facing ranking board and a private Admin Panel to manage entries.

## Description

The `New_LeaderBoard` project provides a clean and responsive UI to track and display participant performance data, including Distance (KM), Power Output (Watts), and Company affiliation. It features an automated sponsor carousel and dynamically sorts participants by their average power or distance. 

The application utilizes the browser's Local Storage to persist data across sessions and synchronizes updates in real-time between the Admin Panel and the main Leaderboard via Storage Events. Additionally, it integrates the SheetJS (`xlsx`) library to allow administrators to instantly export the current leaderboard data to an Excel spreadsheet.

## How to Use and Run

1. **Prerequisites**:
   - Any modern web browser (Chrome, Firefox, Safari, Edge).
   - No backend server is required as it runs entirely on the client side using Local Storage.

2. **Running the Application**:
   - Clone the repository: `git clone https://github.com/spro047/New_LeaderBoard.git`
   - Open `index.html` in your web browser to view the main Leaderboard.
   - The top sponsor carousel will animate automatically, and top participants will be displayed based on their metrics.

3. **Using the Admin Panel**:
   - Open `Admin_Panel.html` in a separate browser tab.
   - Fill out the form fields (Name, Distance, Watts, Company) and click "Add" to insert a new participant.
   - The main `index.html` page will automatically update to reflect the newly added entry without needing a refresh.
   - Use the "Clear Leaderboard" button to reset all data.
   - Use the "Download Leaderboard (Excel)" button to export the current rankings to a `.xlsx` file.

## Challenges Faced

During the development of this project, a few technical challenges were encountered and resolved:

1. **Real-time Synchronization**: Ensuring that adding a new entry in the `Admin_Panel.html` tab immediately updated the `index.html` tab without requiring a manual page refresh. This was solved by leveraging JavaScript's `StorageEvent` listener, which detects cross-tab changes in `localStorage`.
2. **Data Persistence without a Backend**: Managing state efficiently using only the browser's `localStorage` required careful JSON parsing and stringification to prevent data corruption when appending thousands of entries or sorting them dynamically.
3. **Excel Export Integration**: Implementing a client-side Excel download functionality required integrating the external `SheetJS (xlsx)` library natively into the HTML and formatting the JSON arrays correctly so the exported spreadsheet maintained the exact Ranked structure visible on the UI.
4. **Infinite Carousel Animation**: Creating a seamless, infinitely scrolling sponsor logo carousel using raw JavaScript `requestAnimationFrame` and DOM cloning, ensuring it didn't jump or glitch when looping back to the start.