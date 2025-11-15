// src/pages/public/PublicHomePage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents } from "../../services/api";
import EventCard from "../../components/EventCard";
import "./PublicHomePage.css";

import { CATEGORIES } from "../../constants";

export default function PublicHomePage() {
    const [popularEvents, setPopularEvents] = useState([]);

    useEffect(() => {
        async function loadEvents() {
            try {
                const data = await getEvents();
                // For now, let's just take the first 4 events as "popular"
                setPopularEvents(data.slice(0, 4));
            } catch (err) {
                console.error("Eroare la încărcarea evenimentelor:", err);
            }
        }
        loadEvents();
    }, []);

    return (
        <>
            {/* HERO */}
            <section className="hero">
                <div className="hero-overlay">
                    <h1>Descoperă evenimentele<br />din orașul tău</h1>
                    <Link to="/events" className="hero-btn">Vezi ce e aproape de tine</Link>
                </div>
            </section>

            <main className="container">
                {/* CATEGORII */}
                <section className="categories">
                    <h2>Toate tipurile de evenimente într-un singur loc</h2>
                    <div className="category-grid">
                        {CATEGORIES.map(category => (
                            <Link
                                key={category}
                                to={`/events?category=${encodeURIComponent(category)}`}
                                className="category-card"
                                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/images/category-${category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}.jpg')` }}
                            >
                                <div className="category-title">{category}</div>
                                <p>Descoperă evenimente de {category.toLowerCase()}</p>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* EVENIMENTE POPULARE */}
                <section className="popular">
                    <h2>Evenimente populare</h2>
                    <div className="events-grid">
                        {popularEvents.length > 0 ? (
                            popularEvents.map(event => (
                                <EventCard key={event.id} event={event} />
                            ))
                        ) : (
                            <p>Nu sunt evenimente populare în acest moment.</p>
                        )}
                    </div>
                </section>

                {/* FAQ */}
                <section className="faq">
                    <h2>Întrebări frecvente</h2>
                    <div className="faq-item">
                        <h3>Cum pot cumpăra bilete?</h3>
                        <p>Intră pe pagina evenimentului și urmează link-ul către platforma de bilete a organizatorului.</p>
                    </div>
                    <div className="faq-item">
                        <h3>Trebuie să îmi fac cont?</h3>
                        <p>Nu este obligatoriu, dar cu un cont poți salva evenimentele favorite și primi recomandări.</p>
                    </div>
                    <div className="faq-item">
                        <h3>Cât de des se actualizează evenimentele?</h3>
                        <p>Lista de evenimente este actualizată zilnic cu informații de la organizatori.</p>
                    </div>
                </section>
            </main>
        </>
    );
}
