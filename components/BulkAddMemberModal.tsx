
import React, { useState, useCallback } from 'react';
import Modal from './Modal';
import { CameraIcon } from './icons/CameraIcon';
import { TrashIcon } from './icons/TrashIcon';
import { UserPlusIcon } from './icons/UserPlusIcon';
import { fileToBase64, compressImage } from '../utils/imageUtils';

interface BulkAddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (images: string[]) => void;
    memberType: 'Thành viên' | 'Khách mời';
}

export const BulkAddMemberModal: React.FC<BulkAddMemberModalProps> = ({ isOpen, onClose, onAdd, memberType }) => {
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileChange = (files: FileList | null) => {
        if (files) {
            const newFiles = Array.from(files);
            setImageFiles(prev => [...prev, ...newFiles]);
            newFiles.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviews(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleRemoveImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (imageFiles.length === 0) return;
        
        setIsProcessing(true);
        try {
            // Nén ảnh thông minh: 400px, 30% quality (0.3)
            const compressedImages = await Promise.all(imageFiles.map(async (file) => {
                const b64 = await fileToBase64(file);
                return await compressImage(b64, 400, 0.3);
            }));
            
            onAdd(compressedImages);
            setImageFiles([]);
            setPreviews([]);
            onClose();
        } catch (error) {
            console.error("Error processing images:", error);
            alert("Có lỗi khi xử lý hình ảnh. Vui lòng thử lại với ảnh nhỏ hơn.");
        } finally {
            setIsProcessing(false);
        }
    };
    
    const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileChange(e.dataTransfer.files);
        }
    }, []);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Thêm hàng loạt ${memberType}`}>
            <div className="p-6 space-y-4">
                <div 
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-border-primary'}`}
                >
                    <input
                        type="file"
                        id="imageUpload"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleFileChange(e.target.files)}
                        className="hidden"
                    />
                    <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center justify-center space-y-2 text-text-secondary">
                        <div className="p-4 bg-primary-50 rounded-full">
                            <CameraIcon className="w-12 h-12 text-primary-600" />
                        </div>
                        <span className="font-black text-text-primary text-lg">Kéo và thả ảnh vào đây</span>
                        <span>hoặc <span className="text-primary-600 font-black underline decoration-2 underline-offset-4">nhấn để chọn tệp</span></span>
                        <span className="text-xs font-bold text-text-secondary">Ảnh sẽ được tự động nén thông minh để tiết kiệm bộ nhớ.</span>
                    </label>
                </div>
                
                {previews.length > 0 && (
                    <div>
                        <h3 className="font-black mb-2 text-text-primary uppercase text-xs tracking-widest">Ảnh đã chọn ({previews.length}):</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 max-h-64 overflow-y-auto p-3 bg-background-tertiary rounded-xl border border-border-primary">
                            {previews.map((src, index) => (
                                <div key={index} className="relative group aspect-square rounded-lg overflow-hidden shadow-sm">
                                    <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label="Xóa ảnh"
                                        disabled={isProcessing}
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <div className="flex justify-end space-x-4 pt-4 border-t border-border-primary">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="px-6 py-2 bg-background-tertiary text-text-primary rounded-full font-bold hover:bg-background-tertiary-hover transition-colors"
                        disabled={isProcessing}
                    >
                        HỦY
                    </button>
                    <button 
                        type="button" 
                        onClick={handleSubmit} 
                        disabled={imageFiles.length === 0 || isProcessing}
                        className="px-8 py-2 bg-primary-600 text-white rounded-full font-bold hover:bg-primary-700 disabled:bg-primary-300 disabled:cursor-not-allowed flex items-center shadow-lg transition-all transform hover:scale-105"
                    >
                        {isProcessing ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                ĐANG NÉN ẢNH...
                            </>
                        ) : (
                            <>
                                <UserPlusIcon className="w-5 h-5 mr-2" />
                                THÊM {imageFiles.length > 0 ? `${imageFiles.length} ` : ''}{memberType.toUpperCase()}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
