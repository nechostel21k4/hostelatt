import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { TabView, TabPanel } from 'primereact/tabview';
import { Tag } from 'primereact/tag';
import { API_BASE_URL } from '../../config';

const AttendanceDashboard = () => {
    // State
    const [attendanceData, setAttendanceData] = useState([]);
    const [registrationData, setRegistrationData] = useState([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [selectedHostelType, setSelectedHostelType] = useState(null);

    const hostels = [
        { label: 'Boys Hostel (BH1)', value: 'BH1' },
        { label: 'Girls Hostel (GH1)', value: 'GH1' }
    ];

    // Helper to format date as YYYY-MM-DD
    const formatDate = (date: Date) => {
        if (!date) return '';
        // Handles Timezone issues simply by splitting T
        // Ideally use moment or similar, but let's stick to local date string
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset * 60 * 1000));
        return localDate.toISOString().split('T')[0];
    };

    const fetchAttendance = async () => {
        if (!selectedDate) return;
        try {
            const dateStr = formatDate(selectedDate);
            let url = `${API_BASE_URL}/attendance/daily?date=${dateStr}`;
            if (selectedHostelType) {
                url += `&hostelId=${selectedHostelType}`;
            }
            const res = await axios.get(url);
            setAttendanceData(res.data);
        } catch (error) {
            console.error("Error fetching attendance", error);
        }
    };

    const fetchRegistrationStatus = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/attendance/registration-status`);
            const data = res.data;
            if (selectedHostelType) {
                setRegistrationData(data.filter((d: any) => d.hostelId === selectedHostelType));
            } else {
                setRegistrationData(data);
            }
        } catch (error) {
            console.error("Error fetching registration status", error);
            // Fallback mock data if API fails or is empty for demo
            if (registrationData.length === 0) {
                // remove this in prod
            }
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [selectedDate, selectedHostelType]);

    useEffect(() => {
        fetchRegistrationStatus();
    }, [selectedHostelType]);

    // Templates
    const statusBodyTemplate = (rowData: any) => {
        const severity = rowData.status === 'Present' ? 'success' :
            rowData.status === 'Absent' ? 'danger' : 'warning';
        return <Tag value={rowData.status} severity={severity} />;
    };

    const matchScoreTemplate = (rowData: any) => {
        // Lower is better. 0.0 is perfect match.
        // Convert to percentage similarity maybe? (1 - score) * 100
        const percentage = Math.max(0, (1 - rowData.matchScore) * 100).toFixed(1);
        return `${percentage}%`;
    }

    const registeredBodyTemplate = (rowData: any) => {
        return <Tag value={rowData.isRegistered ? 'Registered' : 'Pending'} severity={rowData.isRegistered ? 'success' : 'warning'} />;
    };

    return (
        <div className="p-4 card">
            <h2>Attendance & Bio-Metric Dashboard</h2>
            <div className="flex gap-4 mb-4">
                <Dropdown value={selectedHostelType} options={hostels} onChange={(e) => setSelectedHostelType(e.value)} placeholder="Filter by Hostel" showClear />
            </div>

            <TabView>
                <TabPanel header="Daily Attendance">
                    <div className="flex gap-4 mb-4 align-items-center" style={{ padding: '10px 0' }}>
                        <label className="font-bold mr-2">Select Date:</label>
                        <Calendar value={selectedDate} onChange={(e) => e.value && setSelectedDate(e.value)} showIcon dateFormat="yy-mm-dd" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 flex">
                        <Card title="Total Present" className="w-full m-2 bg-green-50">
                            <div className="text-4xl text-green-600 font-bold">{attendanceData.length}</div>
                        </Card>
                    </div>

                    <DataTable value={attendanceData} paginator rows={10} stripedRows emptyMessage="No attendance records found for this date.">
                        <Column field="studentId" header="Roll No" sortable filter></Column>
                        <Column field="name" header="Name" sortable filter filterPlaceholder="Search Name"></Column>
                        <Column field="date" header="Date"></Column>
                        <Column field="time" header="Time" sortable></Column>
                        <Column field="status" header="Status" body={statusBodyTemplate} sortable></Column>
                        <Column field="matchScore" header="Match Accuracy" body={matchScoreTemplate} sortable></Column>
                        <Column field="ipAddress" header="IP Address" sortable></Column>
                    </DataTable>
                </TabPanel>

                <TabPanel header="Face Registration Status">
                    <p>List of all students and their Face ID registration status.</p>
                    <DataTable value={registrationData} paginator rows={10} stripedRows emptyMessage="No students found.">
                        <Column field="rollNo" header="Roll No" sortable filter filterPlaceholder="Search Roll No"></Column>
                        <Column field="name" header="Name" sortable filter filterPlaceholder="Search Name"></Column>
                        <Column field="hostelId" header="Hostel" sortable></Column>
                        <Column field="isRegistered" header="Face Status" body={registeredBodyTemplate} sortable></Column>
                    </DataTable>
                </TabPanel>
            </TabView>
        </div>
    );
};

export default AttendanceDashboard;
