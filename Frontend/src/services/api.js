// src/services/api.js

const BASE_URL = "http://localhost:5000/api";

// Helper pentru răspunsuri
async function handleResponse(res) {
    const data = await res.json().catch(() => null);

    if (!res.ok) {
        throw new Error(data?.error || "Eroare server");
    }

    return data;
}

// GET toate evenimentele (public sau admin)
export async function getEvents() {
    const res = await fetch(`${BASE_URL}/events`);
    return handleResponse(res);
}

// GET un singur eveniment
export async function getEventById(id) {
    const res = await fetch(`${BASE_URL}/events/${id}`);
    return handleResponse(res);
}

// CREATE event
export async function createEvent(formData) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/events`, {
        method: "POST",
        headers: {
            // Don't set 'Content-Type', browser will set it with boundary
            "Authorization": `Bearer ${token}`
        },
        body: formData
    });

    return handleResponse(res);
}

// UPDATE event
export async function updateEvent(id, eventData) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/events/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
    });

    return handleResponse(res);
}

// DELETE event
export async function deleteEvent(id) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/events/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    return handleResponse(res);
}
