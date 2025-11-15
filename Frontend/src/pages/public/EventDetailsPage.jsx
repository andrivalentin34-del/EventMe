// src/pages/public/EventDetailsPage.jsx

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getEventById } from "../../services/api";
import { getFullImageUrl } from "../../utils";
import "./EventDetailsPage.css";

export default function EventDetailsPage() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                const data = await getEventById(id);
                setEvent(data);
            } catch (err) {
                console.error("Eroare la încărcarea evenimentului:", err);
            }
        }
        load();
    }, [id]);

    if (!event) {
        return <div className="details-loading">Se încarcă...</div>;
    }

    const formattedDate = new Date(event.date).toLocaleDateString("ro-RO", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    const displayUrl = getFullImageUrl(event.imageUrl) || 'https://placehold.co/900x300/EEE/31343C';

    const isUrl = (str) => {
        try {
            new URL(str);
            return true;
        } catch (_) {
            return false;
        }
    };

    const renderDetails = () => {
        if (!event.details) {
            return null;
        }

        if (isUrl(event.details)) {
            return (
                <div className="details-section">
                    <h2 className="section-title">Mai multe informații</h2>
                    <a href={event.details} target="_blank" rel="noopener noreferrer" className="details-action-btn">
                        Vizitează site-ul evenimentului
                    </a>
                </div>
            );
        }

        return (
            <div className="details-section">
                <h2 className="section-title">Detalii suplimentare</h2>
                <p className="details-text">{event.details}</p>
            </div>
        );
    };

    return (
        <div className="details-container">
            <div className="details-card">
                <img
                    src={displayUrl}
                    alt={event.title}
                    className="details-image"
                />
                <div className="details-content">
                    {event.category && (
                        <span className="details-category-pill">
                            {event.category}
                        </span>
                    )}

                    <h1 className="details-title">{event.title}</h1>

                    <div className="details-meta">
                        <div className="meta-box">
                            <span className="meta-label">📅 Dată</span>
                            <span className="meta-value">{formattedDate}</span>
                        </div>
                        <div className="meta-box">
                            <span className="meta-label">📍 Locație</span>
                            <span className="meta-value">{event.location}</span>
                        </div>
                    </div>

                    {event.description && (
                        <div className="details-section">
                            <h2 className="section-title">Descriere</h2>
                            <p className="details-description">{event.description}</p>
                        </div>
                    )}

                    {renderDetails()}

                    <div className="details-actions">
                        <Link to="/events" className="details-back-btn">
                            ← Înapoi la evenimente
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
