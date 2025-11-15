// src/pages/admin/AdminEventsPage.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents, deleteEvent } from "../../services/api";
import "./AdminEventsPage.css";

export default function AdminEventsPage() {
    const [events, setEvents] = useState([]);

    async function load() {
        const data = await getEvents();
        setEvents(data);
    }

    useEffect(() => {
        load();
    }, []);

    async function handleDelete(id) {
        if (!window.confirm("Sigur vrei să ștergi acest eveniment?")) return;

        await deleteEvent(id);
        load();
    }

    return (
        <div className="admin-events-container">

            <div className="admin-header">
                <h1>Gestionare Evenimente</h1>
                <Link to="/admin/add" className="admin-add-btn">+ Adaugă Eveniment</Link>
            </div>

            {events.length === 0 ? (
                <p className="no-events">Nu există evenimente în sistem.</p>
            ) : (
                <div className="admin-events-grid">
                    {events.map(ev => (
                        <div className="admin-event-card" key={ev.id}>

                            {ev.category && (
                                <span className="admin-category-pill">{ev.category}</span>
                            )}

                            <h2>{ev.title}</h2>

                            <div className="admin-meta">
                                <p><b>📅</b> {new Date(ev.date).toLocaleDateString("ro-RO")}</p>
                                <p><b>📍</b> {ev.location}</p>

                                {ev.price !== null && (
                                    <p><b>💸</b> {ev.price} lei</p>
                                )}
                            </div>

                            <div className="admin-actions">
                                <Link to={`/admin/edit/${ev.id}`} className="admin-edit-btn">
                                    Editare
                                </Link>

                                <button
                                    className="admin-delete-btn"
                                    onClick={() => handleDelete(ev.id)}
                                >
                                    Șterge
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
