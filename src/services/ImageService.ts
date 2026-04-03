import api from "../utils/Api";


export const uploadImage = async (formData: any,username:string) => {
  try {
    const response = await api.post(`/upload/uploadimage/${username}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const getProfileImage = async (username: string) => {
  try {
    const response = await api.get(`/upload/getImage/` + username);
    return response.data;
  } catch (error) {
    throw error;
  }
};
