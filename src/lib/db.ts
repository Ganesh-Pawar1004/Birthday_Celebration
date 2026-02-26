import type { Celebration, CelebrationFormData, Wish, WishFormData } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';

const DB_KEY = 'birthday_celebrations';
const WISHES_KEY = 'birthday_wishes';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase only if credentials are provided
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// LocalStorage Implementation (Fallback)
const localDb = {
    create: (data: CelebrationFormData): Celebration => {
        const celebrations = localDb.getAll();
        const newCelebration: Celebration = {
            ...data,
            id: uuidv4(),
            createdAt: Date.now(),
        };
        celebrations.push(newCelebration);
        localStorage.setItem(DB_KEY, JSON.stringify(celebrations));
        return newCelebration;
    },

    get: (id: string): Celebration | null => {
        const celebrations = localDb.getAll();
        return celebrations.find((c) => c.id === id) || null;
    },

    getAll: (): Celebration[] => {
        const data = localStorage.getItem(DB_KEY);
        return data ? JSON.parse(data) : [];
    },

    addWish: (data: WishFormData): Wish => {
        const wishes = localDb.getAllWishes();
        const newWish: Wish = {
            ...data,
            id: uuidv4(),
            createdAt: Date.now(),
        };
        wishes.push(newWish);
        localStorage.setItem(WISHES_KEY, JSON.stringify(wishes));
        return newWish;
    },

    getWishes: (celebrationId: string): Wish[] => {
        const wishes = localDb.getAllWishes();
        return wishes
            .filter((w) => w.celebrationId === celebrationId)
            .sort((a, b) => b.createdAt - a.createdAt);
    },

    getAllWishes: (): Wish[] => {
        const data = localStorage.getItem(WISHES_KEY);
        return data ? JSON.parse(data) : [];
    }
};

// Async DB Adapter using Supabase (with LocalStorage Fallback)
export const db = {
    // Expose connection status to the UI
    isConnected: (): boolean => {
        return supabase !== null;
    },

    create: async (data: CelebrationFormData): Promise<Celebration> => {
        if (!supabase) return localDb.create(data);

        const newCelebration: Celebration = {
            ...data,
            id: uuidv4(),
            createdAt: Date.now(),
        };

        const imagesJson = newCelebration.images ? JSON.stringify(newCelebration.images) : null;

        try {
            const { error } = await supabase
                .from('celebrations')
                .insert([{
                    id: newCelebration.id,
                    event_type: newCelebration.eventType,
                    recipient_name: newCelebration.recipientName,
                    message: newCelebration.message,
                    flavor: newCelebration.flavor,
                    images: imagesJson,
                    created_at: newCelebration.createdAt
                }]);

            if (error) throw error;
            return newCelebration;
        } catch (err) {
            console.error('Supabase Error:', err);
            console.warn('Using LocalStorage Fallback (Create)');
            return localDb.create(data);
        }
    },

    get: async (id: string): Promise<Celebration | null> => {
        if (!supabase) return localDb.get(id);

        try {
            const { data, error } = await supabase
                .from('celebrations')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (!data) return null;

            let imagesArray = [];
            try {
                if (data.images) {
                    imagesArray = JSON.parse(data.images);
                }
            } catch (e) {
                console.error("Could not parse images JSON", e);
            }

            return {
                id: data.id,
                eventType: data.event_type,
                recipientName: data.recipient_name,
                message: data.message,
                flavor: data.flavor,
                images: imagesArray,
                createdAt: parseInt(data.created_at)
            };
        } catch (err) {
            console.error('Supabase Error:', err);
            console.warn('Using LocalStorage Fallback (Get)');
            return localDb.get(id);
        }
    },

    addWish: async (data: WishFormData): Promise<Wish> => {
        if (!supabase) return localDb.addWish(data);

        const newWish: Wish = {
            ...data,
            id: uuidv4(),
            createdAt: Date.now(),
        };

        try {
            const { error } = await supabase
                .from('wishes')
                .insert([{
                    id: newWish.id,
                    celebration_id: newWish.celebrationId,
                    name: newWish.name,
                    message: newWish.message,
                    created_at: newWish.createdAt
                }]);

            if (error) throw error;
            return newWish;
        } catch (err) {
            console.error('Supabase Error:', err);
            console.warn('Using LocalStorage Fallback (Add Wish)');
            return localDb.addWish(data);
        }
    },

    getWishes: async (celebrationId: string): Promise<Wish[]> => {
        if (!supabase) return localDb.getWishes(celebrationId);

        try {
            const { data, error } = await supabase
                .from('wishes')
                .select('*')
                .eq('celebration_id', celebrationId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return data.map(row => ({
                id: row.id,
                celebrationId: row.celebration_id,
                name: row.name,
                message: row.message,
                createdAt: parseInt(row.created_at)
            }));
        } catch (err) {
            console.error('Supabase Error:', err);
            console.warn('Using LocalStorage Fallback (Get Wishes)');
            return localDb.getWishes(celebrationId);
        }
    }
};
