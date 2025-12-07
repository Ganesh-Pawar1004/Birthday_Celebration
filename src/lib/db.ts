import type { Celebration, CelebrationFormData, Wish, WishFormData } from '../types';
import { v4 as uuidv4 } from 'uuid';

const DB_KEY = 'birthday_celebrations';
const WISHES_KEY = 'birthday_wishes';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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

// Async DB Adapter
export const db = {
    create: async (data: CelebrationFormData): Promise<Celebration> => {
        try {
            const res = await fetch(`${API_URL}/celebrations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('API Error');
            return await res.json();
        } catch (err) {
            console.warn('Using LocalStorage Fallback (Create)');
            return localDb.create(data);
        }
    },

    get: async (id: string): Promise<Celebration | null> => {
        try {
            const res = await fetch(`${API_URL}/celebrations/${id}`);
            if (!res.ok) throw new Error('API Error');
            return await res.json();
        } catch (err) {
            console.warn('Using LocalStorage Fallback (Get)');
            return localDb.get(id);
        }
    },

    addWish: async (data: WishFormData): Promise<Wish> => {
        try {
            const res = await fetch(`${API_URL}/wishes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('API Error');
            return await res.json();
        } catch (err) {
            console.warn('Using LocalStorage Fallback (Add Wish)');
            return localDb.addWish(data);
        }
    },

    getWishes: async (celebrationId: string): Promise<Wish[]> => {
        try {
            const res = await fetch(`${API_URL}/wishes/${celebrationId}`);
            if (!res.ok) throw new Error('API Error');
            return await res.json();
        } catch (err) {
            console.warn('Using LocalStorage Fallback (Get Wishes)');
            return localDb.getWishes(celebrationId);
        }
    }
};
