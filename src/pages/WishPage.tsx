import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../lib/db';
import { Send } from 'lucide-react';
import type { Celebration } from '../types';

export function WishPage() {
    const { id } = useParams();
    const [celebration, setCelebration] = useState<Celebration | null>(null);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (id) {
            db.get(id).then(setCelebration);
        }
    }, [id]);

    if (!celebration) return <div>Loading...</div>;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (id) {
            await db.addWish({
                celebrationId: id,
                name,
                message
            });
            setIsSubmitted(true);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                    <h1 className="text-3xl font-bold text-purple-600 font-handwriting mb-4">Thank You!</h1>
                    <p className="text-gray-600 mb-6">Your wish has been saved for {celebration.recipientName}.</p>
                    <div className="text-6xl mb-4">💌</div>
                    <p className="text-sm text-gray-500">The birthday person will see your note during the celebration!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                <h1 className="text-3xl font-bold text-center mb-2 text-purple-600 font-handwriting">Send a Wish</h1>
                <p className="text-center text-gray-600 mb-6">to {celebration.recipientName}</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                        <textarea
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none h-32"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write a sweet message..."
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <Send size={20} />
                        Send Wish
                    </button>
                </form>
            </div>
        </div>
    );
}
