// src/pages/admin/AdminLoginPage.jsx
import { useState } from "react";
import "./AdminLoginPage.css";

export default function AdminLoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin() {
        setError("");

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: "admin",
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Eroare la autentificare");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("isAdmin", "true");

            window.location.href = "/admin/events";

        } catch (err) {
            console.error(err);
            setError("Nu se poate conecta la server.");
        }
    }

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">

                <h1>🔐 Panou Administrator</h1>
                <p className="admin-subtitle">
                    Introdu parola de administrator pentru a accesa panoul.
                </p>

                <input
                    type="password"
                    placeholder="Parola admin"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="admin-input"
                />

                {error && <p className="admin-error">{error}</p>}

                <button className="admin-login-btn" onClick={handleLogin}>
                    Intră în panou
                </button>

            </div>
        </div>
    );
}
