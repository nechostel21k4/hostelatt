import React, { useContext, useState } from 'react';
import AddAnnouncement from '../common/AddAnnouncement';
import AnnouncementList from '../common/AnnouncementList';
import { InchargeContext } from './InchargeHome';

const InchargeAnnouncements = () => {
    const incharge = useContext(InchargeContext);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="grid p-fluid">
            <div className="col-12 lg:col-4">
                {incharge?.hostelId ? (
                    <AddAnnouncement
                        type="INCHARGE"
                        author={incharge.name || 'Incharge'}
                        hostelId={incharge.hostelId}
                        onSuccess={handleSuccess}
                    />
                ) : (
                    <div>Loading Incharge Data...</div>
                )}
            </div>
            <div className="col-12 lg:col-8">
                <div className="card">
                    <h3>Announcements ({incharge?.hostelId})</h3>
                    {incharge?.hostelId && (
                        <AnnouncementList
                            refreshTrigger={refreshTrigger}
                            hostelId={incharge.hostelId}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default InchargeAnnouncements;
