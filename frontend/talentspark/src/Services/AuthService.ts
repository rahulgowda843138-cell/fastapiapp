import api from "./api";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../types/user";


// ----------------------
// Login
// ----------------------
export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const formData = new URLSearchParams();

  // FastAPI OAuth2PasswordRequestForm expects "username"
  formData.append("username", credentials.email);
  formData.append("password", credentials.password);

  const response = await api.post<LoginResponse>(
    "/auth/login",
    formData,
    {
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
    }
  );

  localStorage.setItem(
    "token",
    response.data.access_token
  );

  return response.data;
};

// ----------------------
// Register
// ----------------------
export const register = async (
  user: RegisterRequest
): Promise<RegisterResponse> => {
  const response =
    await api.post<RegisterResponse>(
      "/auth/register",
      user
    );

  return response.data;
};