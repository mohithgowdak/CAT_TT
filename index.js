/*import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyD_KX75jv1sX0JkGRWZjjstSLVzJ04m-Ys",
    authDomain: "golden-context-416014.firebaseapp.com",
    projectId: "golden-context-416014",
    storageBucket: "golden-context-416014.firebasestorage.app",
    messagingSenderId: "767787175345",
    appId: "1:767787175345:web:be80a8440832838d96c190",
    measurementId: "G-W1SV4DKWSJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", async function () {
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

    async function loadProgress() {
        const docRef = doc(db, "progress", "phase1DailyProgress");
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : {};
    }

    async function saveProgress(tableId, week, dayIndex, value) {
        const progressData = await loadProgress();
        if (!progressData[tableId]) progressData[tableId] = {};
        if (!progressData[tableId][week]) progressData[tableId][week] = {};
        progressData[tableId][week][dayIndex] = value;
        await setDoc(doc(db, "progress", "phase1DailyProgress"), progressData);
    }

    const progressData = await loadProgress();

    tables.forEach(({ id, schedule, weeks, hasTask3 }) => {
        const table = document.getElementById(id);
        table.innerHTML = ""; // Clear table before inserting

        // Create table header
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        headerRow.innerHTML = hasTask3 ? `<th>Day</th><th>Task 1</th><th>Task 2</th><th>Task 3</th>` : `<th>Day</th><th>Task 1</th><th>Task 2</th>`;

        for (let week = 1; week <= weeks; week++) {
            let th = document.createElement("th");
            let checkAll = document.createElement("input");
            checkAll.type = "checkbox";
            checkAll.id = `checkAllWeek${week}_${id}`;
            checkAll.addEventListener("change", function () {
                toggleWeek(id, week, checkAll.checked);
            });
            th.appendChild(checkAll);
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
                checkbox.checked = progressData[id]?.[week]?.[index] || false;

                checkbox.addEventListener("change", async function () {
                    await saveProgress(id, week, index, checkbox.checked);
                    updateCompletionPercentage();
                    checkAllUpdate(id, week);
                });

                checkCell.appendChild(checkbox);
                row.appendChild(checkCell);
            }
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
    });

    function toggleWeek(tableId, week, state) {
        const scheduleLength = tables.find((t) => t.id === tableId).schedule.length;
        for (let index = 0; index < scheduleLength; index++) {
            let checkbox = document.getElementById(`week${week}day${index}_${tableId}`);
            if (checkbox) {
                checkbox.checked = state;
                saveProgress(tableId, week, index, state);
            }
        }
        updateCompletionPercentage();
    }

    function checkAllUpdate(tableId, week) {
        const scheduleLength = tables.find((t) => t.id === tableId).schedule.length;
        let allChecked = true;
        for (let index = 0; index < scheduleLength; index++) {
            if (!document.getElementById(`week${week}day${index}_${tableId}`).checked) {
                allChecked = false;
                break;
            }
        }
        document.getElementById(`checkAllWeek${week}_${tableId}`).checked = allChecked;
    }

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

    updateCompletionPercentage();
});*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyD_KX75jv1sX0JkGRWZjjstSLVzJ04m-Ys",
    authDomain: "golden-context-416014.firebaseapp.com",
    projectId: "golden-context-416014",
    storageBucket: "golden-context-416014.firebasestorage.app",
    messagingSenderId: "767787175345",
    appId: "1:767787175345:web:be80a8440832838d96c190",
    measurementId: "G-W1SV4DKWSJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", async function () {
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

    async function loadProgress() {
        const docRef = doc(db, "progress", "phase1DailyProgress");
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : {};
    }

    async function saveProgress(tableId, week, dayIndex, value) {
        const progressData = await loadProgress();
        if (!progressData[tableId]) progressData[tableId] = {};
        if (!progressData[tableId][week]) progressData[tableId][week] = {};
        progressData[tableId][week][dayIndex] = value;
        await setDoc(doc(db, "progress", "phase1DailyProgress"), progressData);
    }

    const progressData = await loadProgress();

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
                checkbox.checked = progressData[id]?.[week]?.[index] || false;

                checkbox.addEventListener("change", async function () {
                    await saveProgress(id, week, index, checkbox.checked);
                    updateCompletionPercentage();
                    checkAllUpdate(id, week);
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

    updateCompletionPercentage();
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