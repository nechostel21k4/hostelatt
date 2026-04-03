import api from "../utils/Api";

export const AuthenticateInchargeLogin = async (
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
    throw err;
  }
};



export const VerifyINCFPassMail = async (eid: string) => {
  try {
    const response = await api.get(`/incharge/verify/${eid}`);
    return response.data;
  } catch (err) {
    throw err;
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
    throw err;
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
    throw err;
  }
};

export const VerifyADMINFPassMail = async (eid: string) => {
  try {
    const response = await api.get(`/admin/verify/${eid}`);
    return response.data;
  } catch (err) {
    throw err;
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
    throw err;
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
    throw err;
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
    throw err;
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
    throw err;
  }
};


