import apiClient from "../lib/apiClient";

export const loginWithCredentials=async (credentials) => {
    const response=await apiClient.post("/auth/login", credentials);
    return response.data;
};

export const SignUpWithCredentials=async (credentials) => {
    const response=await apiClient.post("/auth/signup", credentials);
    return response.data;
};

export const getGoogleAuthorizationUrl=async () => {
    const response=await apiClient.get("/auth/google");

    const authorizationUrl=response?.data?.data?.authorizationUrl;

    if (!authorizationUrl) {
        throw new Error("Google authorization URL was not returned by the server.");
    }

    return authorizationUrl;
};
