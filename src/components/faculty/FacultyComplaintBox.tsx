import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { getComplaints } from '../../services/InchargeService';
import { formatDateWithTime } from '../interfaces/Date';

const FacultyComplaintBox = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        college: 'ALL',
        status: 'ALL'
    });
    const toast = useRef<Toast>(null);
    // Since Faculty context wasn't readily available, I'll default the name. 
    // Ideally we'd decode the token or fetch the profile. 
    // const facultyName = "Faculty Member";

    const colleges = [
        { label: 'All Colleges', value: 'ALL' },
        { label: 'NEC', value: 'NEC' },
        { label: 'NIT', value: 'NIT' },
        { label: 'NIPS', value: 'NIPS' }
    ];

    const statuses = [
        { label: 'All Statuses', value: 'ALL' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Issue Solved', value: 'Issue Solved' },
        { label: 'Issue Recognized', value: 'Issue Recognized' },
        { label: 'Issue Canceled', value: 'Issue Canceled' }
    ];

    const fetchComplaints = useCallback(async () => {
        setLoading(true);
        const data = await getComplaints(filters.college, filters.status);
        if (data && data.success) {
            setComplaints(data.data);
        }
        setLoading(false);
    }, [filters]);

    useEffect(() => {
        fetchComplaints();
    }, [fetchComplaints]);

    const statusBodyTemplate = (rowData: any) => {
        const severity = getSeverity(rowData.status);
        return <Tag value={rowData.status} severity={severity} />;
    };

    const getSeverity = (status: string) => {
        switch (status) {
            case 'Issue Solved': return 'success';
            case 'Issue Recognized': return 'warning';
            case 'Issue Canceled': return 'danger';
            default: return 'info';
        }
    };

    const dateTemplate = (rowData: any) => {
        return formatDateWithTime(new Date(rowData.createdAt));
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <Card title="Complaint Box" className="mb-3">
                <div className="flex gap-3 mb-3">
                    <Dropdown
                        value={filters.college}
                        options={colleges}
                        onChange={(e) => setFilters({ ...filters, college: e.value })}
                        placeholder="Select College"
                    />
                    <Dropdown
                        value={filters.status}
                        options={statuses}
                        onChange={(e) => setFilters({ ...filters, status: e.value })}
                        placeholder="Select Status"
                    />
                    <Button
                        onClick={fetchComplaints}
                        tooltip="Refresh"
                        rounded
                        outlined
                        icon="pi pi-refresh"
                    />
                </div>
            </Card>

            <DataTable value={complaints} loading={loading} paginator rows={10} emptyMessage="No complaints found.">
                <Column field="studentName" header="Student Name" sortable></Column>
                <Column field="rollNo" header="Roll No" sortable></Column>
                <Column field="roomNo" header="Room No" sortable></Column>
                <Column field="college" header="College" sortable></Column>
                <Column field="year" header="Year" sortable></Column>
                <Column field="complaintText" header="Complaint" style={{ width: '30%' }}></Column>
                <Column field="createdAt" header="Date" body={dateTemplate} sortable></Column>
                <Column field="status" header="Status" body={statusBodyTemplate} sortable></Column>
            </DataTable>
        </div>
    );
};

export default FacultyComplaintBox;
