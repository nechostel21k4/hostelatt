import React, { useState, useEffect, useContext, useRef } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { getComplaints, updateComplaintStatus, deleteComplaint } from '../../services/AdminService';
import { AdminContext } from './AdminHome';
import { formatDateWithTime } from '../interfaces/Date';

const AdminComplaintBox = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        college: 'ALL',
        status: 'ALL'
    });
    const context = useContext(AdminContext);
    const { admin } = context || {};
    const toast = useRef<Toast>(null);

    const colleges = [
        { label: 'All Colleges', value: 'ALL' },
        { label: 'NEC', value: 'NEC' },
        { label: 'NIT', value: 'NIT' },
        { label: 'NIPS', value: 'NIPS' },
        { label: 'BH1', value: 'BH1' },
        { label: 'GH1', value: 'GH1' }
    ];

    const statuses = [
        { label: 'All Statuses', value: 'ALL' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Issue Solved', value: 'Issue Solved' },
        { label: 'Issue Recognized', value: 'Issue Recognized' },
        { label: 'Issue Canceled', value: 'Issue Canceled' }
    ];

    const fetchComplaints = async () => {
        setLoading(true);
        const data = await getComplaints(filters.college, filters.status);
        if (data && data.success) {
            setComplaints(data.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchComplaints();
    }, [filters]);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        const result = await updateComplaintStatus(id, newStatus, admin?.name || 'Admin');
        if (result && result.success) {
            toast.current?.show({ severity: 'success', summary: 'Success', detail: `Complaint marked as ${newStatus}` });
            fetchComplaints();
        } else {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to update status' });
        }
    };

    const handleDelete = async (id: string) => {
        confirmDialog({
            message: 'Are you sure you want to delete this complaint?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                const result = await deleteComplaint(id);
                if (result && result.success) {
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Complaint deleted' });
                    fetchComplaints();
                } else {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete complaint' });
                }
            }
        });
    };

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

    const actionBodyTemplate = (rowData: any) => {
        if (rowData.status === 'Issue Solved' || rowData.status === 'Issue Canceled') {
            return (
                <div className="flex align-items-center gap-2">
                    <span className="mr-2">{rowData.status === 'Issue Canceled' ? 'Canceled by' : 'Resolved by'} {rowData.resolvedBy}</span>
                    <Button
                        severity="danger"
                        tooltip="Delete"
                        onClick={() => handleDelete(rowData._id)}
                        rounded
                        text
                    >
                        <i className="pi pi-trash" />
                    </Button>
                </div>
            );
        }

        return (
            <div className="flex gap-2">
                <Button
                    severity="success"
                    tooltip="Issue Solved"
                    onClick={() => handleStatusUpdate(rowData._id, 'Issue Solved')}
                    rounded
                    text
                >
                    <i className="pi pi-check" />
                </Button>
                <Button
                    severity="warning"
                    tooltip="Issue Recognized"
                    onClick={() => handleStatusUpdate(rowData._id, 'Issue Recognized')}
                    rounded
                    text
                >
                    <i className="pi pi-exclamation-circle" />
                </Button>
                <Button
                    severity="danger"
                    tooltip="Issue Canceled"
                    onClick={() => handleStatusUpdate(rowData._id, 'Issue Canceled')}
                    rounded
                    text
                >
                    <i className="pi pi-times" />
                </Button>
                <Button
                    severity="danger"
                    tooltip="Delete"
                    onClick={() => handleDelete(rowData._id)}
                    rounded
                    text
                >
                    <i className="pi pi-trash" />
                </Button>
            </div>
        );
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
                    >
                        <i className="pi pi-refresh" />
                    </Button>
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
                <Column header="Actions" body={actionBodyTemplate} style={{ minWidth: '150px' }}></Column>
            </DataTable>
        </div>
    );
};

export default AdminComplaintBox;
