import React, { useEffect, useState, useRef, useCallback } from 'react';
// import { Card } from 'primereact/card';
import { Image } from 'primereact/image';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';

const server = process.env.REACT_APP_SERVER;

interface Announcement {
    _id: string;
    title: string;
    description: string;
    imageUrl?: string;
    date: string;
    type: 'ADMIN' | 'INCHARGE';
    author: string;
    hostelId?: string;
}

interface AnnouncementListProps {
    refreshTrigger: number;
    hostelId?: string;
    showActions?: boolean;
}

const AnnouncementList: React.FC<AnnouncementListProps> = ({ refreshTrigger, hostelId, showActions = true }) => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const toast = useRef<Toast>(null);

    // Edit State
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<Announcement | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editHostelId, setEditHostelId] = useState('');
    const [editImage, setEditImage] = useState<File | null>(null);
    const [editLoading, setEditLoading] = useState(false);

    const targetOptions = [
        { label: 'All Hostels', value: 'ALL' },
        { label: 'Boys Hostels', value: 'BH' },
        { label: 'Girls Hostels', value: 'GH' }
    ];

    const fetchAnnouncements = useCallback(async () => {
        try {
            setLoading(true);
            let url = `${server}/announcement/get`;
            if (hostelId) {
                url += `?hostelId=${hostelId}`;
            }
            const response = await axios.get(url);
            setAnnouncements(response.data);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            setLoading(false);
        }
    }, [hostelId]);

    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements, refreshTrigger]);

    const handleDelete = (id: string) => {
        confirmDialog({
            message: 'Are you sure you want to delete this announcement?',
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await axios.delete(`${server}/announcement/delete/${id}`);
                    toast.current?.show({ severity: 'success', summary: 'Deleted', detail: 'Announcement deleted' });
                    fetchAnnouncements();
                } catch (error) {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete' });
                }
            }
        });
    };

    const openEditDialog = (item: Announcement) => {
        setEditingItem(item);
        setEditTitle(item.title);
        setEditDescription(item.description);
        setEditHostelId(item.hostelId || 'ALL');
        setEditImage(null);
        setEditDialogVisible(true);
    };

    const handleUpdate = async () => {
        if (!editingItem) return;
        setEditLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', editTitle);
            formData.append('description', editDescription);
            formData.append('hostelId', editHostelId);
            if (editImage) {
                formData.append('image', editImage);
            }

            await axios.put(`${server}/announcement/update/${editingItem._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.current?.show({ severity: 'success', summary: 'Updated', detail: 'Announcement updated' });
            setEditDialogVisible(false);
            fetchAnnouncements();
        } catch (error) {
            console.error(error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to update' });
        } finally {
            setEditLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-column align-items-center justify-content-center p-5">
            <i className="pi pi-spin pi-spinner text-4xl text-primary mb-3"></i>
            <span className="text-gray-500">Loading announcements...</span>
        </div>
    );

    if (announcements.length === 0) return (
        <div className="flex flex-column align-items-center justify-content-center p-6 surface-50 border-round-xl border-1 surface-border border-dashed">
            <div className="bg-blue-50 border-circle p-4 mb-3" style={{ color: '#000080' }}>
                <i className="pi pi-megaphone text-4xl"></i>
            </div>
            <span className="text-xl font-medium text-900 mb-2">No Announcements</span>
            <span className="text-gray-500 text-center max-w-sm">No recent updates or announcements at the moment.</span>
        </div>
    );

    return (
        <div className="flex flex-column gap-4">
            <Toast ref={toast} />

            {announcements.map((item) => (
                <div key={item._id} className="surface-card border-round-xl shadow-2 overflow-hidden transition-all transition-duration-300 hover:shadow-4 border-left-3" style={{ borderLeftColor: '#000080' }}>
                    <div className="flex flex-column md:flex-row">
                        {/* Mobile Header - Author Info */}
                        <div className="flex md:hidden align-items-center justify-content-between p-3 surface-50 border-bottom-1 surface-border">
                            <div className="flex align-items-center gap-2">
                                <div className="flex align-items-center justify-content-center border-circle w-2rem h-2rem text-white font-bold text-sm" style={{ backgroundColor: '#000080' }}>
                                    {item.author ? item.author.charAt(0).toUpperCase() : 'A'}
                                </div>
                                <span className="font-semibold text-700 text-sm">{item.author || 'Admin'}</span>
                            </div>
                            <span className="text-xs text-500 bg-white px-2 py-1 border-round border-1 surface-border">
                                {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                        </div>

                        {/* Desktop Date/Author Sidebar */}
                        <div className="hidden md:flex flex-column align-items-center p-4 bg-blue-50 min-w-min text-center border-right-1 surface-border" style={{ minWidth: '120px' }}>
                            <div className="flex flex-column align-items-center mb-3">
                                <span className="text-3xl font-bold" style={{ color: '#000080' }}>
                                    {new Date(item.date).getDate()}
                                </span>
                                <span className="text-sm font-semibold uppercase text-600">
                                    {new Date(item.date).toLocaleDateString(undefined, { month: 'short' })}
                                </span>
                                <span className="text-xs text-500 mt-1">
                                    {new Date(item.date).getFullYear()}
                                </span>
                            </div>

                            <div className="h-1px w-3rem surface-300 my-2"></div>

                            <div className="flex flex-column align-items-center mt-1">
                                <div className="flex align-items-center justify-content-center border-circle w-2rem h-2rem text-white font-bold text-sm mb-2 shadow-1" style={{ backgroundColor: '#000080' }}>
                                    {item.author ? item.author.charAt(0).toUpperCase() : 'A'}
                                </div>
                                <span className="text-xs font-medium text-600 text-center overflow-hidden text-overflow-ellipsis w-full px-1" title={item.author || 'Admin'}>
                                    {item.author || 'Admin'}
                                </span>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-3 md:p-4 flex flex-column">
                            <div className="flex justify-content-between align-items-start mb-3">
                                <div>
                                    <h3 className="text-xl font-bold text-900 m-0 mb-2 line-height-3">{item.title}</h3>
                                    <div className="flex flex-wrap align-items-center gap-2">
                                        <Tag value={item.type} severity={item.type === 'ADMIN' ? 'danger' : 'info'} rounded className="text-xs font-semibold px-2 py-1"></Tag>
                                        {item.hostelId && <Tag value={item.hostelId} severity="warning" rounded className="text-xs font-semibold px-2 py-1"></Tag>}
                                        <span className="text-xs text-500 md:hidden flex align-items-center gap-1">
                                            <i className="pi pi-clock text-xs"></i>
                                            {new Date(item.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true })}
                                        </span>
                                    </div>
                                </div>

                                {showActions && (
                                    <div className="flex gap-2">
                                        <Button icon="pi pi-pencil" rounded text severity="secondary" size="small" onClick={() => openEditDialog(item)} tooltip="Edit" />
                                        <Button icon="pi pi-trash" rounded text severity="danger" size="small" onClick={() => handleDelete(item._id)} tooltip="Delete" />
                                    </div>
                                )}
                            </div>

                            <div className="text-700 line-height-3 mb-4 text-base" style={{ whiteSpace: 'pre-wrap' }}>
                                {item.description}
                            </div>

                            {/* Footer / Attachments */}
                            <div className="mt-auto pt-3 border-top-1 surface-border flex justify-content-between align-items-center">
                                <div className="flex flex-wrap gap-2">
                                    {item.imageUrl && (
                                        <div className="flex align-items-center gap-2 p-2 border-1 surface-border border-round-lg surface-50 cursor-pointer hover:surface-100 transition-colors">
                                            <Image
                                                src={item.imageUrl}
                                                alt="Attachment"
                                                width="40"
                                                height="40"
                                                className="border-round overflow-hidden"
                                                imageClassName="object-cover"
                                                preview
                                            />
                                            <div className="flex flex-column justify-content-center mr-2">
                                                <span className="text-sm font-semibold text-900">Attachment</span>
                                                <span className="text-xs text-500">Click to view</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <span className="hidden md:flex text-xs text-500 align-items-center gap-1 bg-surface-50 px-2 py-1 border-round">
                                    <i className="pi pi-clock text-xs"></i>
                                    {new Date(item.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <Dialog header="Edit Announcement" visible={editDialogVisible} style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} onHide={() => setEditDialogVisible(false)} className="custom-dialog">
                <div className="flex flex-column gap-4 p-2">
                    <span className="p-float-label mt-2">
                        <InputText id="editTitle" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full" />
                        <label htmlFor="editTitle">Title</label>
                    </span>
                    <span className="p-float-label">
                        <InputTextarea id="editDesc" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={5} className="w-full" />
                        <label htmlFor="editDesc">Description</label>
                    </span>

                    <span className="p-float-label">
                        <Dropdown
                            id="editTarget"
                            value={editHostelId}
                            options={targetOptions}
                            onChange={(e) => setEditHostelId(e.value)}
                            className="w-full"
                        />
                        <label htmlFor="editTarget">Target Audience</label>
                    </span>

                    <div className="flex flex-column gap-2 mb-2">
                        <label className="text-sm font-medium text-700">Update Attachment (Optional)</label>
                        <FileUpload mode="basic" name="image" accept="image/*" maxFileSize={5000000} onSelect={(e) => {
                            let file: File | null = e.files && e.files.length > 0 ? e.files[0] : null;
                            const target = e.originalEvent?.target as HTMLInputElement;
                            if (!file && target && target.files && target.files.length > 0) {
                                file = target.files[0];
                            }
                            if (file) setEditImage(file);
                        }} auto={false} chooseLabel="Choose New Image" className="w-full" />
                    </div>
                    <Button label="Update Announcement" icon="pi pi-check" onClick={handleUpdate} loading={editLoading} style={{ backgroundColor: '#000080', borderColor: '#000080' }} />
                </div>
            </Dialog>
        </div>
    );
};

export default AnnouncementList;
