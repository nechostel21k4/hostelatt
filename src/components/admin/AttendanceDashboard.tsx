import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { TabView, TabPanel } from 'primereact/tabview';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import * as XLSX from 'xlsx';
import { API_BASE_URL } from '../../config';

import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { saveAs } from 'file-saver';
import AttendanceSettingsModal from './AttendanceSettingsModal';

const hostels = [
    { label: 'Boys Hostel (BH1)', value: 'BH1' },
    { label: 'Girls Hostel (GH1)', value: 'GH1' },
    { label: 'All Hostels', value: 'BOTH' }
];

interface AttendanceDashboardProps {
    preSelectedHostel?: string;
    readOnly?: boolean;
}

const AttendanceDashboard = ({ preSelectedHostel, readOnly = false }: AttendanceDashboardProps) => {
    // State
    const [attendanceData, setAttendanceData] = useState<any[]>([]);
    const [registrationData, setRegistrationData] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    // Initialize with preSelectedHostel if available
    const [selectedHostelType, setSelectedHostelType] = useState<string | null>(preSelectedHostel || null);
    const [leavesData, setLeavesData] = useState<any[]>([]);
    const [upcomingLeaves, setUpcomingLeaves] = useState<any[]>([]);

    const [viewMode, setViewMode] = useState('present'); // 'present' | 'absent' | 'outing' | 'not_registered'
    const [registrationView, setRegistrationView] = useState('registered'); // 'registered' | 'not_registered'

    // Settings State
    const [showSettings, setShowSettings] = useState(false);
    const [settingsHostel, setSettingsHostel] = useState<string | null>(null);
    const [attendanceStartTime, setAttendanceStartTime] = useState("09:00");
    const [attendanceEndTime, setAttendanceEndTime] = useState("22:00");
    // Geo State
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [radius, setRadius] = useState<number | null>(200);

    const toast = React.useRef<Toast>(null);

    // Update selectedHostelType if preSelectedHostel changes
    useEffect(() => {
        if (preSelectedHostel) {
            setSelectedHostelType(preSelectedHostel);
        }
    }, [preSelectedHostel]);

    // Helper
    const formatDateHelper = (date: Date) => {
        const offset = date.getTimezoneOffset();
        const d = new Date(date.getTime() - (offset * 60 * 1000));
        return d.toISOString().split('T')[0];
    };

    const formatTime12Hour = (timeStr: string) => {
        if (!timeStr) return '-';
        const [hours, minutes] = timeStr.split(':');
        let h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        h = h ? h : 12; // the hour '0' should be '12'
        return `${h}:${minutes} ${ampm}`;
    };

    // Settings Logic - Moved up to be accessible by fetchers
    const getAuthHeaders = () => {
        const adminTokenString = localStorage.getItem("adminToken");
        if (adminTokenString) {
            let token = adminTokenString;
            try {
                token = JSON.parse(adminTokenString);
            } catch (e) { }
            return { headers: { Authorization: `Bearer ${token}` } };
        }

        // Fallback to Incharge Token
        const inchargeTokenString = localStorage.getItem("inchargeToken");
        if (inchargeTokenString) {
            let token = inchargeTokenString;
            try {
                token = JSON.parse(inchargeTokenString);
            } catch (e) { }
            return { headers: { Authorization: `Bearer ${token}` } };
        }

        // Fallback to Faculty Token
        const facultyTokenString = localStorage.getItem("facultyToken");
        if (facultyTokenString) {
            let token = facultyTokenString;
            try {
                token = JSON.parse(facultyTokenString);
            } catch (e) { }
            return { headers: { Authorization: `Bearer ${token}` } };
        }

        return {};
    };

    const fetchAttendance = async () => {
        try {
            if (!selectedDate) return;
            const dateStr = formatDateHelper(selectedDate);
            const res = await axios.get(`${API_BASE_URL}/attendance/daily?date=${dateStr}`, getAuthHeaders());
            // Backend returns the array directly in res.data
            let data = res.data || [];

            // Fallback if it is wrapped in data property (for robustness)
            if (!Array.isArray(data) && data.data) {
                data = data.data;
            }

            if (selectedHostelType && selectedHostelType !== 'BOTH') {
                data = data.filter((d: any) => d.hostelId === selectedHostelType);
            }
            setAttendanceData(data);
        } catch (error) {
            console.error(error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch attendance' });
        }
    };

    const fetchDailyLeaves = async () => {
        try {
            if (!selectedDate) return;
            const dateStr = formatDateHelper(selectedDate);
            const res = await axios.get(`${API_BASE_URL}/attendance/daily-leaves?date=${dateStr}`, getAuthHeaders());
            let data = res.data || [];
            if (selectedHostelType && selectedHostelType !== 'BOTH') {
                data = data.filter((d: any) => d.hostelId === selectedHostelType);
            }
            setLeavesData(data);
        } catch (error) {
            console.error(error);
        }
    }

    const fetchUpcomingLeaves = async () => {
        try {
            if (!selectedDate) return;
            const dateStr = formatDateHelper(selectedDate);
            const res = await axios.get(`${API_BASE_URL}/attendance/upcoming-leaves?date=${dateStr}`, getAuthHeaders());
            let data = res.data || [];
            if (selectedHostelType && selectedHostelType !== 'BOTH') {
                data = data.filter((d: any) => d.hostelId === selectedHostelType);
            }
            setUpcomingLeaves(data);
        } catch (error) {
            console.error(error);
        }
    }

    const fetchRegistrationStatus = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/attendance/registration-status`, getAuthHeaders());
            // Backend returns array directly with isRegistered pre-calculated
            let students = res.data || [];

            if (selectedHostelType && selectedHostelType !== 'BOTH') {
                students = students.filter((s: any) => s.hostelId === selectedHostelType);
            }
            setRegistrationData(students);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        refreshData();
    }, [selectedDate, selectedHostelType]);

    // Derived State
    const allAttendanceIds = new Set(attendanceData.map((a: any) => a.studentId));

    // 1. Present List: Status is Present, Late, or Permission (Checked in attendance)
    // ADDED: 'ARRIVED' and 'arrived' to include them in present list so they don't show up in Absent/Outing
    const presentRecords = attendanceData.filter((a: any) =>
        a.status === 'Present' || a.status === 'Late' || a.status === 'Permission' || a.status === 'ARRIVED' || a.status === 'arrived'
    );
    const presentIds = new Set(presentRecords.map((a: any) => a.studentId));

    // 2. Outing / Leave List (From Requests)
    // We only count them as "Outing/Leave" if they are NOT already marked present (e.g. came back)
    const allRequests = leavesData.filter((l: any) => !presentIds.has(l.rollNo));

    // Split into Outing (Permission) and Leave
    const outingRecords = allRequests.filter((l: any) => l.type === 'PERMISSION');
    const leaveRecords = allRequests.filter((l: any) => l.type === 'LEAVE');

    const requestIds = new Set(allRequests.map((l: any) => l.rollNo));

    // 3. Not Registered List
    const notRegisteredRecords = registrationData.filter((s: any) => !s.isRegistered);
    // const notRegisteredIds = new Set(notRegisteredRecords.map((s: any) => s.rollNo));

    // 4. Students with upcoming leaves (future dates)
    const upcomingLeaveIds = new Set(upcomingLeaves.map((l: any) => l.rollNo));

    // 5. Actual Absent List (Registered AND Not Present AND Not On Leave/Outing AND No Upcoming Leave)
    const registeredStudents = registrationData.filter((s: any) => s.isRegistered);
    const realAbsentRecords = registeredStudents.filter((s: any) =>
        !presentIds.has(s.rollNo) && !requestIds.has(s.rollNo) && !upcomingLeaveIds.has(s.rollNo)
    );

    // Templates
    const statusBodyTemplate = (rowData: any) => {
        return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
    };

    const getSeverity = (status: string) => {
        switch (status) {
            case 'Present': return 'success';
            case 'Absent': return 'danger';
            case 'No Show': return 'danger';
            case 'Late': return 'warning';
            case 'Leave': return 'info';
            case 'Permission': return 'info';
            case 'ACCEPTED': return 'info';
            case 'ARRIVED': return 'success';
            case 'arrived': return 'success';
            default: return 'info';
        }
    };

    const matchScoreTemplate = (rowData: any) => {
        return rowData.matchScore ? `${(rowData.matchScore * 100).toFixed(1)}%` : '-';
    };

    const registeredBodyTemplate = (rowData: any) => {
        return <Tag value={rowData.isRegistered ? 'Registered' : 'Pending'} severity={rowData.isRegistered ? 'success' : 'warning'} />;
    };

    const requestTypeTemplate = (rowData: any) => {
        return <Tag value={rowData.type} severity={rowData.type === 'LEAVE' ? 'warning' : 'info'} />;
    }

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            let dataToExport: any[] = [];
            if (viewMode === 'present') dataToExport = presentRecords;
            else if (viewMode === 'absent') dataToExport = realAbsentRecords;
            else if (viewMode === 'outing') dataToExport = outingRecords;
            else if (viewMode === 'leave') dataToExport = leaveRecords;
            else if (viewMode === 'not_registered') dataToExport = notRegisteredRecords;

            const worksheet = xlsx.utils.json_to_sheet(dataToExport);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAsExcelFile(excelBuffer, `attendance_${viewMode}_${formatDateHelper(selectedDate || new Date())}`);
        });
    };

    const saveAsExcelFile = (buffer: any, fileName: string) => {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data = new Blob([buffer], { type: EXCEL_TYPE });
        saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    };

    const fetchSettingsForHostel = async (hostelCode: string) => {
        // If BOTH is selected, we fetch BH1 as reference
        const targetCode = hostelCode === 'BOTH' ? 'BH1' : hostelCode;

        try {
            // Fetch current settings for this hostel
            const res = await axios.get(`${API_BASE_URL}/schemas/getHostels`, getAuthHeaders());
            const hostelsList = res.data.hostels;
            const currentHostel = hostelsList.find((h: any) => h.code === targetCode);

            if (currentHostel) {
                setAttendanceStartTime(currentHostel.attendanceStartTime || "00:00");
                setAttendanceEndTime(currentHostel.attendanceEndTime || "23:59");
                // Geo
                if (currentHostel.geoCoordinates) {
                    setLatitude(currentHostel.geoCoordinates.latitude);
                    setLongitude(currentHostel.geoCoordinates.longitude);
                    setRadius(currentHostel.geoCoordinates.radius || 200);
                } else {
                    setLatitude(null); setLongitude(null); setRadius(200);
                }
            }
        } catch (error) {
            console.error("Failed to fetch hostel settings", error);
            alert("Failed to load settings.");
        }
    }

    const openSettings = async () => {
        let codeToFetch: string = selectedHostelType || 'BH1';
        // Note: fetchSettingsForHostel handles 'BOTH' internally by fetching defaults from BH1

        setSettingsHostel(codeToFetch);
        await fetchSettingsForHostel(codeToFetch);
        setShowSettings(true);
    };

    const onSettingsHostelChange = (e: any) => {
        const val = e.value;
        setSettingsHostel(val);
        if (val) {
            fetchSettingsForHostel(val);
        }
    };

    const getCurrentLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                alert("Location detected!");
            }, (error) => {
                console.error("Geo Error", error);
                alert("Failed to detect location. Please allow permissions.");
            });
        } else {
            alert("Geolocation not supported by this browser.");
        }
    };

    const saveSettings = async () => {
        try {
            const config = getAuthHeaders();
            const payload = {
                attendanceStartTime,
                attendanceEndTime,
                latitude,
                longitude,
                radius
            };

            if (settingsHostel === 'BOTH') {
                console.log("Saving for BOTH hostels...");
                // Update BH1
                await axios.post(`${API_BASE_URL}/schemas/updateHostelSettings`, {
                    hostelCode: 'BH1',
                    ...payload
                }, config);
                console.log("Saved BH1");

                // Update GH1
                await axios.post(`${API_BASE_URL}/schemas/updateHostelSettings`, {
                    hostelCode: 'GH1',
                    ...payload
                }, config);
                console.log("Saved GH1");

                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Settings saved for ALL Hostels (BH1 & GH1)' });
            } else {
                console.log(`Saving for single hostel: ${settingsHostel}`);
                await axios.post(`${API_BASE_URL}/schemas/updateHostelSettings`, {
                    hostelCode: settingsHostel,
                    ...payload
                }, config);

                toast.current?.show({ severity: 'success', summary: 'Success', detail: `Settings saved for ${settingsHostel}` });
            }
            setShowSettings(false);
        } catch (error: any) {
            console.error("Failed to save settings", error);
            console.error("Error Response:", error.response);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to save: ${error.response?.data?.message || error.message}` });
        }
    };

    // Refresh Logic
    const refreshData = () => {
        fetchAttendance();
        fetchRegistrationStatus();
        fetchRegistrationStatus();
        fetchDailyLeaves();
        fetchUpcomingLeaves();
    };

    return (
        <div className="p-4 card">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 m-0">Attendance & Bio-Metric Dashboard</h2>
                <div className="flex gap-2">
                    {!readOnly && (
                        <Button icon="pi pi-cog" rounded outlined severity="secondary" aria-label="Settings" onClick={openSettings} tooltip="Configure Time" tooltipOptions={{ position: 'bottom' }} />
                    )}
                    <Button icon="pi pi-refresh" rounded outlined severity="secondary" aria-label="Refresh" onClick={refreshData} tooltip="Refresh Data" tooltipOptions={{ position: 'bottom' }} />
                </div>
            </div>

            {/* Hide dropdown if pre-selected */}
            {!preSelectedHostel && (
                <div className="flex gap-4 mb-4">
                    <Dropdown value={selectedHostelType} options={hostels} optionValue="value" onChange={(e) => setSelectedHostelType(e.value)} placeholder="Filter by Hostel" showClear />
                </div>
            )}

            <TabView>
                <TabPanel header="Daily Attendance">
                    <div className="flex gap-4 mb-4 align-items-center" style={{ padding: '10px 0' }}>
                        <label className="font-bold mr-2">Select Date:</label>
                        <Calendar value={selectedDate} onChange={(e) => e.value && setSelectedDate(e.value)} showIcon dateFormat="yy-mm-dd" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
                        <div
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all bg-white border-gray-200`}
                        >
                            <h3 className="text-gray-600 text-sm font-medium m-0 mb-1">Total Students</h3>
                            <div className="text-3xl text-gray-800 font-bold">{registrationData.length}</div>
                        </div>

                        <div
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${viewMode === 'present' ? 'bg-green-50 border-green-500' : 'bg-white border-gray-200'}`}
                            onClick={() => setViewMode('present')}
                        >
                            <h3 className="text-gray-600 text-sm font-medium m-0 mb-1">Total Present</h3>
                            <div className="text-3xl text-green-600 font-bold">{presentRecords.length}</div>
                        </div>

                        <div
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${viewMode === 'absent' ? 'bg-red-50 border-red-500' : 'bg-white border-gray-200'}`}
                            onClick={() => setViewMode('absent')}
                        >
                            <h3 className="text-gray-600 text-sm font-medium m-0 mb-1">Total Absent</h3>
                            <div className="text-3xl text-red-600 font-bold">{realAbsentRecords.length}</div>
                        </div>

                        <div
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${viewMode === 'outing' ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-200'}`}
                            onClick={() => setViewMode('outing')}
                        >
                            <h3 className="text-gray-600 text-sm font-medium m-0 mb-1">Outing (Perm)</h3>
                            <div className="text-3xl text-blue-600 font-bold">{outingRecords.length}</div>
                        </div>

                        <div
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${viewMode === 'leave' ? 'bg-teal-50 border-teal-500' : 'bg-white border-gray-200'}`}
                            onClick={() => setViewMode('leave')}
                        >
                            <h3 className="text-gray-600 text-sm font-medium m-0 mb-1">On Leave</h3>
                            <div className="text-3xl text-teal-600 font-bold">{leaveRecords.length}</div>
                        </div>

                        <div
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${viewMode === 'not_registered' ? 'bg-orange-50 border-orange-500' : 'bg-white border-gray-200'}`}
                            onClick={() => setViewMode('not_registered')}
                        >
                            <h3 className="text-gray-600 text-sm font-medium m-0 mb-1">Not Registered</h3>
                            <div className="text-3xl text-orange-600 font-bold">{notRegisteredRecords.length}</div>
                        </div>
                    </div>

                    <div className="mb-2 flex items-center gap-2">
                        <Tag
                            value={viewMode === 'present' ? "Present Students" : viewMode === 'absent' ? "Absent Students" : viewMode === 'outing' ? "Students on Outing" : viewMode === 'leave' ? "Students on Leave" : "Unregistered Students"}
                            severity={viewMode === 'present' ? 'success' : viewMode === 'absent' ? 'danger' : viewMode === 'outing' ? 'info' : viewMode === 'leave' ? 'info' : 'warning'}
                        />
                        <Button
                            label="Export Excel"
                            icon="pi pi-file-excel"
                            className={`p-button-sm p-button-secondary`}
                            onClick={exportExcel}
                        />
                    </div>

                    {viewMode === 'present' && (
                        <DataTable value={presentRecords} paginator rows={10} stripedRows emptyMessage="No present students found for this date.">
                            <Column field="studentId" header="Roll No" sortable filter></Column>
                            <Column field="name" header="Name" sortable filter filterPlaceholder="Search Name"></Column>
                            <Column field="date" header="Date"></Column>
                            <Column field="time" header="Time" body={(r) => formatTime12Hour(r.time)} sortable></Column>
                            <Column field="distance" header="Dist (m)" sortable body={(r) => `${r.distance || 0}m`}></Column>
                            <Column header="Location" body={(r) => r.location ? `${r.location.latitude?.toFixed(4)}, ${r.location.longitude?.toFixed(4)}` : '-'}></Column>
                            <Column field="status" header="Status" body={statusBodyTemplate} sortable></Column>
                            <Column field="matchScore" header="Match Accuracy" body={matchScoreTemplate} sortable></Column>
                        </DataTable>
                    )}

                    {viewMode === 'absent' && (
                        <DataTable value={realAbsentRecords} paginator rows={10} stripedRows emptyMessage="No absent students found.">
                            <Column field="rollNo" header="Roll No" sortable filter></Column>
                            <Column field="name" header="Name" sortable filter filterPlaceholder="Search Name"></Column>
                            <Column field="hostelId" header="Hostel" sortable></Column>
                            {/* <Column field="status" header="Status" body={statusBodyTemplate} sortable></Column> */}
                            <Column header="Status" body={() => <Tag value="Absent" severity="danger" />}></Column>
                            <Column header="Upcoming Leave" body={(r: any) => {
                                const upcoming = upcomingLeaves.find((l: any) => l.rollNo === r.rollNo);
                                if (upcoming) {
                                    return <div className="text-sm">
                                        <div className="font-bold text-blue-600">Starts: {formatDateHelper(new Date(upcoming.fromDate))}</div>
                                        <div className="text-gray-500 text-xs">Approved</div>
                                    </div>
                                }
                                return '-';
                            }}></Column>
                            <Column field="isRegistered" header="Face Registered?" body={registeredBodyTemplate} sortable></Column>
                        </DataTable>
                    )}

                    {viewMode === 'outing' && (
                        <DataTable value={outingRecords} paginator rows={10} stripedRows emptyMessage="No students on outing.">
                            <Column field="rollNo" header="Roll No" sortable filter></Column>
                            <Column field="name" header="Name" sortable filter filterPlaceholder="Search Name"></Column>
                            <Column field="hostelId" header="Hostel" sortable></Column>
                            <Column field="type" header="Type" body={requestTypeTemplate} sortable></Column>
                            <Column field="date" header="Date" body={(r) => formatDateHelper(new Date(r.date))} sortable></Column>
                            <Column field="status" header="Request Status" body={statusBodyTemplate} sortable></Column>
                        </DataTable>
                    )}

                    {viewMode === 'leave' && (
                        <DataTable value={leaveRecords} paginator rows={10} stripedRows emptyMessage="No students on leave.">
                            <Column field="rollNo" header="Roll No" sortable filter></Column>
                            <Column field="name" header="Name" sortable filter filterPlaceholder="Search Name"></Column>
                            <Column field="hostelId" header="Hostel" sortable></Column>
                            <Column field="type" header="Type" body={requestTypeTemplate} sortable></Column>
                            <Column field="fromDate" header="From" body={(r) => formatDateHelper(new Date(r.fromDate))} sortable></Column>
                            <Column field="toDate" header="To" body={(r) => formatDateHelper(new Date(r.toDate))} sortable></Column>
                            <Column field="status" header="Request Status" body={statusBodyTemplate} sortable></Column>
                        </DataTable>
                    )}

                    {viewMode === 'not_registered' && (
                        <DataTable value={notRegisteredRecords} paginator rows={10} stripedRows emptyMessage="No unregistered students found.">
                            <Column field="rollNo" header="Roll No" sortable filter></Column>
                            <Column field="name" header="Name" sortable filter filterPlaceholder="Search Name"></Column>
                            <Column field="hostelId" header="Hostel" sortable></Column>
                            <Column header="Status" body={() => <Tag value="Not Registered" severity="warning" />}></Column>
                        </DataTable>
                    )}
                </TabPanel>
                <TabPanel header="Face Registration Status">
                    {/* Summary Cards */}
                    <div className="flex gap-4 mb-4">
                        <div
                            className={`flex-1 p-3 rounded-xl border-2 cursor-pointer transition-all ${registrationView === 'registered' ? 'bg-green-50 border-green-500' : 'bg-white border-gray-200'}`}
                            onClick={() => setRegistrationView('registered')}
                        >
                            <h3 className="text-gray-600 text-sm font-medium m-0 mb-1">Registered Students</h3>
                            <div className="text-3xl text-green-600 font-bold">{registrationData.filter((s: any) => s.isRegistered).length}</div>
                        </div>

                        <div
                            className={`flex-1 p-3 rounded-xl border-2 cursor-pointer transition-all ${registrationView === 'not_registered' ? 'bg-orange-50 border-orange-500' : 'bg-white border-gray-200'}`}
                            onClick={() => setRegistrationView('not_registered')}
                        >
                            <h3 className="text-gray-600 text-sm font-medium m-0 mb-1">Not Registered</h3>
                            <div className="text-3xl text-orange-600 font-bold">{registrationData.filter((s: any) => !s.isRegistered).length}</div>
                        </div>
                    </div>

                    {/* Table View */}
                    {registrationView === 'registered' ? (
                        <>
                            <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                                <h3 className="text-xl font-bold text-green-600 m-0">Registered Students</h3>
                            </div>
                            <DataTable value={registrationData.filter((s: any) => s.isRegistered)} paginator rows={10} stripedRows emptyMessage="No registered students found." className="p-datatable-sm" responsiveLayout="scroll">
                                <Column field="rollNo" header="Roll No" sortable filter filterPlaceholder="Search Roll No" style={{ minWidth: '120px' }}></Column>
                                <Column field="name" header="Name" sortable filter filterPlaceholder="Search Name" style={{ minWidth: '180px' }}></Column>
                                <Column field="hostelId" header="Hostel" sortable style={{ minWidth: '100px' }}></Column>
                                <Column field="isRegistered" header="Status" body={registeredBodyTemplate} sortable style={{ minWidth: '120px' }}></Column>
                            </DataTable>
                        </>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                                <h3 className="text-xl font-bold text-orange-600 m-0">Not Registered Students</h3>
                            </div>
                            <DataTable value={registrationData.filter((s: any) => !s.isRegistered)} paginator rows={10} stripedRows emptyMessage="No pending students found." className="p-datatable-sm" responsiveLayout="scroll">
                                <Column field="rollNo" header="Roll No" sortable filter filterPlaceholder="Search Roll No" style={{ minWidth: '120px' }}></Column>
                                <Column field="name" header="Name" sortable filter filterPlaceholder="Search Name" style={{ minWidth: '180px' }}></Column>
                                <Column field="hostelId" header="Hostel" sortable style={{ minWidth: '100px' }}></Column>
                                <Column field="isRegistered" header="Status" body={registeredBodyTemplate} sortable style={{ minWidth: '120px' }}></Column>
                            </DataTable>
                        </>
                    )}
                </TabPanel>
            </TabView>
            {/* Settings Dialog */}
            {/* Settings Modal */}
            <AttendanceSettingsModal
                visible={showSettings}
                onClose={() => setShowSettings(false)}
                hostels={hostels}
                selectedHostel={settingsHostel}
                onHostelChange={onSettingsHostelChange}
                startTime={attendanceStartTime}
                endTime={attendanceEndTime}
                onStartTimeChange={setAttendanceStartTime}
                onEndTimeChange={setAttendanceEndTime}
                // Geo
                latitude={latitude}
                longitude={longitude}
                radius={radius}
                onLatitudeChange={setLatitude}
                onLongitudeChange={setLongitude}
                onRadiusChange={setRadius}
                onGetCurrentLocation={getCurrentLocation}
                onSave={saveSettings}
            />
        </div >
    );
};

export default AttendanceDashboard;