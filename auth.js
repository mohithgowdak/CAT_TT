import { auth } from "./firebase.js";
import { signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

const provider = new GoogleAuthProvider();
let userId = null;

export function initializeAuth(callback) {
    document.addEventListener("DOMContentLoaded", () => {
        const loginButton = document.createElement("button");
        loginButton.textContent = "Login with Google";
        loginButton.classList.add("login-btn");
        document.body.prepend(loginButton);

        loginButton.addEventListener("click", async () => {
            try {
                const result = await signInWithPopup(auth, provider);
                userId = result.user.uid;
                alert(`Welcome, ${result.user.displayName}`);
                callback(userId);
            } catch (error) {
                console.error("Login Failed", error);
            }
        });

        auth.onAuthStateChanged((user) => {
            if (user) {
                userId = user.uid;
                callback(userId);
            }
        });
    });
}

export function getUserId() {
    return userId;
}
