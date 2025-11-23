
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrips } from '@/hooks/useTrips';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArrowLeft, Calendar, Wallet, Plus, Trash2 } from 'lucide-react';
import { format, differenceInDays, addDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '@/components/ui/Input';
import type { ItineraryItem, Expense } from '@/types';

export default function TripDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getTrip, updateTrip } = useTrips();
    const trip = getTrip(id!);
    const [activeTab, setActiveTab] = useState<'itinerary' | 'budget'>('itinerary');

    const [editingDay, setEditingDay] = useState<number | null>(null);
    const [newActivity, setNewActivity] = useState({ time: '', activity: '', location: '' });

    const [showExpenseForm, setShowExpenseForm] = useState(false);
    const [newExpense, setNewExpense] = useState({ amount: '', category: 'Food', note: '' });

    if (!trip) {
        return <div className="p-8 text-center">Trip not found</div>;
    }

    const days = differenceInDays(new Date(trip.endDate), new Date(trip.startDate)) + 1;

    const handleAddActivity = (dayIndex: number) => {
        if (!newActivity.activity) return;
        const newItem: ItineraryItem = {
            id: uuidv4(),
            dayIndex,
            time: newActivity.time,
            activity: newActivity.activity,
            location: newActivity.location,
        };
        const updatedTrip = { ...trip, itinerary: [...trip.itinerary, newItem] };
        updateTrip(updatedTrip);
        setEditingDay(null);
        setNewActivity({ time: '', activity: '', location: '' });
    };

    const handleDeleteActivity = (itemId: string) => {
        const updatedTrip = { ...trip, itinerary: trip.itinerary.filter(item => item.id !== itemId) };
        updateTrip(updatedTrip);
    };

    const handleAddExpense = () => {
        if (!newExpense.amount || !newExpense.category) return;
        const item: Expense = {
            id: uuidv4(),
            amount: Number(newExpense.amount),
            category: newExpense.category as any,
            date: new Date().toISOString(),
            note: newExpense.note,
        };
        const updatedTrip = { ...trip, expenses: [...trip.expenses, item] };
        updateTrip(updatedTrip);
        setShowExpenseForm(false);
        setNewExpense({ amount: '', category: 'Food', note: '' });
    };

    const totalSpent = trip.expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const remainingBudget = trip.budget - totalSpent;
    const progress = Math.min((totalSpent / trip.budget) * 100, 100);

    return (
        <div className="container mx-auto p-4 max-w-5xl">
            <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold">{trip.title}</h1>
                    <p className="text-muted-foreground text-lg">{trip.destination}</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                        {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                    </div>
                </div>
            </div>

            <div className="flex space-x-2 mb-6 border-b">
                <Button
                    variant={activeTab === 'itinerary' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('itinerary')}
                    className="rounded-b-none"
                >
                    <Calendar className="mr-2 h-4 w-4" /> Itinerary
                </Button>
                <Button
                    variant={activeTab === 'budget' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('budget')}
                    className="rounded-b-none"
                >
                    <Wallet className="mr-2 h-4 w-4" /> Budget & Expenses
                </Button>
            </div>

            {activeTab === 'itinerary' && (
                <div className="space-y-6">
                    {Array.from({ length: days }).map((_, index) => {
                        const date = addDays(new Date(trip.startDate), index);
                        const dayActivities = trip.itinerary.filter(item => item.dayIndex === index).sort((a, b) => a.time.localeCompare(b.time));

                        return (
                            <Card key={index}>
                                <CardHeader className="pb-2 border-b bg-muted/20 flex flex-row justify-between items-center">
                                    <CardTitle className="text-lg font-medium">
                                        Day {index + 1} - {format(date, 'EEEE, MMM d')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    {dayActivities.length === 0 ? (
                                        <div className="text-sm text-muted-foreground italic mb-4">No activities planned.</div>
                                    ) : (
                                        <div className="space-y-3 mb-4">
                                            {dayActivities.map((item) => (
                                                <div key={item.id} className="flex items-start border-l-2 border-primary pl-3 py-1 group">
                                                    <div className="w-16 text-sm font-bold text-muted-foreground">{item.time || 'Any'}</div>
                                                    <div className="flex-1">
                                                        <div className="font-medium">{item.activity}</div>
                                                        {item.location && <div className="text-xs text-muted-foreground">{item.location}</div>}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => handleDeleteActivity(item.id)}
                                                    >
                                                        <Trash2 className="h-3 w-3 text-destructive" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {editingDay === index ? (
                                        <div className="bg-muted/30 p-4 rounded-md space-y-3">
                                            <div className="grid grid-cols-2 gap-2">
                                                <Input
                                                    type="time"
                                                    value={newActivity.time}
                                                    onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                                                />
                                                <Input
                                                    placeholder="Location"
                                                    value={newActivity.location}
                                                    onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                                                />
                                            </div>
                                            <Input
                                                placeholder="Activity Description"
                                                value={newActivity.activity}
                                                onChange={(e) => setNewActivity({ ...newActivity, activity: e.target.value })}
                                            />
                                            <div className="flex justify-end space-x-2">
                                                <Button size="sm" variant="ghost" onClick={() => setEditingDay(null)}>Cancel</Button>
                                                <Button size="sm" onClick={() => handleAddActivity(index)}>Save</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button variant="outline" size="sm" onClick={() => setEditingDay(index)}>
                                            <Plus className="mr-2 h-3 w-3" /> Add Activity
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {activeTab === 'budget' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Budget Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-primary">${trip.budget.toLocaleString()}</div>
                            <p className="text-muted-foreground">Total Budget</p>

                            <div className="mt-6">
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Spent: ${totalSpent.toLocaleString()}</span>
                                    <span>Remaining: ${remainingBudget.toLocaleString()}</span>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }}></div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h4 className="font-semibold mb-2">Expenses by Category</h4>
                                <div className="space-y-2">
                                    {['Food', 'Transport', 'Accommodation', 'Shopping', 'Activities', 'Other'].map(cat => {
                                        const catTotal = trip.expenses.filter(e => e.category === cat).reduce((a, c) => a + c.amount, 0);
                                        if (catTotal === 0) return null;
                                        return (
                                            <div key={cat} className="flex justify-between text-sm">
                                                <span>{cat}</span>
                                                <span>${catTotal.toLocaleString()}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle>Expenses</CardTitle>
                            {!showExpenseForm && (
                                <Button size="sm" variant="outline" onClick={() => setShowExpenseForm(true)}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            {showExpenseForm && (
                                <div className="bg-muted/30 p-4 rounded-md mb-4 space-y-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input
                                            type="number"
                                            placeholder="Amount"
                                            value={newExpense.amount}
                                            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                        />
                                        <select
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={newExpense.category}
                                            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                                        >
                                            <option value="Food">Food</option>
                                            <option value="Transport">Transport</option>
                                            <option value="Accommodation">Accommodation</option>
                                            <option value="Shopping">Shopping</option>
                                            <option value="Activities">Activities</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <Input
                                        placeholder="Note (optional)"
                                        value={newExpense.note}
                                        onChange={(e) => setNewExpense({ ...newExpense, note: e.target.value })}
                                    />
                                    <div className="flex justify-end space-x-2">
                                        <Button size="sm" variant="ghost" onClick={() => setShowExpenseForm(false)}>Cancel</Button>
                                        <Button size="sm" onClick={handleAddExpense}>Save</Button>
                                    </div>
                                </div>
                            )}

                            {trip.expenses.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No expenses logged yet.
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                    {trip.expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((expense) => (
                                        <div key={expense.id} className="flex justify-between items-center p-3 border rounded-md bg-card">
                                            <div>
                                                <div className="font-medium">{expense.category}</div>
                                                <div className="text-xs text-muted-foreground">{expense.note || format(new Date(expense.date), 'MMM d')}</div>
                                            </div>
                                            <div className="font-bold">-${expense.amount.toLocaleString()}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
