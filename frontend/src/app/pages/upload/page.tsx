'use client'
import React, { useState } from 'react';
import axios from 'axios';

const FileUpload: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string>('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('hi',event.target.files)
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadStatus('Please select a file first.');
            return;
        }

        const formData = new FormData();
        console.log(selectedFile)
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('http://localhost:3001/modules/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUploadStatus('File uploaded successfully!');
            
            console.log('Response:', response);
        } catch (error) {
            setUploadStatus('Error uploading file. Please try again.');
            console.error('Error:', error);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
            <h2>File Upload</h2>
            <input
                type="file"
                accept="*"
                onChange={handleFileChange}
                style={{ marginBottom: '10px', display: 'block' }}
            />
            <button
                onClick={handleUpload}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#007BFF',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                }}
            >
                Upload
            </button>
            {uploadStatus && <p style={{ marginTop: '10px' }}>{uploadStatus}</p>}
        </div>
    );
};

export default FileUpload;