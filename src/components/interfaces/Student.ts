import { Leave, Permission } from "./Request";

export interface Student {
    _id?: string,

    hostelId: "BH1" | "GH1" | string,
    roomNo: string,
    rollNo: string,
    name: string,
    college: "NEC" | "NIPS" | string,
    year: 1 | 2 | 3 | 4 | number | string,
    branch: "CSE" | "ECE" | "EEE" | "MECH" | "CIVIL" | "MBA" | string,
    gender: "MALE" | "FEMALE" | "OTHER" | string,
    phoneNo: string,
    email: string,
    parentName: string,
    parentPhoneNo: string,
    currentStatus: "HOSTEL" | "PERMISSION" | "LEAVE",
    requestCount: number,
    lastRequest: Permission | Leave | null,
}

export { }