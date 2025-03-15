// utils/cloudinary.js
export const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset',import.meta.env.VITE_CLOUDINARY_UPLAOD_PRESET);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    );
  
    if (!response.ok) throw new Error('Image upload failed');
    return (await response.json()).secure_url;
  };