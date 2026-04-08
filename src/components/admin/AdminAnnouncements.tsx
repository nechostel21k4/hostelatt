import React, { useContext, useState } from 'react';
import AddAnnouncement from '../common/AddAnnouncement';
import AnnouncementList from '../common/AnnouncementList';
import { AdminContext } from './AdminHome';

const AdminAnnouncements = () => {
    const { admin } = useContext(AdminContext);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="grid p-fluid">
            <div className="col-12 lg:col-4">
                <AddAnnouncement
                    type="ADMIN"
                    author={admin?.name || 'Admin'}
                    onSuccess={handleSuccess}
                // Admin creates global announcements by default (hostelId undefined)
                // If you want admin to target specific hostels, we'd need a dropdown in AddAnnouncement.
                // For now, let's keep it global for Admin.
                />
            </div>
            <div className="col-12 lg:col-8">
                <div className="card">
                    <h3>Recent Announcements</h3>
                    <AnnouncementList refreshTrigger={refreshTrigger} />
                </div>
            </div>
        </div>
    );
};

export default AdminAnnouncements;
