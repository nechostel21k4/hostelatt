import api from "../utils/Api";


export const getAllColleges = async () => {
  try {
    const response = await api.get(`/schemas/getColleges`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const AddandGetAllColleges = async () => {
  try {
    const response = await api.get(`/schemas/addGetColleges`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCollegeData = async (data: any, id: string) => {
  try {
    const response = await api.post(`/schemas/updateCollegeById/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const deleteCollegeData = async (id: string) => {
  try {
    const response = await api.delete(`/schemas/deleteCollegeById/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};



export const getAllBranches = async () => {
  try {
    const response = await api.get(`/schemas/getBranches`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const AddandGetAllBranches = async () => {
  try {
    const response = await api.get(`/schemas/addGetBranches`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBranchData = async (data: any, id: string) => {
  try {
    const response = await api.post(`/schemas/updateBranchById/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const deleteBranchData = async (id: string) => {
  try {
    const response = await api.delete(`/schemas/deleteBranchById/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllHostels = async () => {
  try {
    const response = await api.get(`/schemas/getHostels`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const AddandGetAllHostels = async () => {
  try {
    const response = await api.get(`/schemas/addGetHostels`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateHostelData = async (data: any, id: string) => {
  try {
    const response = await api.post(`/schemas/updateHostelById/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteHostelData = async (id: string) => {
  try {
    const response = await api.delete(`/schemas/deleteHostelById/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

