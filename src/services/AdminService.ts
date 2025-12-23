import { Incharge } from "../components/interfaces/Incharge";
import { Student } from "../components/interfaces/Student";
import { LOG } from "../components/interfaces/Log";
import { Admin } from "../components/interfaces/Admin";
import api, { getExistingToken } from "../utils/Api";

const server = process.env.REACT_APP_SERVER;

export const getAdmin = async (eid: string) => {
  try {
    const response = await api.get(`/admin/getadmin/${eid}`);
    return response.data;
  } catch (error) {
    console.log("Error : while getting Admin details", error);
  }
};

export const updateIncharge = async (incharge: Incharge) => {
  try {
    const response = await api.put(
      `/incharge/update/${incharge.eid}`,
      incharge,
      {
        headers: {
          "Content-Type": "application/json",

        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error : while Updating Incharge details", error);
  }
};

export const deleteIncharge = async (eid: string) => {
  try {
    const response = await api.delete(`/incharge/delete/${eid}`);
    return response.data;
  } catch (error) {
    console.log("Error : while Deleting Incharge details", error);
  }
};

export const UploadStudentBulkData = async (students: any) => {
  try {
    const response = await api.post(
      `/upload/addStudents`,
      students
    );
    return response.data;
  } catch (error) {
    console.log("Error : while Uploading student bulk data", error);
  }
};

export const adminUpdateStudentProfile = async (student: Student) => {
  try {
    const response = await api.put(
      `/student/update/${student.rollNo.toUpperCase()}`,
      student
    );
    return response.data;
  } catch (error) {
    console.log("Error : while updating student", error);
  }
};

export const deleteStudent = async (rollNo: string) => {
  try {
    const response = await api.delete(`/student/delete/${rollNo}`);
    return response.data;
  } catch (error) {
    console.log("Error : while Deleting Student details", error);
  }
};

export const createLog = async (newLog: LOG) => {
  try {
    const response = await api.post(`/logs/add-log`, newLog);
    return response.data;
  } catch (error) {
    console.log("Error : while creating a log", error);
  }
};

export const getLogs = async (date: Date) => {
  try {
    const response = await api.post(
      `/logs/getLogs`,
      { date: date }
    );
    return response.data;
  } catch (error) {
    console.log("Error : while getting Log data", error);
  }
};

export const getAllAdmins = async () => {
  try {
    const response = await api.get(`/admin/getAdmins`);
    return response.data;
  } catch (error) {
    console.log("Error : While getting all admins data", error);
  }
};

export const updateAdmin = async (admin: Admin) => {
  try {
    const response = await api.put(
      `/admin/update/${admin.eid}`,
      admin
    );
    return response.data;
  } catch (error) {
    console.log("Error : while Updating Admin details", error);
  }
};

export const deleteAdmin = async (eid: string) => {
  try {
    const response = await api.delete(`/admin/delete/${eid}`);
    return response.data;
  } catch (error) {
    console.log("Error : while Deleting Admin details", error);
  }
};

export const UpdateMultipleStudents = async (
  rollNumbers: string[],
  year: string
) => {
  try {
    const response = await api.put(
      `/student/updateMany`,
      { rollNumbers: rollNumbers, year: year }
    );
    return response.data;
  } catch (error) {
    console.log("Error : while Updating  Multiple students", error);
  }
};

export const DeleteMultipleStudents = async (rollNumbers: string[]) => {
  try {
    const response = await api.delete(`/student/deleteMany`, {
      data: { rollNumbers: rollNumbers }
    });
    return response.data;
  } catch (error) {
    console.log("Error : while Deleting Multiple students", error);
  }
};

export const FetchFacultyData = async () => {
  try {
    const response = await api.get(`/faculty/get`);
    return response.data;
  } catch (error) {
    console.log("Error : While fetching faculty credentials", error);
  }
};

export const UpdateFacultyData = async (username: string, password: string) => {
  try {
    const response = await api.put(
      `/faculty/update`,
      { username: username, password: password }
    );
    return response.data;
  } catch (error) {
    console.log("Error : while Updating  Faculty data", error);
  }
};

export const deleteLogs = async () => {
  try {
    const response = await api.delete(`/logs/delete-logs`);
    return response.data;
  } catch (error) {
    console.log("Error : while Deleting Logs", error);
  }
};

export const SendHolidayMessage = async (data: any) => {
  try {
    const response = await api.post(`/holiday/send`, data);
    return response.data;
  } catch (error) {
    console.log("Error : while Sending Holiday Messages", error);
  }
};


export const GetAllHolidayMsgs = async () => {
  try {
    const response = await api.get(`/holiday/all`);
    return response.data;
  } catch (err) {
    console.log("Error : while fetching all holiday messages", err);
  }

}

export const GetStudentsByRoomNo = async (hostelId: string, roomNo: string) => {
  try {
    const response = await api.post(`/student/roomno`, { hostelId: hostelId, roomNo: roomNo })
    return response.data
  } catch (err) {
    console.log("Error : while getting students data by room No", err);
  }
}

export const getComplaints = async (college?: string, status?: string) => {
  try {
    const response = await api.get(`/complaint/all?college=${college || 'ALL'}&status=${status || 'ALL'}`);
    return response.data;
  } catch (err) {
    console.log("Error : while fetching complaints", err);
  }
};

export const updateComplaintStatus = async (id: string, status: string, resolvedBy: string) => {
  try {
    const response = await api.put(`/complaint/update/${id}`, { status, resolvedBy });
    return response.data;
  } catch (err) {
    console.log("Error : while updating complaint status", err);
  }
};


export const deleteComplaint = async (id: string) => {
  try {
    const response = await api.delete(`/complaint/delete/${id}`);
    return response.data;
  } catch (err) {
    console.log("Error : while deleting complaint", err);
  }
};

export { };
