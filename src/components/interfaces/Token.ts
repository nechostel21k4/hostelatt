import { jwtDecode } from "jwt-decode";
import { CustomStudentJwtPayload } from "../StudentLogin";

export  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded = jwtDecode<CustomStudentJwtPayload & { exp: number }>(
        token
      );
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (err) {
      // console.log("Invalid Token");
      return true;
    }
  };