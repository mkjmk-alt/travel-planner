export type ExpenseCategory = 'Food' | 'Transport' | 'Accommodation' | 'Shopping' | 'Activities' | 'Other';

export interface Expense {
    id: string;
    amount: number;
    category: ExpenseCategory;
    date: string; // ISO date string
    note: string;
}

export interface ItineraryItem {
    id: string;
    dayIndex: number; // 0-based index relative to trip start date
    time: string; // HH:mm
    activity: string;
    location?: string;
    notes?: string;
}

export interface Trip {
    id: string;
    title: string;
    destination: string;
    startDate: string; // ISO date string
    endDate: string; // ISO date string
    budget: number;
    expenses: Expense[];
    itinerary: ItineraryItem[];
    coverImage?: string;
}
