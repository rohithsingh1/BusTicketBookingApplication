import {useActionState, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import "./SignUp.css";
import {UserIcon, LockIcon, EyeOffIcon, EyeIcon, GoogleIcon} from "../../assets/icons/svgIcons";
import {
    getGoogleAuthorizationUrl,
    SignUpWithCredentials,
} from "../../services/authService";

const EMAIL_PATTERN=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialCredentials={
    email: "",
    password: "",
    name: '',
    confirmPassword: ''
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

    if (credentials.name.length<3) {
        errors.name="UserName must be at least 3 characters.";
    } else if (credentials.name.length>50) {
        errors.name="UserName must be at most 50 characters.";
    }

    if (credentials.confirmPassword!==credentials.password) {
        errors.confirmPassword="confirm password and password should be same";
    }

    return errors;
};

const SignUp=() => {
    const navigate=useNavigate();
    const [formValues, setFormValues]=useState(initialCredentials);
    const [fieldErrors, setFieldErrors]=useState({});
    const [showPassword, setShowPassword]=useState({
        password: false,
        confirmPassword: false
    });
    const [isGoogleLoading, setIsGoogleLoading]=useState(false);
    const [googleAuthError, setGoogleAuthError]=useState("");
    const [signUpError, setSignUpError]=useState("");

    const [, submitCredentials, isPending]=useActionState(
        async (_, formData) => {
            const nextCredentials={
                email: String(formData.get("email")||"").trim(),
                password: String(formData.get("password")||"").trim(),
                name: String(formData.get("name")||"").trim(),
                confirmPassword: String(formData.get("confirmPassword")||"").trim(),
            };

            const validationErrors=validateCredentials(nextCredentials);

            console.log("validationErrors>>>>>>>", validationErrors)

            if (Object.keys(validationErrors).length>0) {
                setFieldErrors(validationErrors);
                setSignUpError("");
                return nextCredentials;
            }

            try {
                setFieldErrors({});
                setSignUpError("");
                const signupCredentials={
                    email: nextCredentials.email,
                    password: nextCredentials.password,
                    name: nextCredentials.name
                }
                await SignUpWithCredentials(signupCredentials);
                navigate("/auth/success");
            } catch (error) {
                const errorMessage=
                    error?.response?.data?.message||
                    error?.message||
                    "Unable to sign up right now.";

                setSignUpError(errorMessage);
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
                <h1 className="signin-title">Sign Up</h1>
                <p className="signin-subtitle">Welcome back. Please enter your details.</p>

                <form className="signin-form" action={submitCredentials} noValidate>

                    <div className="signin-field">
                        <label htmlFor="name" className="signin-label">UserName</label>
                        <div className="signin-input-wrapper">
                            <span className="signin-input-icon"><UserIcon /></span>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                className={`signin-input ${fieldErrors.name? "signin-input--error":""}`}
                                placeholder="UserName"
                                value={formValues.name}
                                onChange={handleInputChange}
                                autoComplete="name"
                                required
                            />
                        </div>
                        {fieldErrors.name? (
                            <p className="signin-field-error" role="alert">
                                {fieldErrors.name}
                            </p>
                        ):null}
                    </div>

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
                                type={showPassword.password? "text":"password"}
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
                                onClick={() => setShowPassword((s) => {
                                    return {
                                        ...s,
                                        password: !s.password
                                    }
                                })}
                                aria-label={showPassword.password? "Hide password":"Show password"}
                            >
                                {showPassword.password? <EyeIcon />:<EyeOffIcon />}
                            </button>
                        </div>
                        {fieldErrors.password? (
                            <p className="signin-field-error" role="alert">
                                {fieldErrors.password}
                            </p>
                        ):null}
                    </div>

                    <div className="signin-field">
                        <label htmlFor="ConfirmPassword" className="signin-label">Confirm Password</label>
                        <div className="signin-input-wrapper">
                            <span className="signin-input-icon"><LockIcon /></span>
                            <input
                                id="ConfirmPassword"
                                name="confirmPassword"
                                type={showPassword.confirmPassword? "text":"password"}
                                className={`signin-input ${fieldErrors.confirmPassword? "signin-input--error":""}`}
                                placeholder="••••••••"
                                value={formValues.confirmPassword}
                                onChange={handleInputChange}
                                autoComplete="current-password"
                                required
                            />
                            <button
                                type="button"
                                className="signin-input-toggle"
                                onClick={() => setShowPassword((s) => {
                                    return {
                                        ...s,
                                        confirmPassword: !s.confirmPassword
                                    }
                                })}
                                aria-label={showPassword.confirmPassword? "Hide password":"Show password"}
                            >
                                {showPassword.confirmPassword? <EyeIcon />:<EyeOffIcon />}
                            </button>
                        </div>
                        {fieldErrors.confirmPassword? (
                            <p className="signin-field-error" role="alert">
                                {fieldErrors.confirmPassword}
                            </p>
                        ):null}
                    </div>

                    <button type="submit" className="signin-submit" disabled={isPending}>
                        {isPending? "Signing Up...":"Sign Up"}
                    </button>

                    {signUpError? (
                        <p className="signin-error" role="alert">
                            {signUpError}
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
                        <span>{isGoogleLoading? "Redirecting to Google...":"Sign Up with Google"}</span>
                    </button>

                    {googleAuthError? (
                        <p className="signin-error" role="alert">
                            {googleAuthError}
                        </p>
                    ):null}

                    <p className="signin-switch-text">
                        Already have an account?{" "}
                        <Link to="/login" className="signin-switch-link">
                            Log in here
                        </Link>
                    </p>
                </form>
            </div>
        </main>
    );
};

export default SignUp;
