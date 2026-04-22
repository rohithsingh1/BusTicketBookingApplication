import {Suspense, lazy} from "react";
import {Navigate, Route, Routes} from "react-router-dom";

const SignIn=lazy(() => import("./pages/SignIn/SignIn"));
const AuthSuccess=lazy(() => import("./pages/AuthSuccess/AuthSuccess"));
const SignUp=lazy(() => import("./pages/SignUp/SignUp"));

const RouteFallback=() => (
    <main className="route-loading">
        <p className="route-loading__text">Loading page...</p>
    </main>
);

function App() {
    return (
        <Suspense fallback={<RouteFallback />}>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<SignIn />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/auth/success" element={<AuthSuccess />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Suspense>
    );
}

export default App;
