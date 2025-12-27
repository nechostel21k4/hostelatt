import api from "../utils/Api";

const server = process.env.REACT_APP_SERVER;

export const getAllColleges = async () => {
  try {
    const response = await api.get(`${server}/schemas/getColleges`);
    return response.data;
  } catch (error) {
    console.log("Error : while fetching All college names ", error);
  }
};

export const AddandGetAllColleges = async () => {
  try {
    const response = await api.get(`${server}/schemas/addGetColleges`);
    return response.data;
  } catch (error) {
    console.log("Error : while adding and fetching All college names ", error);
  }
};

export const updateCollegeData = async (data: any, id: string) => {
  try {
    const response = await api.post(`${server}/schemas/updateCollegeById/${id}`, data);
    return response.data;
  } catch (error) {
    console.log("Error : while Updating college data ", error);
  }
};


export const deleteCollegeData = async (id: string) => {
  try {
    const response = await api.delete(`${server}/schemas/deleteCollegeById/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error : while Deleting college data ", error);
  }
};



export const getAllBranches = async () => {
  try {
    const response = await api.get(`${server}/schemas/getBranches`);
    return response.data;
  } catch (error) {
    console.log("Error : while fetching All Branch names ", error);
  }
};

export const AddandGetAllBranches = async () => {
  try {
    const response = await api.get(`${server}/schemas/addGetBranches`);
    return response.data;
  } catch (error) {
    console.log("Error : while adding and fetching All branch names ", error);
  }
};

export const updateBranchData = async (data: any, id: string) => {
  try {
    const response = await api.post(`${server}/schemas/updateBranchById/${id}`, data);
    return response.data;
  } catch (error) {
    console.log("Error : while Updating branch data ", error);
  }
};


export const deleteBranchData = async (id: string) => {
  try {
    const response = await api.delete(`${server}/schemas/deleteBranchById/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error : while Deleting branch data ", error);
  }
};

export const getAllHostels = async () => {
  try {
    const response = await api.get(`${server}/schemas/getHostels`);
    return response.data;
  } catch (error) {
    console.log("Error : while fetching All Hostel names ", error);
  }
};

export const AddandGetAllHostels = async () => {
  try {
    const response = await api.get(`${server}/schemas/addGetHostels`);
    return response.data;
  } catch (error) {
    console.log("Error : while adding and fetching All hostel names ", error);
  }
};

export const updateHostelData = async (data: any, id: string) => {
  try {
    const response = await api.post(`${server}/schemas/updateHostelById/${id}`, data);
    return response.data;
  } catch (error) {
    console.log("Error : while Updating hostel data ", error);
  }
};

export const deleteHostelData = async (id: string) => {
  try {
    const response = await api.delete(`${server}/schemas/deleteHostelById/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error : while Deleting hostel data ", error);
  }
};

