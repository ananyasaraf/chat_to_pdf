'use client';
import { Upload } from "lucide-react";
import * as React from "react";

const handelFileUploadButton = () => {
    const el = document.createElement('input');
    el.setAttribute('type', 'file');
    el.setAttribute('accept', 'application/pdf');

    el.addEventListener('change', async () => {
        const file = el.files?.item(0); // optional chaining
        if (file) {
            const formData = new FormData();
            formData.append('pdf', file); 

            try {
                const response = await fetch('http://localhost:8000/upload/pdf', {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error(error);
            } finally {
                console.log("file uploaded");
            }
        } else {
            console.warn("No file selected.");
        }
    });

    el.click();
};


const FileUploadComponent: React.FC = () => {
    return (
        <div className="bg-grey-900 rounded-full shadow-md p-4 flex items-center justify-center rounded-lg border-white border-2">
           <div onClick={handelFileUploadButton} className="flex flex-col justify-center items-center">
            <h3>Upload PDF File</h3>
            <Upload/>
           </div>
        </div>
    );
};

export default FileUploadComponent;