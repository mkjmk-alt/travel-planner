import { Link } from 'react-router-dom';
import { useTrips } from '@/hooks/useTrips';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Plus, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
    const { trips } = useTrips();

    return (
        <div className="container mx-auto p-4 max-w-5xl">
            <header className="flex justify-between items-center mb-8 mt-8">
                <h1 className="text-3xl font-bold tracking-tight">My Trips</h1>
                <Link to="/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Trip
                    </Button>
                </Link>
            </header>

            {trips.length === 0 ? (
                <div className="text-center py-20 border rounded-lg bg-muted/10">
                    <h2 className="text-xl font-semibold mb-2">No trips planned yet</h2>
                    <p className="text-muted-foreground mb-6">Start planning your next adventure!</p>
                    <Link to="/create">
                        <Button variant="default">Start Planning</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trips.map((trip) => (
                        <Link key={trip.id} to={`/trip/${trip.id}`}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full border-l-4 border-l-primary">
                                <CardHeader>
                                    <CardTitle className="text-xl">{trip.title}</CardTitle>
                                    <CardDescription className="flex items-center mt-1">
                                        <MapPin className="mr-1 h-3 w-3" /> {trip.destination}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                                    </div>
                                    <div className="mt-4 flex justify-between items-center">
                                        <span className="text-sm font-medium bg-secondary px-2 py-1 rounded">
                                            Budget: ${trip.budget.toLocaleString()}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
