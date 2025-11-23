import { useState, useEffect } from 'react';
import type { Trip } from '@/types';

const STORAGE_KEY = 'travel_planner_trips';

export function useTrips() {
    const [trips, setTrips] = useState<Trip[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    }, [trips]);

    const addTrip = (trip: Trip) => {
        setTrips((prev) => [...prev, trip]);
    };

    const updateTrip = (updatedTrip: Trip) => {
        setTrips((prev) => prev.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)));
    };

    const deleteTrip = (id: string) => {
        setTrips((prev) => prev.filter((t) => t.id !== id));
    };

    const getTrip = (id: string) => {
        return trips.find((t) => t.id === id);
    };

    return { trips, addTrip, updateTrip, deleteTrip, getTrip };
}
