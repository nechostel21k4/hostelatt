import api from "../utils/Api";

// get current
export const getStudent = async (rollNumber: string) => {
  try {
    const response = await api.get(`/student/${rollNumber}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchStudent = async (key: string) => {
  try {
    const response = await api.get(`/student/search/${key}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStudentSuggestions = async (key: string) => {
  try {
    const response = await api.get(`/student/suggestions/${key}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStudentAllRequests = async (rollNumber: string) => {
  try {
    const response = await api.get(`/requests/${rollNumber}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllIncharges = async (hostelId: "BH1" | "GH1" | string) => {
  try {
    const response = await api.get(`/incharge/getIncharges/` + hostelId);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CancelRequest = async (id: string, request: any) => {
  try {
    const response = await api.post(`/requests/cancel/${id}`, request);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { };
