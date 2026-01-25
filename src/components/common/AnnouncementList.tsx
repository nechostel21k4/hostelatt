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
    }, [fetchAnnouncements]);

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

    if (loading) return <div className="text-center p-4">Loading announcements...</div>;
    if (announcements.length === 0) return <div className="text-center p-4">No announcements found.</div>;

    return (
        <div className="flex flex-column gap-3">
            <Toast ref={toast} />

            {announcements.map((item) => (
                <div key={item._id} className="flex flex-column md:flex-row border-round-xl overflow-hidden shadow-2 mb-3 bg-white surface-card transition-all transition-duration-300 hover:shadow-4">
                    {/* Left Side - Colored Block with Initial - REDUCED SIZE */}
                    <div className="w-full md:w-8rem bg-blue-500 flex flex-row md:flex-column align-items-center justify-content-between md:justify-content-center p-3 md:p-2 text-white flex-shrink-0">
                        <div className="flex align-items-center gap-3 md:flex-column md:gap-0">
                            <span className="text-4xl font-bold md:mb-2">
                                {item.author ? item.author.charAt(0).toUpperCase() : 'A'}
                            </span>
                            <span className="text-xs font-medium text-blue-100 text-center hidden md:block">{item.author || 'Admin'}</span>
                            <span className="text-lg font-bold md:hidden">{item.author || 'Admin'}</span>
                        </div>
                    </div>

                    {/* Right Side - Information - REDUCED PADDING */}
                    <div className="flex-1 p-3 flex flex-column">
                        {/* Header */}
                        <div className="flex flex-column md:flex-row justify-content-between align-items-start mb-2 gap-2">
                            <div className="w-full">
                                <h3 className="text-lg font-bold text-900 m-0 mb-1">{item.title}</h3>
                                <div className="flex flex-wrap align-items-center text-500 gap-2 text-xs">
                                    <i className="pi pi-calendar" style={{ fontSize: '0.8rem' }}></i>
                                    <span>{new Date(item.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                                    <span className="hidden md:inline">•</span>
                                    <span className="block md:inline">{new Date(item.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                                </div>
                            </div>

                            {/* Actions & Badges - SCALED DOWN */}
                            <div className="flex flex-wrap align-items-center justify-content-between w-full md:w-auto gap-2 mt-2 md:mt-0">
                                <div className="flex align-items-center gap-2">
                                    <Tag value={item.type} severity={item.type === 'ADMIN' ? 'danger' : 'info'} rounded className="px-2 text-xs"></Tag>
                                    {item.hostelId && <Tag value={item.hostelId} severity="warning" rounded className="px-2 text-xs"></Tag>}
                                </div>

                                {showActions && (
                                    <div className="flex gap-1 ml-auto md:ml-2">
                                        <Button icon="pi pi-pencil" rounded text severity="secondary" size="small" onClick={() => openEditDialog(item)} />
                                        <Button icon="pi pi-trash" rounded text severity="danger" size="small" onClick={() => handleDelete(item._id)} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="text-700 line-height-3 mb-3 text-sm" style={{ whiteSpace: 'pre-wrap' }}>
                            {item.description}
                        </div>

                        {/* Footer Info / Image */}
                        <div className="mt-auto">
                            {item.imageUrl && (
                                <div className="flex align-items-center gap-2 p-2 border-1 surface-border border-round surface-50 w-fit cursor-pointer hover:surface-100 transition-colors">
                                    <Image
                                        src={item.imageUrl}
                                        alt="Attachment"
                                        width="80"
                                        preview
                                        className="border-round"
                                        imageClassName="border-round"
                                    />
                                    <span className="text-xs text-600 font-medium px-2">View Attachment</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            <Dialog header="Edit Announcement" visible={editDialogVisible} style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} onHide={() => setEditDialogVisible(false)}>
                <div className="flex flex-column gap-3">
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

                    <div className="flex flex-column gap-2">
                        <label>Change Image (Optional)</label>
                        <FileUpload mode="basic" name="image" accept="image/*" maxFileSize={5000000} onSelect={(e) => {
                            let file = e.files && e.files.length > 0 ? e.files[0] : null;
                            const target = e.originalEvent?.target as HTMLInputElement;
                            if (!file && target && target.files && target.files.length > 0) {
                                file = target.files[0];
                            }
                            if (file) setEditImage(file);
                        }} auto={false} chooseLabel="Select New Image" />
                    </div>
                    <Button label="Update" icon="pi pi-check" onClick={handleUpdate} loading={editLoading} />
                </div>
            </Dialog>
        </div>
    );
};

export default AnnouncementList;
