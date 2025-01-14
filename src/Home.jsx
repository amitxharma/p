import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [content, setContent] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [isSaving, setIsSaving] = useState(false); // State for loader
    const navigate = useNavigate();

    useEffect(() => {
        // Detect if the user is on a mobile device
        const updateIsMobile = () => setIsMobile(window.innerWidth <= 768);
        updateIsMobile();
        window.addEventListener('resize', updateIsMobile);
        return () => {
            window.removeEventListener('resize', updateIsMobile);
        };
    }, []);

    useEffect(() => {
        const handleSaveShortcut = async (event) => {
            if (!isMobile && event.ctrlKey && event.key === 's') {
                event.preventDefault();
                await saveContent();
            }
        };

        window.addEventListener('keydown', handleSaveShortcut);

        return () => {
            window.removeEventListener('keydown', handleSaveShortcut);
        };
    }, [content, isMobile]);

    const saveContent = async () => {
        setIsSaving(true); // Start loader
        try {
            const response = await fetch('https://pastingbuddy.onrender.com/paste', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content }),
            });

            if (!response.ok) {
                throw new Error('Failed to save content');
            }

            const data = await response.json();
            const shortUrl = data.shortUrl;

            // Navigate to the view component with the new URL
            navigate(`/${shortUrl}`);
        } catch (error) {
            console.error('Error saving content:', error.message);
        } finally {
            setIsSaving(false); // Stop loader
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#002b36]">
            {/* Save Button for Mobile */}
            {isMobile && (
                <button
                    onClick={saveContent}
                    className="absolute -rotate-90 top-40 left-1 bg-blue-500 text-white py-2 px-6 rounded-md shadow-md hover:bg-blue-600 transition-all"
                >
                    Save
                </button>
            )}

            <main className="flex-grow flex items-center justify-center p-4">
                <textarea
                    className="w-[90%] h-[90%] overflow-auto border-0 p-0 outline-none resize-none font-mono text-base absolute top-8 right-8 bottom-8 left-16 bg-[#002b36] caret-blue-500 text-[#839496]"
                    placeholder="Type or paste something "
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
                {!content && !isMobile && (
                    <div className="absolute font-extrabold text-6xl opacity-10">Ctrl + S to save</div>
                )}
                {isSaving && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Home;
