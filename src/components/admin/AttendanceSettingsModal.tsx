import React from 'react';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { X } from 'lucide-react';

interface AttendanceSettingsModalProps {
    visible: boolean;
    onClose: () => void;
    hostels: any[];
    selectedHostel: any;
    onHostelChange: (e: any) => void;
    startTime: string;
    endTime: string;
    onStartTimeChange: (e: any) => void;
    onEndTimeChange: (e: any) => void;
    onSave: () => void;
}

const AttendanceSettingsModal: React.FC<AttendanceSettingsModalProps> = ({
    visible,
    onClose,
    hostels,
    selectedHostel,
    onHostelChange,
    startTime,
    endTime,
    onStartTimeChange,
    onEndTimeChange,
    onSave
}) => {
    if (!visible) return null;

    // Helper to convert string HH:mm to Date object for Calendar
    const getDateFromTime = (timeStr: string) => {
        if (!timeStr) return null;
        return new Date(`1970-01-01T${timeStr}:00`);
    };

    // Helper to convert Date back to HH:mm string
    const handleTimeChange = (e: any, setter: (val: string) => void) => {
        if (e.value && e.value instanceof Date) {
            const timeStr = e.value.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
            setter(timeStr);
        }
    };

    return (
        <>
            <style>{`
                .asm-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    z-index: 9999;
                    background-color: rgba(0,0,0,0.6);
                    backdrop-filter: blur(4px);
                    display: flex; align-items: center; justify-content: center;
                    padding: 16px;
                }
                .asm-modal {
                    background-color: white;
                    border-radius: 16px;
                    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
                    width: 100%;
                    max-width: 450px;
                    display: flex; flex-direction: column;
                    max-height: 90vh;
                    animation: fadeIn 0.2s ease-out;
                }
                .asm-header {
                    padding: 20px 24px;
                    border-bottom: 1px solid #f3f4f6;
                    display: flex; justify-content: space-between; align-items: center;
                    background-color: #f9fafb;
                    flex-shrink: 0;
                }
                .asm-body {
                    padding: 24px;
                    overflow-y: auto;
                    display: flex; flex-direction: column; gap: 24px;
                }
                .asm-footer {
                    padding: 16px 24px;
                    background-color: #f9fafb;
                    border-top: 1px solid #f3f4f6;
                    display: flex; justify-content: flex-end; gap: 12px;
                    flex-shrink: 0;
                    border-bottom-left-radius: 16px;
                    border-bottom-right-radius: 16px;
                }
                .asm-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                .asm-label {
                    font-size: 0.75rem; font-weight: 600; color: #374151;
                    text-transform: uppercase; letter-spacing: 0.05em;
                    margin-bottom: 8px; display: block;
                }
                @media (max-width: 640px) {
                    .asm-grid {
                        grid-template-columns: 1fr;
                    }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>

            <div className="asm-overlay">
                <div className="asm-modal">

                    {/* Header */}
                    <div className="asm-header">
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Attendance Settings</h3>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '4px 0 0 0' }}>Configure check-in timings</p>
                        </div>
                        <button
                            onClick={onClose}
                            style={{
                                padding: '8px', borderRadius: '50%', border: 'none', background: 'transparent',
                                cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="asm-body">
                        {/* Hostel Selection */}
                        <div>
                            <label className="asm-label">Target Hostel</label>
                            <Dropdown
                                value={selectedHostel}
                                options={hostels}
                                onChange={onHostelChange}
                                placeholder="Select a Hostel"
                                style={{ width: '100%', borderRadius: '8px' }}
                                appendTo="self"
                            />
                        </div>

                        {/* Time Selection Grid */}
                        <div className="asm-grid">
                            <div>
                                <label className="asm-label">Start Time</label>
                                <Calendar
                                    value={getDateFromTime(startTime)}
                                    onChange={(e) => handleTimeChange(e, onStartTimeChange)}
                                    timeOnly
                                    hourFormat="12"
                                    showIcon
                                    style={{ width: '100%' }}
                                    appendTo="self"
                                />
                            </div>

                            <div>
                                <label className="asm-label">End Time</label>
                                <Calendar
                                    value={getDateFromTime(endTime)}
                                    onChange={(e) => handleTimeChange(e, onEndTimeChange)}
                                    timeOnly
                                    hourFormat="12"
                                    showIcon
                                    style={{ width: '100%' }}
                                    appendTo="self"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="asm-footer">
                        <button
                            onClick={onClose}
                            style={{
                                padding: '8px 16px', color: '#4b5563', fontWeight: '500',
                                backgroundColor: 'transparent', border: '1px solid transparent',
                                borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSave}
                            style={{
                                padding: '8px 24px', backgroundColor: '#4f46e5', color: 'white',
                                fontWeight: 'bold', border: 'none', borderRadius: '8px',
                                cursor: 'pointer', fontSize: '0.875rem',
                                display: 'flex', alignItems: 'center', gap: '8px',
                                boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
                            }}
                        >
                            Save Configuration
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AttendanceSettingsModal;
