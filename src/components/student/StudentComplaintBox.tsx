import React, { useState, useRef, useContext } from 'react';
import { Card } from 'primereact/card';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { createComplaint, getRoomComplaints } from '../../services/StudentService';
import { StudentContext } from './StudentHome';
import { formatDateWithTime } from '../interfaces/Date';

const StudentComplaintBox = () => {
    const [complaintText, setComplaintText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [roomComplaints, setRoomComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useRef<Toast>(null);
    const context = useContext(StudentContext);
    const student = context ? context.student : null;

    const fetchRoomComplaints = async () => {
        if (student?._id) {
            setLoading(true);
            const data = await getRoomComplaints(student._id);
            if (data && data.success) {
                setRoomComplaints(data.data);
            }
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchRoomComplaints();
    }, [student]);

    const handleSubmit = async () => {
        if (!student) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Student data not loaded yet.' });
            return;
        }

        if (!complaintText.trim()) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Please enter your complaint.' });
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await createComplaint({
                studentId: student._id,
                complaintText: complaintText
            });

            if (result && result.success) {
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Complaint submitted successfully!' });
                setComplaintText('');
                fetchRoomComplaints();
            } else {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: result?.message || 'Failed to submit complaint.' });
            }
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'An unknown error occurred.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <Card title="Issue Complaint" className="shadow-2">
                <div className="p-fluid">
                    <div className="field">
                        <label htmlFor="complaint" className="font-bold">Describe your issue</label>
                        <InputTextarea
                            id="complaint"
                            value={complaintText}
                            onChange={(e) => setComplaintText(e.target.value)}
                            rows={5}
                            cols={30}
                            autoResize
                            placeholder="Enter your complaint here..."
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="flex justify-content-end">
                        <Button
                            label={isSubmitting ? "Submitting..." : "Submit Complaint"}
                            icon="pi pi-send"
                            onClick={handleSubmit}
                            loading={isSubmitting}
                            disabled={!complaintText.trim() || isSubmitting}
                        />
                    </div>
                </div>
            </Card>

            <Card title="Room Complaint History" className="shadow-2 mt-4">
                <DataTable value={roomComplaints} loading={loading} paginator rows={5} emptyMessage="No complaints found for this room.">
                    <Column field="complaintText" header="Complaint" style={{ width: '50%' }}></Column>
                    <Column field="studentName" header="Raised By"></Column>
                    <Column field="status" header="Status" body={(rowData) => <Tag value={rowData.status} severity={getSeverity(rowData.status)} />}></Column>
                    <Column field="createdAt" header="Date" body={(rowData) => formatDateWithTime(new Date(rowData.createdAt))}></Column>
                    <Column header="Resolved By" body={(rowData) => rowData.resolvedBy ? `${rowData.resolvedBy}` : '-'}></Column>
                </DataTable>
            </Card>

            <Card className="mt-4 p-3 border-1 surface-border">
                <h4>Debug Info (Remove after checking)</h4>
                <p><strong>Student ID:</strong> {student?._id || 'Not Loaded'}</p>
                <p><strong>Room No:</strong> {student?.roomNo || 'N/A'}</p>
                <p><strong>Hostel ID:</strong> {student?.hostelId || 'N/A'}</p>
                <p><strong>Complaints Fetched:</strong> {roomComplaints?.length || 0}</p>
            </Card>
        </div >
    );
};

const getSeverity = (status: string) => {
    switch (status) {
        case 'Issue Solved': return 'success';
        case 'Issue Recognized': return 'warning';
        case 'Issue Canceled': return 'danger';
        default: return 'info';
    }
};

export default StudentComplaintBox;
