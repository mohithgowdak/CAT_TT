import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
// Firebase Config
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

let userId = null;

document.addEventListener("DOMContentLoaded", async function () {
    const loginButton = document.createElement("button");
    loginButton.textContent = "Login with Google";
    loginButton.classList.add("login-btn");
    document.body.prepend(loginButton);

    // 🔹 ADD THIS: Create the Logout button
    const logoutButton = document.createElement("button");
    logoutButton.textContent = "Logout";
    logoutButton.classList.add("logout-btn");
    document.body.prepend(logoutButton);

    logoutButton.addEventListener("click", logout);


    loginButton.addEventListener("click", async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            userId = result.user.uid; // Set userId again on login
    
            console.log("User ID:", userId); // Debugging
    
            alert(`Welcome, ${result.user.displayName}`);
    
            // Show logout button, hide login button
            loginButton.style.display = "none";
            logoutButton.style.display = "block";
    
            loadProgress();  // Reload progress after login
        } catch (error) {
            console.error("Login Failed", error);
        }
    });

    // 🔹 ADD THIS: Logout Function
    
    async function logout() {
        await auth.signOut(); // Sign out the user
        userId = null; // Clear the stored user ID
        cachedProgress = {}; // Reset progress cache
    
        // Uncheck all checkboxes
        document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
            checkbox.checked = false;
        });
    
        document.getElementById("completionPercentage").textContent = "Completion: 0%";
    
        alert("Logged out successfully!");
    }
    
    // 🔹 Automatically Handle UI When User Logs In/Out
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            userId = user.uid;
            loginButton.style.display = "none";
            logoutButton.style.display = "block";
            loadProgress();
        } else {
            loginButton.style.display = "block";
            logoutButton.style.display = "none";
        }
    });

    const schedule1 = [
        ["Monday", "3 RCs + Para jumbles", "DI Set + Logical Puzzle", "Arithmetic + Algebra"],
        ["Tuesday", "3 RCs + Summary Questions", "LR Set + Caselet", "Geometry + Number System"],
        ["Wednesday", "3 RCs + Odd-One-Out", "DI Set + Arrangements", "Arithmetic + Algebra"],
        ["Thursday", "3 RCs + Grammar", "LR Set + Games & Tournaments", "Geometry + Functions"],
        ["Friday", "3 RCs + Para jumbles", "DI Set + Venn Diagrams", "Arithmetic + Algebra"],
        ["Saturday", "Sectional Mock (VARC)", "Sectional Mock (DILR)", "Sectional Mock (QA)"],
        ["Sunday", "Full-Length Mock", "Full-Length Mock", "Revision + Weak Areas"]
    ];

    const schedule2 = [
        ["Monday", "Advanced DILR Set", "50+ QA Questions"],
        ["Tuesday", "Mocks", "Mock Analysis"],
        ["Wednesday", "Advanced DILR Set", "50+ QA Questions"],
        ["Thursday", "Mocks", "Mock Analysis"],
        ["Friday", "Advanced DILR Set", "50+ QA Questions"],
        ["Saturday", "Full-Length Mock", "Detailed Mock Analysis"],
        ["Sunday", "Full-Length Mock", "Mock Review + Weak Areas"]
    ];

    const tables = [
        { id: "scheduleTable", schedule: schedule1, weeks: 18, hasTask3: true },
        { id: "scheduleTable2", schedule: schedule2, weeks: 13, hasTask3: false }
    ];

    let cachedProgress = {};

    async function loadProgress() {
        if (!userId) return;
    
        const docRef = doc(db, "progress", userId);
        const docSnap = await getDoc(docRef);
    
        cachedProgress = docSnap.exists() ? docSnap.data() : {}; // Ensure object
    
        tables.forEach(({ id, schedule, weeks }) => {
            for (let week = 1; week <= weeks; week++) {
                for (let index = 0; index < schedule.length; index++) {
                    const checkbox = document.getElementById(`week${week}day${index}_${id}`);
                    if (checkbox && cachedProgress[id] && cachedProgress[id][week]) {
                        checkbox.checked = cachedProgress[id][week][index] || false; // Ensure false if undefined
                    }
                }
            }
        });
    
        updateCompletionPercentage();
    }
    
    async function saveProgress(tableId, week, dayIndex, value) {
        if (!userId) return;
        
        // Get the latest progress data from Firestore
        const docRef = doc(db, "progress", userId);
        const docSnap = await getDoc(docRef);
        
        let progressData = docSnap.exists() ? docSnap.data() : {}; // Ensure object
    
        // Ensure the necessary structure exists
        if (!progressData[tableId]) progressData[tableId] = {};
        if (!progressData[tableId][week]) progressData[tableId][week] = {};
        
        // Save the progress
        progressData[tableId][week][dayIndex] = value;
    
        // Update Firestore
        await setDoc(docRef, progressData);
    
        console.log(`Saved: ${tableId} - Week ${week} - Day ${dayIndex} - ${value}`);
    }
    

    tables.forEach(({ id, schedule, weeks, hasTask3 }) => {
        const table = document.getElementById(id);
        table.innerHTML = ""; // Clear table before inserting

        // Create table header
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        headerRow.innerHTML = hasTask3 ? `<th>Day</th><th>Task 1</th><th>Task 2</th><th>Task 3</th>` : `<th>Day</th><th>Task 1</th><th>Task 2</th>`;

        for (let week = 1; week <= weeks; week++) {
            let th = document.createElement("th");
            th.textContent = `Week ${week}`;
            headerRow.appendChild(th);
        }

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create table body
        const tbody = document.createElement("tbody");

        schedule.forEach((daySchedule, index) => {
            let row = document.createElement("tr");
            daySchedule.slice(0, hasTask3 ? 4 : 3).forEach((item) => {
                let cell = document.createElement("td");
                cell.textContent = item;
                row.appendChild(cell);
            });

            for (let week = 1; week <= weeks; week++) {
                let checkCell = document.createElement("td");
                let checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = `week${week}day${index}_${id}`;
                checkbox.addEventListener("change", async function () {
                    await saveProgress(id, week, index, checkbox.checked);
                    updateCompletionPercentage();
                });
                checkCell.appendChild(checkbox);
                row.appendChild(checkCell);
            }
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
    });

    function updateCompletionPercentage() {
        let total = tables.reduce((sum, { schedule, weeks }) => sum + weeks * schedule.length, 0);
        let completed = 0;

        tables.forEach(({ id, schedule, weeks }) => {
            for (let week = 1; week <= weeks; week++) {
                for (let index = 0; index < schedule.length; index++) {
                    if (document.getElementById(`week${week}day${index}_${id}`).checked) {
                        completed++;
                    }
                }
            }
        });

        let percentage = ((completed / total) * 100).toFixed(2);
        document.getElementById("completionPercentage").textContent = `Completion: ${percentage}%`;
    }

    auth.onAuthStateChanged(async (user) => {
        if (user) {
            userId = user.uid;
            loadProgress();
        }
    });
});
function updateDaysLeft() {
    const targetDate = new Date("2025-11-30");
    const today = new Date();
    const timeDiff = targetDate - today;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    document.getElementById("daysLeft").textContent = `Days Left: ${daysLeft}`;
}

// Update on page load
document.addEventListener("DOMContentLoaded", updateDaysLeft);


