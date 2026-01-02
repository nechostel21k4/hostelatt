import React, { useContext } from 'react';
import AnnouncementList from '../common/AnnouncementList';
import { StudentContext } from './StudentHome';

const StudentAnnouncements = () => {
    const { student } = useContext(StudentContext);

    return (
        <div className="grid p-fluid">
            <div className="col-12">
                <div className="card">
                    <h3>Announcements & Updates</h3>
                    {student?.hostelId ? (
                        <AnnouncementList
                            refreshTrigger={0}
                            hostelId={student.hostelId}
                        />
                    ) : (
                        <div>Loading...</div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default StudentAnnouncements;
