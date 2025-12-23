import { updateStudentProfile } from "./StudentService";
import api from "../utils/Api";


const server = process.env.REACT_APP_SERVER;

export const getIncharge = async (eid: string) => {
    try {
        const response = await api.get(`${server}/incharge/${eid}`);
        return response.data
    } catch (error) {
        console.log("Error : while getting Incharge details", error)
    }
}

export const getAllStudents = async (data: any) => {
    try {
        const response = await api.post(`${server}/student/getAll`, data);
        return response.data
    } catch (error) {
        console.log("Error : while getting All students details", error)
    }
}


export const getPendingRequests = async (hostelId: string) => {
    try {
        const response = await api.get(`${server}/requests/pending/${hostelId}`);
        return response.data
    } catch (error) {
        console.log("Error : while getting Pending Requests", error)
    }
}



export const AcceptORRejectRequest = async (id: string, request: any) => {
    try {
        const response = await api.post(`${server}/requests/approve/${id}`, request);
        return response.data
    } catch (error) {
        console.log("Error : while updating Pending Requests", error)
    }
}


export const getActiveRequests = async (hostelId: string) => {
    try {
        const response = await api.get(`${server}/requests/activeRequest/${hostelId}`);
        return response.data
    } catch (error) {
        console.log("Error : while getting Active Requests", error)
    }
}

export const ArriveRequest = async (id: string, data: any) => {

    try {
        const response = await api.post(`${server}/requests/arrive/${id}`, data);
        return response.data
    } catch (error) {
        console.log("Error : while updating Arrive Requests", error)
    }
}

export const getArrivedRequests = async (hostelId: string, startDate: Date, endDate: Date) => {
    try {
        const response = await api.post(`${server}/requests/getArrivedRequests/${hostelId}`, { startDate: startDate, endDate: endDate });
        return response.data
    } catch (error) {
        console.log("Error : while getting Arrive Requests", error)
    }

}

export const getTotalHostelStats = async (hostelId: string) => {
    try {
        const response = await api.get(`${server}/student/get/counts/${hostelId}`);
        return response.data;
    } catch (error) {
        console.log("Error : while getting hostel statistics", error)
    }
}

export const getTodayAcceptedHostelStats = async (hostelId: string) => {
    try {
        const response = await api.get(`${server}/requests/getTodayAcceptedRequests/${hostelId}`);
        return response.data;
    } catch (error) {
        console.log("Error : while getting Today Accepted hostel statistics", error)
    }
}

export const getTodayArrivedHostelStats = async (hostelId: string) => {
    try {
        const response = await api.get(`${server}/requests/getTodayArrivedRequests/${hostelId}`);
        return response.data;
    } catch (error) {
        console.log("Error : while getting Today Arrived hostel statistics", error)
    }
}

export const AcceptedHistory = async (hostelId: string, startDate: Date, endDate: Date) => {
    try {
        const response = await api.post(`${server}/requests/getAcceptedRequests/${hostelId}`, { startDate: startDate, endDate: endDate });
        return response.data
    } catch (error) {
        console.log("Error : while getting Accepted History", error)
    }
}


export const getCollegeYearWiseData = async (hostelId: string) => {
    try {
        const response = await api.get(`${server}/student/get/countsByClg/${hostelId}`);
        return response.data;
    } catch (error) {
        console.log("Error : while getting Colleges  year wise data", error)
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

export { }