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

const AttendanceDashboard = () => {
    // State
    const [attendanceData, setAttendanceData] = useState<any[]>([]);
    const [registrationData, setRegistrationData] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [selectedHostelType, setSelectedHostelType] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState('present'); // 'present' | 'absent'
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



    // Helper
    const formatDateHelper = (date: Date) => {
        const offset = date.getTimezoneOffset();
        const d = new Date(date.getTime() - (offset * 60 * 1000));
        return d.toISOString().split('T')[0];
    };

    const fetchAttendance = async () => {
        try {
            if (!selectedDate) return;
            const dateStr = formatDateHelper(selectedDate);
            const res = await axios.get(`${API_BASE_URL}/attendance/daily?date=${dateStr}`, getAuthHeaders());
            let data = res.data.data || [];
            if (selectedHostelType && selectedHostelType !== 'BOTH') {
                data = data.filter((d: any) => d.hostelId === selectedHostelType);
            }
            setAttendanceData(data);
        } catch (error) {
            console.error(error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch attendance' });
        }
    };

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

    // 1. Present List: Status is Present, Late, or Permission
    const presentRecords = attendanceData.filter((a: any) =>
        a.status === 'Present' || a.status === 'Late' || a.status === 'Permission'
    );

    // 2. Marked Absent List: Status is Absent or Leave
    const markedAbsentRecords = attendanceData.filter((a: any) =>
        a.status === 'Absent' || a.status === 'Leave'
    );

    // 3. No Show List: Students who haven't marked attendance at all
    const noShowStudents = registrationData.filter((s: any) => !allAttendanceIds.has(s.rollNo));

    // Combine for Absent View
    const absentListCombined = [
        ...markedAbsentRecords.map((r: any) => ({
            rollNo: r.studentId,
            name: r.name,
            hostelId: r.hostelId,
            status: r.status,
            isRegistered: true,
            remarks: r.remarks || 'Marked Absent'
        })),
        ...noShowStudents.map((s: any) => ({
            rollNo: s.rollNo,
            name: s.name,
            hostelId: s.hostelId,
            status: 'No Show',
            isRegistered: s.isRegistered,
            remarks: 'Did not mark attendance'
        }))
    ];

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
            default: return 'info';
        }
    };

    const matchScoreTemplate = (rowData: any) => {
        return rowData.matchScore ? `${(rowData.matchScore * 100).toFixed(1)}%` : '-';
    };

    const registeredBodyTemplate = (rowData: any) => {
        return <Tag value={rowData.isRegistered ? 'Registered' : 'Pending'} severity={rowData.isRegistered ? 'success' : 'warning'} />;
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const dataToExport = viewMode === 'present' ? presentRecords : absentListCombined;
            const worksheet = xlsx.utils.json_to_sheet(dataToExport);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAsExcelFile(excelBuffer, `attendance_${formatDateHelper(selectedDate || new Date())}`);
        });
    };

    const saveAsExcelFile = (buffer: any, fileName: string) => {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data = new Blob([buffer], { type: EXCEL_TYPE });
        saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    };

    // Settings Logic
    const getAuthHeaders = () => {
        const tokenString = localStorage.getItem("adminToken");
        if (!tokenString) return {};

        let token = tokenString;
        try {
            // Attempt to parse if it's a JSON string
            token = JSON.parse(tokenString);
        } catch (e) {
            // If parse fails, use the string as is
        }
        return { headers: { Authorization: `Bearer ${token}` } };
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
    };

    return (
        <div className="p-4 card">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 m-0">Attendance & Bio-Metric Dashboard</h2>
                <div className="flex gap-2">
                    <Button icon="pi pi-cog" rounded outlined severity="secondary" aria-label="Settings" onClick={openSettings} tooltip="Configure Time" tooltipOptions={{ position: 'bottom' }} />
                    <Button icon="pi pi-refresh" rounded outlined severity="secondary" aria-label="Refresh" onClick={refreshData} tooltip="Refresh Data" tooltipOptions={{ position: 'bottom' }} />
                </div>
            </div>

            <div className="flex gap-4 mb-4">
                <Dropdown value={selectedHostelType} options={hostels} optionValue="value" onChange={(e) => setSelectedHostelType(e.value)} placeholder="Filter by Hostel" showClear />
            </div>

            <TabView>
                <TabPanel header="Daily Attendance">
                    <div className="flex gap-4 mb-4 align-items-center" style={{ padding: '10px 0' }}>
                        <label className="font-bold mr-2">Select Date:</label>
                        <Calendar value={selectedDate} onChange={(e) => e.value && setSelectedDate(e.value)} showIcon dateFormat="yy-mm-dd" />
                    </div>

                    <div className="flex gap-4 mb-4">
                        <div
                            className={`flex-1 p-3 rounded-xl border-2 cursor-pointer transition-all ${viewMode === 'present' ? 'bg-green-50 border-green-500' : 'bg-white border-gray-200'}`}
                            onClick={() => setViewMode('present')}
                        >
                            <h3 className="text-gray-600 text-sm font-medium m-0 mb-1">Total Present</h3>
                            <div className="text-3xl text-green-600 font-bold">{presentRecords.length}</div>
                        </div>

                        <div
                            className={`flex-1 p-3 rounded-xl border-2 cursor-pointer transition-all ${viewMode === 'absent' ? 'bg-red-50 border-red-500' : 'bg-white border-gray-200'}`}
                            onClick={() => setViewMode('absent')}
                        >
                            <h3 className="text-gray-600 text-sm font-medium m-0 mb-1">Total Absent</h3>
                            <div className="text-3xl text-red-600 font-bold">{absentListCombined.length}</div>
                        </div>
                    </div>

                    <div className="mb-2 flex items-center gap-2">
                        <Tag value={viewMode === 'present' ? "Present Students" : "Absent Students"} severity={viewMode === 'present' ? 'success' : 'danger'} />
                        <Button
                            label="Export Excel"
                            icon="pi pi-file-excel"
                            className={`p-button-sm ${viewMode === 'present' ? 'p-button-success' : 'p-button-danger'}`}
                            onClick={exportExcel}
                        />
                    </div>

                    {viewMode === 'present' ? (
                        <DataTable value={presentRecords} paginator rows={10} stripedRows emptyMessage="No present students found for this date.">
                            <Column field="studentId" header="Roll No" sortable filter></Column>
                            <Column field="name" header="Name" sortable filter filterPlaceholder="Search Name"></Column>
                            <Column field="date" header="Date"></Column>
                            <Column field="time" header="Time" sortable></Column>
                            <Column field="status" header="Status" body={statusBodyTemplate} sortable></Column>
                            <Column field="matchScore" header="Match Accuracy" body={matchScoreTemplate} sortable></Column>

                        </DataTable>
                    ) : (
                        <DataTable value={absentListCombined} paginator rows={10} stripedRows emptyMessage="No absent students found (Everyone is present!).">
                            <Column field="rollNo" header="Roll No" sortable filter></Column>
                            <Column field="name" header="Name" sortable filter filterPlaceholder="Search Name"></Column>
                            <Column field="hostelId" header="Hostel" sortable></Column>
                            <Column field="status" header="Status" body={statusBodyTemplate} sortable></Column>
                            <Column field="remarks" header="Remarks" sortable></Column>
                            <Column field="isRegistered" header="Face Registered?" body={registeredBodyTemplate} sortable></Column>
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