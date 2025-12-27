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

const AttendanceDashboard = () => {
    // State
    const [attendanceData, setAttendanceData] = useState<any[]>([]);
    const [registrationData, setRegistrationData] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [selectedHostelType, setSelectedHostelType] = useState(null);
    const [viewMode, setViewMode] = useState('present'); // 'present' | 'absent'
    const [registrationView, setRegistrationView] = useState('registered'); // 'registered' | 'not_registered'

    const hostels = [
        { label: 'Boys Hostel (BH1)', value: 'BH1' },
        { label: 'Girls Hostel (GH1)', value: 'GH1' }
    ];

    // Helper to format date as YYYY-MM-DD
    const formatDate = (date: Date) => {
        if (!date) return '';
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
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [selectedDate, selectedHostelType]);

    useEffect(() => {
        fetchRegistrationStatus();
    }, [selectedHostelType]);

    // Derived State: Absent Students
    const absentStudents = registrationData.filter((student: any) => {
        // Check if studentId exists in attendanceData
        const isPresent = attendanceData.some((record: any) => record.studentId === student.rollNo);
        return !isPresent;
    }).map((s: any) => ({ ...s, status: 'Absent' }));

    // Templates
    const statusBodyTemplate = (rowData: any) => {
        const severity = rowData.status === 'Present' ? 'success' :
            rowData.status === 'Absent' ? 'danger' : 'warning';
        return <Tag value={rowData.status} severity={severity} />;
    };

    const matchScoreTemplate = (rowData: any) => {
        if (!rowData.matchScore) return '-';
        const percentage = Math.max(0, (1 - rowData.matchScore) * 100).toFixed(1);
        return `${percentage}%`;
    }

    const registeredBodyTemplate = (rowData: any) => {
        return <Tag value={rowData.isRegistered ? 'Registered' : 'Pending'} severity={rowData.isRegistered ? 'success' : 'warning'} />;
    };

    // Export Logic
    const exportExcel = () => {
        const isPresentView = viewMode === 'present';
        const dataToExport = isPresentView ? attendanceData : absentStudents;
        const statusLabel = isPresentView ? 'Present' : 'Absent';

        const workbook = XLSX.utils.book_new();

        // Helper to create sheet data
        const createSheetData = (students: any[]) => students.map((s: any) => {
            const rollNo = s.studentId || s.rollNo;
            // Lookup hostel from registrationData if not present in record
            const regRecord = registrationData.find((r: any) => r.rollNo === rollNo);
            const hostel = s.hostelId || (regRecord ? regRecord.hostelId : 'Unknown');

            return {
                'Roll No': rollNo,
                'Name': s.name,
                'Hostel': hostel,
                'Status': statusLabel,
                'Date': selectedDate ? formatDate(selectedDate) : '',
                'Time': s.time || '-',
                'Match Score': s.matchScore ? `${Math.max(0, (1 - s.matchScore) * 100).toFixed(1)}%` : '-'
            };
        });

        // Group by Hostel
        const bh1Students = dataToExport.filter((s: any) => {
            const rollNo = s.studentId || s.rollNo;
            const regRecord = registrationData.find((r: any) => r.rollNo === rollNo);
            const hostel = s.hostelId || (regRecord ? regRecord.hostelId : '');
            return hostel === 'BH1';
        });

        const gh1Students = dataToExport.filter((s: any) => {
            const rollNo = s.studentId || s.rollNo;
            const regRecord = registrationData.find((r: any) => r.rollNo === rollNo);
            const hostel = s.hostelId || (regRecord ? regRecord.hostelId : '');
            return hostel === 'GH1';
        });

        if (bh1Students.length > 0) {
            const worksheetBH1 = XLSX.utils.json_to_sheet(createSheetData(bh1Students));
            XLSX.utils.book_append_sheet(workbook, worksheetBH1, 'BH1');
        }

        if (gh1Students.length > 0) {
            const worksheetGH1 = XLSX.utils.json_to_sheet(createSheetData(gh1Students));
            XLSX.utils.book_append_sheet(workbook, worksheetGH1, 'GH1');
        }

        // Catch-all for others or if no specific hostel found
        const otherStudents = dataToExport.filter((s: any) => {
            const rollNo = s.studentId || s.rollNo;
            const regRecord = registrationData.find((r: any) => r.rollNo === rollNo);
            const hostel = s.hostelId || (regRecord ? regRecord.hostelId : '');
            return hostel !== 'BH1' && hostel !== 'GH1';
        });

        if (otherStudents.length > 0) {
            const worksheetOthers = XLSX.utils.json_to_sheet(createSheetData(otherStudents));
            XLSX.utils.book_append_sheet(workbook, worksheetOthers, 'Others');
        }

        // If completely empty but lists exist (safety fallback)
        if (workbook.SheetNames.length === 0 && dataToExport.length > 0) {
            const worksheetAll = XLSX.utils.json_to_sheet(createSheetData(dataToExport));
            XLSX.utils.book_append_sheet(workbook, worksheetAll, 'All Students');
        }

        // Save file
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        const fileName = `${statusLabel}_Students_${selectedDate ? formatDate(selectedDate) : ''}.xlsx`;

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(data);
        link.download = fileName;
        link.click();
    };

    // Refresh Logic
    const refreshData = () => {
        fetchAttendance();
        fetchRegistrationStatus();
    };

    return (
        <div className="p-4 card">
            <div className="flex justify-between items-center mb-4">
                <h2>Attendance & Bio-Metric Dashboard</h2>
                <Button icon="pi pi-refresh" rounded text aria-label="Refresh" onClick={refreshData} />
            </div>

            <div className="flex gap-4 mb-4">
                <Dropdown value={selectedHostelType} options={hostels} onChange={(e) => setSelectedHostelType(e.value)} placeholder="Filter by Hostel" showClear />
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
                            <div className="text-3xl text-green-600 font-bold">{attendanceData.length}</div>
                        </div>

                        <div
                            className={`flex-1 p-3 rounded-xl border-2 cursor-pointer transition-all ${viewMode === 'absent' ? 'bg-red-50 border-red-500' : 'bg-white border-gray-200'}`}
                            onClick={() => setViewMode('absent')}
                        >
                            <h3 className="text-gray-600 text-sm font-medium m-0 mb-1">Total Absent</h3>
                            <div className="text-3xl text-red-600 font-bold">{absentStudents.length}</div>
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
                        <DataTable value={attendanceData} paginator rows={10} stripedRows emptyMessage="No attendance records found for this date.">
                            <Column field="studentId" header="Roll No" sortable filter></Column>
                            <Column field="name" header="Name" sortable filter filterPlaceholder="Search Name"></Column>
                            <Column field="date" header="Date"></Column>
                            <Column field="time" header="Time" sortable></Column>
                            <Column field="status" header="Status" body={statusBodyTemplate} sortable></Column>
                            <Column field="matchScore" header="Match Accuracy" body={matchScoreTemplate} sortable></Column>
                            <Column field="ipAddress" header="IP Address" sortable></Column>
                        </DataTable>
                    ) : (
                        <DataTable value={absentStudents} paginator rows={10} stripedRows emptyMessage="No absent students found (Everyone is present!).">
                            <Column field="rollNo" header="Roll No" sortable filter></Column>
                            <Column field="name" header="Name" sortable filter filterPlaceholder="Search Name"></Column>
                            <Column field="hostelId" header="Hostel" sortable></Column>
                            <Column field="status" header="Status" body={statusBodyTemplate} sortable></Column>
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
        </div>
    );
};

export default AttendanceDashboard;