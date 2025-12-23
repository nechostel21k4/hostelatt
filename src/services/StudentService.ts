import axios from "axios";
import { Leave, Permission } from "../components/interfaces/Request";
import api, { getExistingToken } from "../utils/Api";
import { Student } from "../components/interfaces/Student";

const server = process.env.REACT_APP_SERVER;

// get current
export const getStudent = async (rollNumber: string) => {
  try {
    const response = await api.get(`${server}/student/${rollNumber}`);
    return response.data;
  } catch (error) {
    console.log("Error : while fetching the Student data", error);
  }
};


export const createRequestandUpdateStudent = async (
  student: Student,
  lastRequest: Permission | Leave | null
) => {
  if (lastRequest) {
    try {
      const response = await api.post(
        `${server}/student/createRequestAndUpdate/${student.rollNo}`,
        { student, lastRequest }
      );
      return response.data;
    } catch (err) {
      console.log("Error : while creating request and update student");
    }
  }
};

export const updateStudentProfile = async (
  rollNumber: string,
  lastRequest: any,
  currentStatus: string,
  requestCount?: number
) => {
  if (lastRequest) {
    try {
      const response = await api.put(
        `${server}/student/update/${rollNumber.toUpperCase()}`,
        {
          lastRequest: lastRequest,
          currentStatus: currentStatus,
          requestCount: requestCount,
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error : while updating student", error);
    }
  } else {
    console.log("Last Request must not be undefined");
  }
};

export const getStudentAllRequests = async (rollNumber: string) => {
  try {
    const response = await api.get(`${server}/requests/${rollNumber}`);
    return response.data;
  } catch (error) {
    console.log("Error : while fetching the Student data", error);
  }
};

export const getAllIncharges = async (hostelId: "BH1" | "GH1" | string) => {
  try {
    const response = await api.get(
      `${server}/incharge/getIncharges/${hostelId}`
    );
    return response.data;
  } catch (error) {
    console.log("Error : while fetching inchrages data", error);
  }
};

export const CancelRequest = async (id: string, request: any) => {
  try {
    const response = await api.post(`${server}/requests/cancel/${id}`, request);
    return response.data;
  } catch (error) {
    console.log("Error : while Cancelling  Request", error);
  }
};

export const getMyRoomies = async (
  hostelId: "BH1" | "GH1" | string,
  roomNo: string
) => {
  try {
    const response = await api.post(`${server}/student/getRoomies`, {
      hostelId: hostelId,
      roomNo: roomNo,
    });
    return response.data;
  } catch (error) {
    console.log("Error : while fetching Roomies data", error);
  }
};

export const createComplaint = async (complaintData: any) => {
  try {
    const studentToken = localStorage.getItem("studentToken");
    const response = await api.post(`${server}/complaint/create`, complaintData, {
      headers: {
        Authorization: `Bearer ${studentToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error : while creating complaint", error);
  }
};


export const getRoomComplaints = async (studentId: string) => {
  try {
    const response = await api.get(`/complaint/room?studentId=${studentId}`);
    return response.data;
  } catch (err) {
    console.log("Error : while fetching room complaints", err);
  }
};

export { };
