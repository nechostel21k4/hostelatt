import React, { useState } from 'react';
import AnnouncementList from '../common/AnnouncementList';

const FacultyAnnouncements = () => {
    // Refresh trigger isn't strictly necessary if we don't have add/edit, 
    // but useful if we wanted to add a manual refresh button later.
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    return (
        <div className="card">
            <div className="flex justify-content-between align-items-center mb-4">
                <h3 className="m-0">Announcements</h3>
            </div>
            <AnnouncementList refreshTrigger={refreshTrigger} showActions={false} />
        </div>
    );
};

export default FacultyAnnouncements;
