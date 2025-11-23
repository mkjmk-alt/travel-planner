import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useTrips } from '@/hooks/useTrips';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import type { Trip } from '@/types';

export default function CreateTrip() {
    const navigate = useNavigate();
    const { addTrip } = useTrips();
    const [formData, setFormData] = useState({
        title: '',
        destination: '',
        startDate: '',
        endDate: '',
        budget: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newTrip: Trip = {
            id: uuidv4(),
            title: formData.title,
            destination: formData.destination,
            startDate: formData.startDate,
            endDate: formData.endDate,
            budget: Number(formData.budget),
            expenses: [],
            itinerary: [],
        };
        addTrip(newTrip);
        navigate('/');
    };

    return (
        <div className="container mx-auto p-4 max-w-xl">
            <Card className="mt-8 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl">Plan a New Trip</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Trip Title</label>
                            <Input
                                required
                                placeholder="e.g., Summer Vacation in Paris"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Destination</label>
                            <Input
                                required
                                placeholder="e.g., Paris, France"
                                value={formData.destination}
                                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Start Date</label>
                                <Input
                                    required
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">End Date</label>
                                <Input
                                    required
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Total Budget ($)</label>
                            <Input
                                required
                                type="number"
                                placeholder="e.g., 2000"
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            />
                        </div>
                        <div className="pt-4 flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => navigate('/')}>
                                Cancel
                            </Button>
                            <Button type="submit">Create Trip</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
