import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import PublicHomePage from "./pages/public/PublicHomePage";
import PublicEventsPage from "./pages/public/PublicEventsPage";
import EventDetailsPage from "./pages/public/EventDetailsPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminEventsPage from "./pages/admin/AdminEventsPage";
import AdminAddEventPage from "./pages/admin/AdminAddEventPage";
import AdminEditEventPage from "./pages/admin/AdminEditEventPage";
import Footer from "./components/Footer";
import { CATEGORIES } from "./constants";
import "./Navbar.css";

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<PublicHomePage />} />
                    <Route path="/events" element={<PublicEventsPage />} />
                    <Route path="/event/:id" element={<EventDetailsPage />} />
                    <Route path="/admin/login" element={<AdminLoginPage />} />
                    <Route
                        path="/admin/events"
                        element={(
                            <ProtectedRoute>
                                <AdminEventsPage />
                            </ProtectedRoute>
                        )}
                    />
                    <Route
                        path="/admin/add"
                        element={(
                            <ProtectedRoute>
                                <AdminAddEventPage />
                            </ProtectedRoute>
                        )}
                    />
                    <Route
                        path="/admin/edit/:id"
                        element={(
                            <ProtectedRoute>
                                <AdminEditEventPage />
                            </ProtectedRoute>
                        )}
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

function ProtectedRoute({ children }) {
    const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("token");

    if (!isLoggedIn) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
}

function Layout({ children }) {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith("/admin");
    const [menuOpen, setMenuOpen] = useState(false);
    const [navBackground, setNavBackground] = useState(false);

    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (isAdminRoute) {
            setNavBackground(false);
            return;
        }

        function handleScroll() {
            setNavBackground(window.scrollY >= 80);
        }

        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isAdminRoute]);

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("isAdmin");
        window.location.href = "/admin/login";
    }

    if (isAdminRoute) {
        return (
            <>
                <nav className="navbar admin-nav">
                    <div className="navbar-inner">
                        <div className="nav-left">
                            <Link to="/" className="nav-logo">EventMe</Link>
                        </div>

                        <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                            ☰
                        </button>

                        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
                            <Link to="/admin/events" onClick={() => setMenuOpen(false)}>
                                Evenimente Admin
                            </Link>
                            <Link to="/admin/add" onClick={() => setMenuOpen(false)}>
                                Adaugă Eveniment
                            </Link>
                            <Link to="/" onClick={() => setMenuOpen(false)}>
                                Vezi Site Public
                            </Link>

                            {localStorage.getItem("isAdmin") === "true" && (
                                <button className="nav-logout" onClick={logout}>
                                    Logout
                                </button>
                            )}
                        </div>
                    </div>
                </nav>
                <div className="page-container">{children}</div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <header className={`navbar public-nav ${navBackground ? "active" : ""}`}>
                <div className="navbar-inner">
                    <Link to="/" className="logo">
                        EventMe
                    </Link>
                    <nav className="nav-links">
                        {CATEGORIES.slice(0, 5).map((category) => (
                            <Link key={category} to={`/events?category=${encodeURIComponent(category)}`}>
                                {category}
                            </Link>
                        ))}
                        <Link to="/admin/login" className="admin-link">
                            Admin
                        </Link>
                    </nav>
                </div>
            </header>

            <div className="page-container">{children}</div>

            <Footer />
        </>
    );
}

export default App;
