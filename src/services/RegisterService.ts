import axios from "axios";
import { Student } from "../components/interfaces/Student";
import { Incharge } from "../components/interfaces/Incharge";
import { Admin } from "../components/interfaces/Admin";
import api from "../utils/Api";

const server = process.env.REACT_APP_SERVER;

export { };

const VerifyStudentRegister = async (rollnumber: string) => {
  try {
    const response = await api.get(
      `/student/register/${rollnumber}`
    );
    return response.data;
  } catch (err) {
    console.log("error : while verifying student registeration", err);
  }
};

const RegisterStudent = async (
  rollnumber: string,
  student: Student,
  password: string
) => {
  try {
    const response = await api.post(
      `/student-auth/register-student`,
      { rollNo: rollnumber, hosteler: student, password: password }
    );
    // console.log(response)
    return response.data;
  } catch (err) {
    console.log("Error : while registering student ", err);
  }
};

const AdminInchargeRegisteration = async (
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
    console.log("Error : while creating new incharge", err);
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
    console.log("Error : while creating new admin", err);
  }
};

const AdminStudentRegisteration = async (newStudent: Student
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
    console.log("Error : while adding new student ", err);
    throw err;
  }
};

export {
  VerifyStudentRegister,
  RegisterStudent,
  AdminInchargeRegisteration,
  AdminStudentRegisteration,
};
