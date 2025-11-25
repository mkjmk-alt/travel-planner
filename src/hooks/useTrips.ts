import { useState, useEffect } from 'react';
import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import type { Trip } from '@/types';

export function useTrips() {
    const { user } = useAuth();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setTrips([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'trips'),
            where('userId', '==', user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const tripsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Trip[];
            setTrips(tripsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching trips:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const addTrip = async (trip: Trip) => {
        if (!user) return;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...tripData } = trip; // Remove id as Firestore generates it
        await addDoc(collection(db, 'trips'), {
            ...tripData,
            userId: user.uid,
            createdAt: new Date().toISOString()
        });
    };

    const updateTrip = async (updatedTrip: Trip) => {
        if (!user) return;
        const tripRef = doc(db, 'trips', updatedTrip.id);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...tripData } = updatedTrip;
        await updateDoc(tripRef, tripData);
    };

    const deleteTrip = async (id: string) => {
        if (!user) return;
        await deleteDoc(doc(db, 'trips', id));
    };

    const getTrip = (id: string) => {
        return trips.find((t) => t.id === id);
    };

    return { trips, loading, addTrip, updateTrip, deleteTrip, getTrip };
}
