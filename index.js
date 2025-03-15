import { initializeAuth } from "./auth.js";
import { initializeTables } from "./table.js";

document.addEventListener("DOMContentLoaded", () => {
    initializeAuth((userId) => {
        initializeTables(userId);
    });
});
