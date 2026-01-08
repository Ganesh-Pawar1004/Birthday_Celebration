import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { db } from '../lib/db';
import type { CelebrationFormData } from '../types';
import { CakeDisplay } from '../components/CakeDisplay';

export function Home() {
    const navigate = useNavigate();
    const [formData, setFormData] = React.useState<CelebrationFormData>({
        recipientName: '',
        message: '',
        flavor: 'chocolate',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const celebration = await db.create(formData);
        navigate(`/intro/${celebration.id}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100 flex flex-col md:flex-row items-center justify-center p-4 gap-8">
            <Helmet>
                <title>Create Virtual Birthday Celebration | Free Online Card & Cake</title>
                <meta name="description" content="Create a personalized virtual birthday celebration with interactive 3D cake, confetti, and wishes. Share the link instantly!" />
                <meta property="og:title" content="Create a Virtual Birthday Surprise! 🎂" />
                <meta property="og:description" content="Design a custom 3D birthday experience for your loved ones in seconds. It's free and magical!" />
                <meta property="og:url" content="https://birthday-celebration-app.netlify.app/" />
            </Helmet>
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full z-10">
                <h1 className="text-3xl font-bold text-center mb-6 text-purple-600 font-handwriting">Virtual Birthday</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Who is it for?</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            value={formData.recipientName}
                            onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                            placeholder="Recipient Name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Happy Birthday!"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cake Flavor</label>
                        <select
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            value={formData.flavor}
                            onChange={(e) => setFormData({ ...formData, flavor: e.target.value as any })}
                        >
                            <option value="chocolate">Chocolate</option>
                            <option value="vanilla">Vanilla</option>
                            <option value="strawberry">Strawberry</option>
                            <option value="red-velvet">Red Velvet</option>
                        </select>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg"
                    >
                        Start Celebration
                    </motion.button>
                </form>
            </div>

            {/* Preview Section */}
            <div className="flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-gray-700 mb-8 font-handwriting">Preview</h2>
                <div className="transform scale-75 md:scale-100">
                    <CakeDisplay
                        flavor={formData.flavor}
                        recipientName={formData.recipientName || 'Name'}
                        onComplete={() => { }} // No-op for preview
                    />
                </div>
                <p className="text-gray-500 mt-8 text-sm">Interactive Preview</p>
            </div>
        </div>
    );
}
