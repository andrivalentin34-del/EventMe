// src/pages/admin/AdminAddEventPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../services/api";
import "./AdminAddEventPage.css";

import { CATEGORIES } from "../../constants";

export default function AdminAddEventPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        category: CATEGORIES[0], // Default category
        date: "",
        location: "",
        description: "",
        details: "", // New details field
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }

    function handleDrop(e) {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData();
        for (const key in form) {
            formData.append(key, form[key]);
        }
        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            await createEvent(formData);
            setSuccess("Evenimentul a fost adăugat cu succes!");

            setTimeout(() => {
                navigate("/admin/events");
            }, 800);
        } catch (err) {
            console.error("Full error object:", err);
            setError(err.message || "Eroare la adăugarea evenimentului.");
        }

        setLoading(false);
    }

    return (
        <div className="admin-add-container">
            <h1 className="admin-title">Adaugă Eveniment Nou</h1>
            <p className="admin-subtitle">
                Completează detaliile evenimentului și publică-l instant.
            </p>

            <form className="admin-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Titlu</label>
                    <input type="text" name="title" value={form.title} onChange={handleChange} required placeholder="Ex: Concert Rock" />
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
                    <label>Locație / Oraș</label>
                    <input type="text" name="location" value={form.location} onChange={handleChange} required placeholder="Ex: București" />
                </div>
                
                {/* Image Upload */}
                <div className="form-group">
                    <label>Imagine Eveniment</label>
                    <div
                        className="dropzone"
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => document.getElementById('fileInput').click()}
                    >
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="image-preview" />
                        ) : (
                            <p>Trage o imagine aici sau apasă pentru a selecta</p>
                        )}
                        <input
                            type="file"
                            id="fileInput"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Descriere</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows="5" placeholder="Detalii despre eveniment..."></textarea>
                </div>

                <div className="form-group">
                    <label>Detalii (URL sau indicații)</label>
                    <textarea name="details" value={form.details} onChange={handleChange} rows="3" placeholder="Introduceți un URL către pagina evenimentului sau indicații suplimentare..."></textarea>
                </div>

                {error && <p className="error-msg">{error}</p>}
                {success && <p className="success-msg">{success}</p>}

                <button className="admin-submit-btn" disabled={loading}>
                    {loading ? "Se salvează..." : "Publică Eveniment"}
                </button>
            </form>
        </div>
    );
}