import api from "../utils/Api";

const server = process.env.REACT_APP_SERVER;

export { };

const AuthenticateStudentLogin = async (username: string, password: string) => {
  try {
    const response = await api.post(
      `/student-auth/login`,
      { rollNo: username, password: password }
    );
    return response.data;
  } catch (err) {
    console.log("Error : while authenticating student")
  }
};

const AuthenticateInchargeLogin = async (
  username: string,
  password: string
) => {
  try {
    const response = await api.post(
      `/incharge-auth/login`,
      { eid: username, password: password }
    );
    return response.data;
  } catch (err) {
    console.log("there is some error");
  }
};

const VerifyStuFPassMail = async (rollNo: string) => {
  try {
    const response = await api.get(`/student/verify/${rollNo}`);

    return response.data;
  } catch (err) {
    console.log("Error : while verifying student roll no ", err);
  }
};

export const VerifyStuOTP = async (rollNo: string, otp: string) => {
  try {
    const response = await api.post(
      `/student-auth/verifyOTP`,
      { rollNo: rollNo, otp: otp }
    );
    return response.data;
  } catch (err) {
    console.log("Error : while verifying student OTP ", err);
  }
};

const UpdateStuNewPassword = async (rollNo: string, password: string) => {
  try {
    const response = await api.put(
      `/student-auth/update-password`,
      { rollNo: rollNo, newPassword: password }
    );

    return response.data;
  } catch (err) {
    console.log("Error : while updating student new password ", err);
  }
};

export const VerifyINCFPassMail = async (eid: string) => {
  try {
    const response = await api.get(`/incharge/verify/${eid}`);
    return response.data;
  } catch (err) {
    console.log("Error : while verifying Incharge id ", err);
  }
};

export const VerifyINCOTP = async (eid: string, otp: string) => {
  try {
    const response = await api.post(
      `/incharge-auth/verifyOTP`,
      { eid: eid, otp: otp }
    );
    return response.data;
  } catch (err) {
    console.log("Error : while verifying Incharge OTP ", err);
  }
};

export const UpdateINCNewPassword = async (eid: string, password: string) => {
  try {
    const response = await api.put(
      `/incharge-auth/update-password`,
      { eid: eid, newPassword: password }
    );

    return response.data;
  } catch (err) {
    console.log("Error : while updating incharge new password ", err);
  }
};

export const VerifyADMINFPassMail = async (eid: string) => {
  try {
    const response = await api.get(`/admin/verify/${eid}`);
    return response.data;
  } catch (err) {
    console.log("Error : while verifying Admin id ", err);
  }
};

export const VerifyADMINOTP = async (eid: string, otp: string) => {
  try {
    const response = await api.post(
      `/admin-auth/verifyOTP`,
      { eid: eid, otp: otp }
    );
    return response.data;
  } catch (err) {
    console.log("Error : while verifying Admin OTP ", err);
  }
};

export const UpdateADMINNewPassword = async (eid: string, password: string) => {
  try {
    const response = await api.put(
      `/admin-auth/update-password`,
      { eid: eid, newPassword: password }
    );

    return response.data;
  } catch (err) {
    console.log("Error : while updating admin new password ", err);
  }
};



export const AuthenticateAdminLogin = async (eid: string, password: string) => {
  try {
    const response = await api.post(
      `/admin-auth/login`,
      { eid: eid, password: password }
    );
    return response.data;
  } catch (err) {
    console.log("there is some error");
  }
};

export const AuthenticateFacultyLogin = async (
  username: string,
  password: string
) => {
  try {
    const response = await api.post(
      `/faculty/login`,
      { username: username, password: password }
    );

    return response.data;
  } catch (err) {
    console.log("Error : while  Faculty login ", err);
  }
};

export {
  AuthenticateStudentLogin,
  AuthenticateInchargeLogin,
  VerifyStuFPassMail,
  UpdateStuNewPassword,
};
