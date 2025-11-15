// src/components/EventCard.jsx
import { Link } from "react-router-dom";
import { getFullImageUrl } from "../utils";
import "./EventCard.css";

export default function EventCard({ event }) {
    const date = new Date(event.date);
    const day = date.toLocaleDateString("ro-RO", { day: "2-digit" });
    const month = date.toLocaleDateString("ro-RO", { month: "short" }).toUpperCase();

    const getPlaceholderImageUrl = (category) => {
        switch (category) {
            case 'Concert':
                return 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop';
            case 'Teatru':
                return 'https://images.unsplash.com/photo-1489599849927-2ee91e4543e3?q=80&w=2070&auto=format&fit=crop';
            case 'Târg':
                return 'https://images.unsplash.com/photo-1511578194003-0628142b4494?q=80&w=2070&auto=format&fit=crop';
            case 'Sport':
                return 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=1949&auto=format&fit=crop';
            default:
                return 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop';
        }
    };

    const displayUrl = getFullImageUrl(event.imageUrl) || getPlaceholderImageUrl(event.category);

    return (
        <article className="event-card">
            <div
                className="event-image"
                style={{ backgroundImage: `url(${displayUrl})` }}
            ></div>
            <div className="event-info">
                <div className="event-date">
                    <span className="event-day">{day}</span>
                    <span className="event-month">{month}</span>
                </div>
                <div className="event-text">
                    <h3>{event.title}</h3>
                    <p className="event-location">{event.location}</p>
                </div>
            </div>
            <Link to={`/event/${event.id}`} className="event-btn">Detalii</Link>
        </article>
    );
}