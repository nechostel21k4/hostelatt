import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Image } from 'primereact/image';
import axios from 'axios';

const server = process.env.REACT_APP_SERVER;

interface AddAnnouncementProps {
    hostelId?: string | null;
    type: 'ADMIN' | 'INCHARGE';
    author: string;
    onSuccess: () => void;
}

const AddAnnouncement: React.FC<AddAnnouncementProps> = ({ hostelId: initialHostelId, type, author, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [targetAudience, setTargetAudience] = useState<string | null>(initialHostelId || null);
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const fileUploadRef = useRef<FileUpload>(null);

    // Options for Admin Target Audience
    const targetOptions = [
        { label: 'All Hostels', value: null },
        { label: 'Boys Hostels', value: 'BH' },
        { label: 'Girls Hostels', value: 'GH' }
    ];

    useEffect(() => {
        // If it's INCHARGE, force their hostelId
        if (type === 'INCHARGE' && initialHostelId) {
            setTargetAudience(initialHostelId);
        }
    }, [type, initialHostelId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !description) {
            toast.current?.show({ severity: 'warn', summary: 'Warning', detail: 'Title and Description are required' });
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('type', type);
        formData.append('author', author);

        // Handle target audience
        if (targetAudience) {
            formData.append('hostelId', targetAudience);
        }

        if (image) {
            formData.append('image', image);
        }

        setLoading(true);

        try {
            await axios.post(`${server}/announcement/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Announcement posted successfully' });

            // Reset Form
            setTitle('');
            setDescription('');
            setImage(null);
            setImagePreview(null);
            if (fileUploadRef.current) {
                fileUploadRef.current.clear();
            }
            // For Admin, reset to 'All', for Incharge keep their ID
            if (type === 'ADMIN') setTargetAudience(null);

            onSuccess();
        } catch (error) {
            console.error(error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to create announcement. Check connection or image size.' });
        } finally {
            setLoading(false);
        }
    };

    // Clean up preview URL on unmount or change
    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const onFileSelect = (e: any) => {
        let file = e.files && e.files.length > 0 ? e.files[0] : null;

        // Fallback to native event if PrimeReact check fails
        const target = e.originalEvent?.target as HTMLInputElement;
        if (!file && target && target.files && target.files.length > 0) {
            file = target.files[0];
        }

        if (file) {
            setImage(file);
            // Verify it is a blob/file before creating URL
            if (file instanceof Blob || file instanceof File) {
                const objectUrl = URL.createObjectURL(file);
                setImagePreview(objectUrl);
            }
        }
    };

    const onClearImage = () => {
        setImage(null);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
        }
        if (fileUploadRef.current) {
            fileUploadRef.current.clear();
        }
    }

    return (
        <div className="card">
            <Toast ref={toast} />
            <h3>Create Announcement</h3>
            <form onSubmit={handleSubmit} className="flex flex-column gap-3">
                {type === 'ADMIN' && (
                    <span className="p-float-label mt-2">
                        <Dropdown
                            inputId="target"
                            value={targetAudience}
                            options={targetOptions}
                            onChange={(e) => setTargetAudience(e.value)}
                            placeholder="Select Target Audience"
                            className="w-full"
                        />
                        <label htmlFor="target">Target Audience</label>
                    </span>
                )}

                <span className="p-float-label mt-2">
                    <InputText id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full" />
                    <label htmlFor="title">Title</label>
                </span>

                <span className="p-float-label">
                    <InputTextarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="w-full" />
                    <label htmlFor="description">Description</label>
                </span>

                <div className="flex flex-column gap-2">
                    <label className="font-bold">Image (Optional):</label>
                    <div className="flex align-items-center gap-3">
                        <FileUpload
                            ref={fileUploadRef}
                            mode="basic"
                            name="image"
                            accept="image/*"
                            maxFileSize={5000000}
                            onSelect={onFileSelect}
                            auto={false}
                            chooseLabel={image ? "Change Image" : "Select Image"}
                        />
                        {image && (
                            <Button
                                type="button"
                                icon="pi pi-times"
                                className="p-button-rounded p-button-danger p-button-text"
                                onClick={onClearImage}
                                tooltip="Remove Image"
                            />
                        )}
                    </div>
                </div>

                {imagePreview && (
                    <div className="mt-2 border-round overflow-hidden surface-overlay border-1 surface-border p-2" style={{ maxWidth: '300px' }}>
                        <Image src={imagePreview} alt="Preview" width="100%" preview />
                        <div className="text-center text-sm text-gray-600 mt-1">{image?.name}</div>
                    </div>
                )}

                <Button label="Post Announcement" icon="pi pi-send" loading={loading} type="submit" />
            </form>
        </div>
    );
};

export default AddAnnouncement;
