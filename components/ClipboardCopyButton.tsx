import React, { useState } from 'react';
import { ClipboardDocumentIcon } from './icons/ClipboardDocumentIcon';
import { CheckIcon } from './icons/CheckIcon';

interface ClipboardCopyButtonProps {
    contentToCopy: string;
    className?: string;
    buttonText?: string;
    copiedText?: string;
}

export const ClipboardCopyButton: React.FC<ClipboardCopyButtonProps> = ({ 
    contentToCopy, 
    className, 
    buttonText = "Sao chép nội dung", 
    copiedText = "Đã sao chép!" 
}) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        if (!navigator.clipboard) {
            alert('Không thể sao chép. Trình duyệt của bạn không hỗ trợ tính năng này.');
            return;
        }
        try {
            await navigator.clipboard.writeText(contentToCopy);
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
            }, 2000); // Reset after 2 seconds
        } catch (err) {
            console.error('Failed to copy: ', err);
            alert('Sao chép thất bại!');
        }
    };

    const defaultClassName = "flex items-center px-3 py-1.5 text-sm bg-background-tertiary text-text-secondary rounded-md hover:bg-background-tertiary-hover transition-colors duration-200";

    return (
        <button onClick={handleCopy} className={className || defaultClassName} aria-label={buttonText}>
            {isCopied ? (
                <>
                    <CheckIcon className="w-5 h-5 mr-2 text-green-500" />
                    <span className="text-green-500 font-semibold">{copiedText}</span>
                </>
            ) : (
                <>
                    <ClipboardDocumentIcon className="w-5 h-5 mr-2" />
                    <span>{buttonText}</span>
                </>
            )}
        </button>
    );
};