import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/index.js'; // Load all language support

function PasteViewer() {
    const { shortUrl } = useParams();
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // Adding the loading state
    const [isCopy, setIsCopy] = useState(false);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                setLoading(true);
                const response = await fetch(`https://pastingbuddy.onrender.com/paste/${shortUrl}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch content');
                }
                const data = await response.json();
                setContent(data.content || '');
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (shortUrl) {
            fetchContent();
        }
    }, [shortUrl]);

    useEffect(() => {
        // Highlight code whenever content changes
        if (content) {
            Prism.highlightAll();
        }
    }, [content]);

    const handleCopy = () => {
        navigator.clipboard.writeText(content).then(() => {
            // alert('Content copied to clipboard!');
            setIsCopy(true)
        }).catch((err) => {
            console.error('Failed to copy content:', err);
        });
    };

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#002b36] relative">
            {/* Copy All Button */}
            {!loading && (
                <button
                    onClick={handleCopy}
                    className="absolute top-0 right-0 bg-[#002b36] text-white py-2 px-4 rounded-sm shadow-md hover:bg-[#002b60] transition-all"
                >
                    {isCopy ? "Copied👍" : "Copy All"}
                </button>
            )}

            <div className="flex justify-center">
                <p className={`text-[#839496] ${loading ? 'hidden' : ''}`}>Great👍 Share URL to world</p>
            </div>

            <main className="flex-grow flex items-center justify-center p-4">
                {loading ? (
                    <span className="loading loading-infinity text-white loading-lg"></span>
                ) : (
                    <pre className="w-[90%] h-[90%] overflow-auto p-4 bg-[#002b36] rounded-md">
                        <code className="language-javascript text-[#839496]">
                            {content}
                        </code>
                    </pre>
                )}
            </main>
        </div>
    );
}

export default PasteViewer;
