import React, { useContext } from 'react';
import { InchargeContext } from './InchargeHome';
import AttendanceDashboard from '../admin/AttendanceDashboard';

const InchargeAttendance = () => {
    const incharge = useContext(InchargeContext);

    return (
        <div>
            {incharge?.hostelId ? (
                <AttendanceDashboard preSelectedHostel={incharge.hostelId} />
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};

export default InchargeAttendance;
