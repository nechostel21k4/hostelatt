import api from "../utils/Api";

const server = process.env.REACT_APP_SERVER;

export const uploadImage = async (formData: any,username:string) => {
  try {
    const response = await api.post(`${server}/upload/uploadimage/${username}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (err) {
    console.log("Error : while uploading image", err);
  }
};

export const getProfileImage = async (username: string) => {
  try {
    const response = await api.get(`${server}/upload/getImage/${username}`);
    return response.data;
  } catch (error) {
    console.log("Error : while fetching profile image", error);
  }
};
