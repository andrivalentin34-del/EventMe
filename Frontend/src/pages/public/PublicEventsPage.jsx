// src/pages/public/PublicEventsPage.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getEvents } from "../../services/api";
import EventCard from "../../components/EventCard";
import "./PublicEventsPage.css";

export default function PublicEventsPage() {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("date-asc");
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const categoryFromUrl = searchParams.get("category");
        if (categoryFromUrl) {
            setCategory(categoryFromUrl);
        }
    }, [searchParams]);

    useEffect(() => {
        async function load() {
            try {
                const data = await getEvents();
                setEvents(data);
            } catch (err) {
                console.error("Eroare la încărcarea evenimentelor:", err);
            }
        }
        load();
    }, []);

    const categories = Array.from(
        new Set(events.map(e => e.category).filter(Boolean))
    );

    const filtered = events.filter(ev => {
        const text = (ev.title + " " + (ev.description || "")).toLowerCase();
        const matchSearch = text.includes(search.toLowerCase());
        const matchCategory = category ? ev.category === category : true;
        return matchSearch && matchCategory;
    });

    const sorted = [...filtered].sort((a, b) => {
        if (sort === "date-asc") {
            return new Date(a.date) - new Date(b.date);
        }
        if (sort === "date-desc") {
            return new Date(b.date) - new Date(a.date);
        }
        // Add other sorting options if needed
        return 0;
    });

    return (
        <div className="events-page">
            <header className="events-page-header">
                <h1>Explorează Evenimente</h1>
                <p>Găsește următoarea ta experiență de neuitat.</p>
            </header>

            <main className="events-page-content">
                <aside className="filters-sidebar">
                    <div className="filters-box">
                        <div className="filter-group">
                            <label>Caută</label>
                            <input
                                type="text"
                                placeholder="Nume eveniment..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="filter-group">
                            <label>Categorie</label>
                            <select value={category} onChange={e => setCategory(e.target.value)}>
                                <option value="">Toate</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Sortează după</label>
                            <select value={sort} onChange={e => setSort(e.target.value)}>
                                <option value="date-asc">Dată (recent)</option>
                                <option value="date-desc">Dată (viitor)</option>
                            </select>
                        </div>
                    </div>
                </aside>

                <section className="events-grid-container">
                    <p className="events-count">{sorted.length} eveniment(e) găsit(e)</p>
                    {sorted.length > 0 ? (
                        <div className="events-grid-layout">
                            {sorted.map(ev => (
                                <EventCard key={ev.id} event={ev} />
                            ))}
                        </div>
                    ) : (
                        <p className="no-events">Niciun eveniment găsit.</p>
                    )}
                </section>
            </main>
        </div>
    );
}