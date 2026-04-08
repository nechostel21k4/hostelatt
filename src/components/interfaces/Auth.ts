import { JwtPayload } from "jwt-decode";

export interface CustomStudentJwtPayload extends JwtPayload {
    rollNo: string;
    studentId: string;
}
