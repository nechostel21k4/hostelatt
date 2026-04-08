import React, { useState, useEffect, useContext } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputswitch';
import { getMarqueeSettings, updateMarqueeSettings } from '../../services/AdminService';
import { AdminContext } from './AdminHome';

const AdminMarquee = () => {
    const [text, setText] = useState('');
    const [isEnabled, setIsEnabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const { showToast } = useContext(AdminContext);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await getMarqueeSettings();
            if (data) {
                setText(data.text);
                setIsEnabled(data.isEnabled);
            }
        } catch (error) {
            console.error("Failed to load marquee settings", error);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await updateMarqueeSettings(text, isEnabled);
            if (res) {
                showToast('success', 'Success', 'Marquee settings updated!');
            } else {
                showToast('error', 'Error', 'Failed to update.');
            }
        } catch (error) {
            showToast('error', 'Error', 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-content-center p-4">
            <Card title="Marquee Strip Configuration" className="w-full md:w-8 lg:w-6 shadow-4">
                <form onSubmit={handleSave} className="flex flex-column gap-3">
                    <div className="flex flex-column gap-2">
                        <label htmlFor="marqueeText" className="font-bold block mb-2">Marquee Text</label>
                        <InputText
                            id="marqueeText"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Enter announcement text to scroll..."
                            className="w-full"
                        />
                    </div>

                    <div className="flex align-items-center gap-2 mt-2">
                        <InputSwitch checked={isEnabled} onChange={(e) => setIsEnabled(e.value)} />
                        <label className="font-medium">Enable Scrolling Strip</label>
                    </div>

                    <div className="flex justify-content-end mt-4">
                        <Button
                            label="Save Configuration"
                            icon="pi pi-check"
                            loading={loading}
                            type="submit"
                        />
                    </div>
                </form>

                <div className="mt-5 p-3 surface-100 border-round">
                    <p className="font-bold text-gray-700 m-0 mb-2">Preview:</p>
                    {isEnabled ? (
                        <div className="w-full overflow-hidden bg-primary text-white p-2 border-round">
                            <div className="white-space-nowrap overflow-hidden text-overflow-clip">
                                {/* eslint-disable-next-line jsx-a11y/no-distracting-elements */}
                                {React.createElement('marquee', {}, text)}
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">Strip is disabled</p>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AdminMarquee;
