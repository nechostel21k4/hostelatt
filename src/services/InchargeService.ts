import api from "../utils/Api";


export const getIncharge = async (eid: string) => {
    try {
        const response = await api.get(`/incharge/${eid}`);
        return response.data
    } catch (error) {
        throw error;
    }
}

export const getAllStudents = async (data: any) => {
    try {
        const response = await api.post(`/student/getAll`, data);
        return response.data
    } catch (error) {
        throw error;
    }
}


export const getPendingRequests = async (hostelId: string) => {
    try {
        const response = await api.get(`/requests/pending/${hostelId}`);
        return response.data
    } catch (error) {
        throw error;
    }
}



export const AcceptORRejectRequest = async (id: string, request: any) => {
    try {
        const response = await api.post(`/requests/approve/${id}`, request);
        return response.data
    } catch (error) {
        throw error;
    }
}


export const getActiveRequests = async (hostelId: string) => {
    try {
        const response = await api.get(`/requests/activeRequest/${hostelId}`);
        return response.data
    } catch (error) {
        throw error;
    }
}

export const ArriveRequest = async (id: string, data: any) => {
    try {
        const response = await api.post(`/requests/arrive/${id}`, data);
        return response.data
    } catch (error) {
        throw error;
    }
}

export const getArrivedRequests = async (hostelId: string, startDate: Date, endDate: Date) => {
    try {
        const response = await api.post(`/requests/getArrivedRequests/${hostelId}`, { startDate: startDate, endDate: endDate });
        return response.data
    } catch (error) {
        throw error;
    }
}

export const getTotalHostelStats = async (hostelId: string) => {
    try {
        const response = await api.get(`/student/get/counts/${hostelId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getTodayAcceptedHostelStats = async (hostelId: string) => {
    try {
        const response = await api.get(`/requests/getTodayAcceptedRequests/${hostelId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getTodayArrivedHostelStats = async (hostelId: string) => {
    try {
        const response = await api.get(`/requests/getTodayArrivedRequests/${hostelId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const AcceptedHistory = async (hostelId: string, startDate: Date, endDate: Date) => {
    try {
        const response = await api.post(`/requests/getAcceptedRequests/${hostelId}`, { startDate: startDate, endDate: endDate });
        return response.data
    } catch (error) {
        throw error;
    }
}


export const getCollegeYearWiseData = async (hostelId: string) => {
    try {
        const response = await api.get(`/student/get/countsByClg/${hostelId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}



export const getComplaints = async (college?: string, status?: string) => {
    try {
        const response = await api.get(`/complaint/all?college=${college || 'ALL'}&status=${status || 'ALL'}`);
        return response.data;
    } catch (err) {
        throw err;
    }
};

export const updateComplaintStatus = async (id: string, status: string, resolvedBy: string) => {
    try {
        const response = await api.put(`/complaint/update/${id}`, { status, resolvedBy });
        return response.data;
    } catch (err) {
        throw err;
    }
};

export const deleteComplaint = async (id: string) => {
    try {
        const response = await api.delete(`/complaint/delete/${id}`);
        return response.data;
    } catch (err) {
        throw err;
    }
};

export { }