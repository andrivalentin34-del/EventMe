// src/pages/admin/AdminEditEventPage.jsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEventById, updateEvent } from "../../services/api";
import "./AdminEditEventPage.css";

import { CATEGORIES } from "../../constants";

export default function AdminEditEventPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        date: "",
        location: "",
        description: "",
        category: "",
        details: "",
        imageUrl: ""
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getEventById(id);

                setForm({
                    title: data.title,
                    date: data.date.split("T")[0],
                    location: data.location,
                    description: data.description || "",
                    category: data.category || CATEGORIES[0],
                    details: data.details || "",
                    imageUrl: data.imageUrl || ""
                });

                setLoading(false);
            } catch (err) {
                console.error(err);
                navigate("/admin/events");
            }
        }

        load();
    }, [id, navigate]);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        // Note: This does not handle file uploads for edit, only URL.
        await updateEvent(id, form);
        navigate("/admin/events");
    }

    if (loading) return <p style={{ padding: 20 }}>Se încarcă...</p>;

    return (
        <div className="admin-edit-container">
            <h1>Editare Eveniment</h1>

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                    <label>Titlu</label>
                    <input name="title" value={form.title} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Categorie</label>
                    <select name="category" value={form.category} onChange={handleChange} required>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Data</label>
                    <input type="date" name="date" value={form.date} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Locație</label>
                    <input name="location" value={form.location} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>URL Imagine</label>
                    <input type="text" name="imageUrl" placeholder="URL imagine" value={form.imageUrl} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Descriere</label>
                    <textarea name="description" rows={5} value={form.description} onChange={handleChange}></textarea>
                </div>

                <div className="form-group">
                    <label>Detalii (URL sau indicații)</label>
                    <textarea name="details" rows={3} value={form.details} onChange={handleChange}></textarea>
                </div>

                <div className="actions">
                    <button type="submit" className="btn-primary">Salvează Modificările</button>
                    <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
                        Anulează
                    </button>
                </div>
            </form>
        </div>
    );
}