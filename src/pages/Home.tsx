import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { db } from '../lib/db';
import type { CelebrationFormData } from '../types';
import { CakeDisplay } from '../components/CakeDisplay';
import { ImagePlus, X } from 'lucide-react';
import { ConnectionStatus } from '../components/ConnectionStatus';

export function Home() {
    const navigate = useNavigate();
    const [formData, setFormData] = React.useState<CelebrationFormData>({
        eventType: 'birthday',
        recipientName: '',
        message: '',
        flavor: 'chocolate',
        images: [],
    });

    const isBabyShower = formData.eventType === 'baby-shower';

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const currentImages = formData.images || [];
        const newImagesOptions = Array.from(files).slice(0, 4 - currentImages.length);

        if (newImagesOptions.length === 0) {
            alert("You can only upload up to 4 images.");
            return;
        }

        const base64Promises = newImagesOptions.map(file => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const MAX_WIDTH = 800;
                        const MAX_HEIGHT = 800;
                        let width = img.width;
                        let height = img.height;

                        if (width > height) {
                            if (width > MAX_WIDTH) {
                                height *= MAX_WIDTH / width;
                                width = MAX_WIDTH;
                            }
                        } else {
                            if (height > MAX_HEIGHT) {
                                width *= MAX_HEIGHT / height;
                                height = MAX_HEIGHT;
                            }
                        }
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx?.drawImage(img, 0, 0, width, height);
                        resolve(canvas.toDataURL('image/jpeg', 0.7)); // Compress to 70% JPEG
                    };
                    img.src = event.target?.result as string;
                };
                reader.onerror = error => reject(error);
                reader.readAsDataURL(file);
            });
        });

        try {
            const compressedImages = await Promise.all(base64Promises);
            setFormData(prev => ({
                ...prev,
                images: [...(prev.images || []), ...compressedImages].slice(0, 4)
            }));
        } catch (error) {
            console.error("Error compressing images", error);
            alert("Oops! There was a problem processing your images.");
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => {
            const newImages = [...(prev.images || [])];
            newImages.splice(index, 1);
            return { ...prev, images: newImages };
        });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const celebration = await db.create(formData);
        navigate(`/intro/${celebration.id}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100 flex flex-col md:flex-row items-center justify-center p-4 gap-8">
            <Helmet>
                <title>{isBabyShower ? 'Create Virtual Baby Shower | Send Online Wishes' : 'Create Virtual Birthday Celebration | Free Online Card & Cake'}</title>
                <meta name="description" content="Create a personalized virtual birthday celebration with interactive 3D cake, confetti, and wishes. Share the link instantly!" />
                <meta property="og:title" content="Create a Virtual Birthday Surprise! 🎂" />
                <meta property="og:description" content="Design a custom 3D birthday experience for your loved ones in seconds. It's free and magical!" />
                <meta property="og:url" content="https://birthday-celebration-app.netlify.app/" />
            </Helmet>

            <ConnectionStatus />

            <div className={`bg-white rounded-2xl shadow-xl p-8 max-w-md w-full z-10 border-t-8 ${isBabyShower ? 'border-teal-300' : 'border-purple-500'}`}>
                <h1 className={`text-3xl font-bold text-center mb-6 font-handwriting ${isBabyShower ? 'text-teal-600' : 'text-purple-600'}`}>
                    {isBabyShower ? "Send Joy & Blessings 🍼" : "Virtual Birthday"}
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                        <div className="flex gap-4">
                            <label className="flex items-center cursor-pointer">
                                <input type="radio" value="birthday" checked={formData.eventType === 'birthday'} onChange={() => setFormData({ ...formData, eventType: 'birthday' })} className="mr-2 text-purple-600 focus:ring-purple-500" />
                                🎂 Birthday
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input type="radio" value="baby-shower" checked={formData.eventType === 'baby-shower'} onChange={() => setFormData({ ...formData, eventType: 'baby-shower' })} className="mr-2 text-teal-500 focus:ring-teal-400" />
                                🍼 Baby Shower
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {isBabyShower ? "Colleague / Parents-to-be Name" : "Who is it for?"}
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            value={formData.recipientName}
                            onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                            placeholder={isBabyShower ? "e.g. Sarah & Mark" : "Recipient Name"}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder={isBabyShower ? "Wishing you endless joy, sleep, and wonderful moments with your new little one! We will miss you!" : "Happy Birthday!"}
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

                    {/* Image Upload Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Add Photos (Max 4)</label>

                        <div className="flex flex-wrap gap-2 mb-2">
                            {(formData.images || []).map((imgUrl, index) => (
                                <div key={index} className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-200 shadow-sm">
                                    <img src={imgUrl} alt={`Upload ${index}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-md hover:bg-red-600 transition-colors"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}

                            {(formData.images || []).length < 4 && (
                                <label className="w-16 h-16 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                    <ImagePlus size={20} className="text-gray-400" />
                                </label>
                            )}
                        </div>
                        <p className="text-xs text-gray-400">Add some lovely photos to display during the event!</p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className={`w-full text-white py-3 rounded-lg font-semibold transition-colors shadow-lg ${isBabyShower ? 'bg-teal-500 hover:bg-teal-600' : 'bg-purple-600 hover:bg-purple-700'}`}
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
                        eventType={formData.eventType}
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
