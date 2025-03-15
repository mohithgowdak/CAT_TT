import { db } from "./firebase.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getUserId } from "./auth.js";



// Rest of the table-related logic...

const db = getFirestore();
const tables = [
    { id: "scheduleTable", weeks: 18, hasTask3: true },
    { id: "scheduleTable2", weeks: 13, hasTask3: false }
];

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

async function loadProgress(userId) {
    if (!userId) return {};
    const docRef = doc(db, "progress", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : {};
}
async function saveProgress(userId, tableId, week, dayIndex, value) {
    if (!userId) return;
    const progressData = await loadProgress(userId);
    if (!progressData[tableId]) progressData[tableId] = {};
    if (!progressData[tableId][week]) progressData[tableId][week] = {};
    progressData[tableId][week][dayIndex] = value;
    await setDoc(doc(db, "progress", userId), progressData);
}

export async function initializeTables(userId) {
    tables.forEach(({ id, weeks, hasTask3 }) => {
        const schedule = id === "scheduleTable" ? schedule1 : schedule2;
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
                    await saveProgress(userId, id, week, index, checkbox.checked);
                    updateCompletionPercentage();
                });
                checkCell.appendChild(checkbox);
                row.appendChild(checkCell);
            }
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
    });

    updateCompletionPercentage();
}

function updateCompletionPercentage() {
    let total = tables.reduce((sum, { weeks }) => sum + weeks * 7, 0);
    let completed = 0;

    tables.forEach(({ id, weeks }) => {
        for (let week = 1; week <= weeks; week++) {
            for (let index = 0; index < 7; index++) {
                let checkbox = document.getElementById(`week${week}day${index}_${id}`);
                if (checkbox && checkbox.checked) completed++;
            }
        }
    });

    let percentage = ((completed / total) * 100).toFixed(2);
    document.getElementById("completionPercentage").textContent = `Completion: ${percentage}%`;
}
