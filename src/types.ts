export type EventType = 'birthday' | 'baby-shower';

export interface Celebration {
    id: string;
    eventType: EventType;
    recipientName: string;
    message: string;
    flavor: 'chocolate' | 'vanilla' | 'strawberry' | 'red-velvet';
    images?: string[];
    createdAt: number;
}

export type CelebrationFormData = Omit<Celebration, 'id' | 'createdAt'>;

export interface Wish {
    id: string;
    celebrationId: string;
    name: string;
    message: string;
    createdAt: number;
}

export type WishFormData = Omit<Wish, 'id' | 'createdAt'>;
