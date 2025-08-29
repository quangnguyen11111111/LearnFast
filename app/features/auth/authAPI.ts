import type { promises } from "dns";
import axiosClient from "../../services/axiosClient";

export type LoginResponse = {
  user: { id: string; email: string  ; name?: string;};
  token: string;

};

// const authAPI = {
//   login: (credentials: { email: string; password: string }) =>
//     axiosClient.post<LoginResponse>("/auth/login", credentials)
// };
const authAPI = {
  login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    console.log("Fake login with:", credentials);

    // giả lập delay
    await new Promise((r) => setTimeout(r, 1000));

    return {
      token: "fake-jwt-token-123",
      user: {
        id: "1",
        name: "Phúc Dev",
        email: credentials.email,
      },
    };
  },
};
// Api login with google
export const loginWithGoogleApi = (data:any)=>axiosClient.post("/api/loginWithGoogle",data)
export const refreshTokenApi = <T>(token:string):Promise<T>=>
  axiosClient.post("/api/refreshToken", { refreshToken: token });
export default authAPI;
