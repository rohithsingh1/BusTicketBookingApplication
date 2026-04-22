import {Link} from "react-router-dom";
import "./AuthSuccess.css";

const AuthSuccess=() => {
    return (
        <main className="auth-success-page">
            <section className="auth-success-card">
                <div className="auth-success-badge" aria-hidden="true">
                    ✓
                </div>
                <h1 className="auth-success-title">Authentication successful</h1>
                <p className="auth-success-subtitle">
                    Your Google sign-in completed successfully and your session is now active.
                </p>
                <Link to="/login" className="auth-success-link">
                    Back to login
                </Link>
            </section>
        </main>
    );
};

export default AuthSuccess;
