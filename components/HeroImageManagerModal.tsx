import React, { useState, useRef } from 'react';
import Modal from './Modal';
import { TrashIcon } from './icons/TrashIcon';
import { CameraIcon } from './icons/CameraIcon';
import { fileToBase64, compressImage } from '../utils/imageUtils';

interface HeroImageManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    images: string[];
    onSave: (newImages: string[]) => void;
}

export const HeroImageManagerModal: React.FC<HeroImageManagerModalProps> = ({ isOpen, onClose, images, onSave }) => {
    const [currentImages, setCurrentImages] = useState(images);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleRemoveImage = (index: number) => {
        setCurrentImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleAddImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setIsProcessing(true);
            // Fix: Cast files from FileList to File array to ensure 'file' in map is correctly typed as File (avoids 'unknown' type error)
            const files = Array.from(e.target.files) as File[];
            const processedImages = await Promise.all(files.map(async (file) => {
                const b64 = await fileToBase64(file);
                // Slideshow cần ảnh rộng hơn nên resize lên 1000px, nén 40%
                return await compressImage(b64, 1000, 0.4);
            }));
            setCurrentImages(prev => [...prev, ...processedImages]);
            setIsProcessing(false);
        }
    };

    const handleSave = () => {
        onSave(currentImages);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Quản lý ảnh bìa động">
            <div className="p-6 space-y-4">
                <p className="text-text-secondary text-sm">Thêm hoặc xóa các ảnh sẽ được hiển thị trong slideshow trên trang chủ. Ảnh sẽ được tự động nén để chạy mượt hơn.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-3 bg-background-tertiary rounded-xl border border-border-primary">
                    {currentImages.map((src, index) => (
                        <div key={index} className="relative group aspect-video rounded-lg overflow-hidden shadow-sm">
                            <img src={src} alt={`Cover image ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Xóa ảnh"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        accept="image/*"
                        onChange={handleAddImages}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isProcessing}
                        className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-primary-300 rounded-lg text-text-secondary hover:bg-primary-50 hover:border-primary-500 transition-all group"
                    >
                        {isProcessing ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        ) : (
                            <>
                                <CameraIcon className="w-8 h-8 mb-2 text-primary-400 group-hover:text-primary-600" />
                                <span className="font-bold text-xs uppercase">Thêm ảnh</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-border-primary">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-background-tertiary text-text-primary rounded-full font-bold hover:bg-background-tertiary-hover">
                        HỦY
                    </button>
                    <button 
                        type="button" 
                        onClick={handleSave} 
                        className="px-8 py-2 bg-primary-600 text-white rounded-full font-bold hover:bg-primary-700 shadow-lg transform hover:scale-105 active:scale-95 transition-all"
                    >
                        LƯU THAY ĐỔI
                    </button>
                </div>
            </div>
        </Modal>
    );
};
