
import React, { useState, useEffect, useRef } from 'react';

interface AnimatedHeroProps {
    imageUrls: string[];
}

export const AnimatedHero: React.FC<AnimatedHeroProps> = ({ imageUrls }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (imageUrls.length <= 1) return;
        
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
        }, 5000); // Đổi ảnh mỗi 5 giây

        return () => clearInterval(intervalId);
    }, [imageUrls.length]);

    if (!imageUrls || imageUrls.length === 0) {
        return <div className="w-full h-[60vh] bg-background-tertiary" />;
    }

    return (
        <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-black">
            {imageUrls.map((url, index) => (
                <div 
                    key={url}
                    className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out flex items-center justify-center"
                    style={{ opacity: index === currentIndex ? 1 : 0 }}
                >
                    {/* Ảnh nền mờ để tạo hiệu ứng đầy đủ 2 phương */}
                    <img
                        src={url}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover blur-xl opacity-30 scale-110"
                    />
                    {/* Ảnh chính hiển thị trọn vẹn (object-contain) */}
                    <img
                        src={url}
                        alt={`Group background image ${index + 1}`}
                        className="relative z-10 max-w-full max-h-full object-contain shadow-2xl"
                    />
                </div>
            ))}
        </div>
    );
};
