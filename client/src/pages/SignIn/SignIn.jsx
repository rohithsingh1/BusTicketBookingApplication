import {useActionState, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import "./SignIn.css";
import {UserIcon, LockIcon, EyeOffIcon, EyeIcon, GoogleIcon} from "../../assets/icons/svgIcons";
import {
    getGoogleAuthorizationUrl,
    loginWithCredentials,
} from "../../services/authService";

const EMAIL_PATTERN=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialCredentials={
    email: "",
    password: "",
};

const validateCredentials=(credentials) => {
    const errors={};

    if (!credentials.email.trim()) {
        errors.email="Email is required.";
    } else if (!EMAIL_PATTERN.test(credentials.email.trim())) {
        errors.email="Please enter a valid email address.";
    }

    if (!credentials.password) {
        errors.password="Password is required.";
    } else if (credentials.password.length<3) {
        errors.password="Password must be at least 3 characters.";
    } else if (credentials.password.length>50) {
        errors.password="Password must be at most 50 characters.";
    }

    return errors;
};

const SignIn=() => {
    const navigate=useNavigate();
    const [formValues, setFormValues]=useState(initialCredentials);
    const [fieldErrors, setFieldErrors]=useState({});
    const [showPassword, setShowPassword]=useState(false);
    const [isGoogleLoading, setIsGoogleLoading]=useState(false);
    const [googleAuthError, setGoogleAuthError]=useState("");
    const [loginError, setLoginError]=useState("");

    const [, submitCredentials, isPending]=useActionState(
        async (_, formData) => {
            const nextCredentials={
                email: String(formData.get("email")||""),
                password: String(formData.get("password")||""),
            };

            const validationErrors=validateCredentials(nextCredentials);

            if (Object.keys(validationErrors).length>0) {
                setFieldErrors(validationErrors);
                setLoginError("");
                return nextCredentials;
            }

            try {
                setFieldErrors({});
                setLoginError("");
                await loginWithCredentials(nextCredentials);
                navigate("/auth/success");
            } catch (error) {
                const errorMessage=
                    error?.response?.data?.message||
                    error?.message||
                    "Unable to sign in right now.";

                setLoginError(errorMessage);
            }

            return nextCredentials;
        },
        initialCredentials,
    );

    const handleInputChange=(event) => {
        const {name, value}=event.target;

        setFormValues((currentValues) => ({
            ...currentValues,
            [name]: value,
        }));

        setFieldErrors((currentErrors) => {
            if (!currentErrors[name]) {
                return currentErrors;
            }

            const nextErrors={...currentErrors};
            delete nextErrors[name];
            return nextErrors;
        });
    };

    const handleGoogleSignIn=async () => {
        try {
            setIsGoogleLoading(true);
            setGoogleAuthError("");

            const authorizationUrl=await getGoogleAuthorizationUrl();
            window.location.assign(authorizationUrl);
        } catch (error) {
            const errorMessage=
                error?.response?.data?.message||
                error?.message||
                "Unable to start Google sign in right now.";

            setGoogleAuthError(errorMessage);
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <main className="signin-page">
            <div className="signin-card">
                <h1 className="signin-title">Sign in</h1>
                <p className="signin-subtitle">Welcome back. Please enter your details.</p>

                <form className="signin-form" action={submitCredentials} noValidate>
                    <div className="signin-field">
                        <label htmlFor="email" className="signin-label">Email</label>
                        <div className="signin-input-wrapper">
                            <span className="signin-input-icon"><UserIcon /></span>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className={`signin-input ${fieldErrors.email? "signin-input--error":""}`}
                                placeholder="email"
                                value={formValues.email}
                                onChange={handleInputChange}
                                autoComplete="email"
                                required
                            />
                        </div>
                        {fieldErrors.email? (
                            <p className="signin-field-error" role="alert">
                                {fieldErrors.email}
                            </p>
                        ):null}
                    </div>

                    <div className="signin-field">
                        <label htmlFor="password" className="signin-label">Password</label>
                        <div className="signin-input-wrapper">
                            <span className="signin-input-icon"><LockIcon /></span>
                            <input
                                id="password"
                                name="password"
                                type={showPassword? "text":"password"}
                                className={`signin-input ${fieldErrors.password? "signin-input--error":""}`}
                                placeholder="••••••••"
                                value={formValues.password}
                                onChange={handleInputChange}
                                autoComplete="current-password"
                                required
                            />
                            <button
                                type="button"
                                className="signin-input-toggle"
                                onClick={() => setShowPassword((s) => !s)}
                                aria-label={showPassword? "Hide password":"Show password"}
                            >
                                {showPassword? <EyeIcon />:<EyeOffIcon />}
                            </button>
                        </div>
                        {fieldErrors.password? (
                            <p className="signin-field-error" role="alert">
                                {fieldErrors.password}
                            </p>
                        ):null}
                    </div>

                    <button type="submit" className="signin-submit" disabled={isPending}>
                        {isPending? "Signing in...":"Sign in"}
                    </button>

                    {loginError? (
                        <p className="signin-error" role="alert">
                            {loginError}
                        </p>
                    ):null}

                    <div className="signin-divider">or</div>

                    <button
                        type="button"
                        className="signin-google"
                        onClick={handleGoogleSignIn}
                        disabled={isGoogleLoading}
                    >
                        <GoogleIcon />
                        <span>{isGoogleLoading? "Redirecting to Google...":"Sign in with Google"}</span>
                    </button>

                    {googleAuthError? (
                        <p className="signin-error" role="alert">
                            {googleAuthError}
                        </p>
                    ):null}

                    <p className="signin-switch-text">
                        Don&apos;t have an account?{" "}
                        <Link to="/register" className="signin-switch-link">
                            Sign Up
                        </Link>
                    </p>
                </form>
            </div>
        </main>
    );
};

export default SignIn;
