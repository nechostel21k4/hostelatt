import { Student } from "../components/interfaces/Student";
import { Incharge } from "../components/interfaces/Incharge";
import { Admin } from "../components/interfaces/Admin";
import api from "../utils/Api";



export const AdminInchargeRegisteration = async (
  newIncharge: Incharge,
  password: string
) => {
  try {
    const response = await api.post(
      `/incharge/create`,
      {
        ...newIncharge,
        password: password,
      }
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const AdminRegisteration = async (
  newAdmin: Admin,
  password: string
) => {
  try {
    const response = await api.post(
      `/admin/add-admin`,
      {
        ...newAdmin,
        password: password,
      }
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const AdminStudentRegisteration = async (newStudent: Student
) => {
  try {
    const response = await api.post(
      `/student/create`,
      {
        ...newStudent
      }
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};


