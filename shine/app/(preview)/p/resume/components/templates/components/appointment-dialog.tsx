'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircleIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ThemeStyles } from '@/types/theme';
import { ComponentThemeProvider } from '@/providers/ComponentThemesProvider';
import { Mode } from '@/contexts/settings-context';
import { AppointmentFormValues, AppointmentSchema } from '@/lib/schemas/appointment';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CreateAppointmentPayload, useAppointment } from '@/hooks/api/use-appointment';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  themeStyles: ThemeStyles;
  themeMode: Mode;
}

const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

interface TimeSlot {
  time: string;
  available: boolean;
}

interface ScheduleEvent {
  time: string;
  title: string;
}

const getDaysInMonth = (year: number, month: number): number =>
  new Date(year, month + 1, 0).getDate();

export function AppointmentDialog({ isOpen, onOpenChange, themeMode, themeStyles }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 6));
  const [selectedDate, setSelectedDate] = useState(21);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { create } = useAppointment();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(AppointmentSchema),
    defaultValues: {
      name: '',
      contact_number: '',
      email: '',
      message: '',
      user_id: 0,
      project_id: 0,
      date: '',
      time_from: '',
      time_to: '',
    },
  });

  const monthDays = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const timeSlots: TimeSlot[] = [
    { time: '9:30am', available: false },
    { time: '10:00am', available: false },
    { time: '10:30am', available: true },
    { time: '11:00am', available: true },
    { time: '11:30am', available: true },
    { time: '2:00pm', available: true },
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const onSubmit = async (form: AppointmentFormValues) => {
    setError('');
    setIsLoading(true);

    const payload: CreateAppointmentPayload = {
      user_id: 1,
      project_id: 1,
      date: '',
      time_from: '',
      time_to: '',
      name: form.name,
      email: form.email,
      contact_number: form.contact_number,
      message: form.message,
    };

    const { success, data, message } = await create(payload);

    if (success && data) {
      toast('Portfolio succesfully details saved.');
      setIsLoading(false);
      return;
    }

    setError(message);
    toast('Something went wrong!');
    setIsLoading(false);
  };

  const calendarDays = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= monthDays; i++) {
    calendarDays.push(i);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1200px] h-[75vh] overflow-auto p-0">
        <ComponentThemeProvider themeStyles={themeStyles} mode={themeMode}>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
            }}
            className="relative bg-background h-full rounded-none"
          >
            <Card className="h-full p-0">
              <CardContent className="h-full overflow-auto p-0">
                <div className="grid grid-cols-3 gap-3 h-full">
                  {/* Left Column */}
                  <div className="border-r flex flex-col items-center justify-start p-4">
                    <Avatar className="h-20 w-20 mb-4">
                      <AvatarImage src="https://yt3.googleusercontent.com/DUK0KCuswoaUwvZZhqAgW4e-tdOKkfguzPAHTjdRzD1KBuqV2SJm8vtpzRJ-_vXljUXnalMvs7M=s160-c-k-c0x00ffffff-no-rj" />
                      <AvatarFallback>RP</AvatarFallback>
                    </Avatar>
                    <h3 className="text-sm font-semibold text-center">Reggie Peterson</h3>
                    <p className="text-lg font-bold text-center mt-2">30 Minute Meeting</p>
                    <div className="flex items-center gap-2 mt-4 text-xs opacity-70">
                      <Clock className="w-4 h-4" />
                      <span>30 min</span>
                    </div>
                  </div>

                  {/* Middle Column - Calendar */}
                  <div className="overflow-y-auto space-y-4 p-4">
                    <h2 className="text-xl font-bold">Select a Date & Time</h2>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold">
                        {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handlePrevMonth}
                          className="h-7 w-7 p-0"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleNextMonth}
                          className="h-7 w-7 p-0"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="grid grid-cols-7 gap-1">
                        {DAYS_OF_WEEK.map((day) => (
                          <div
                            key={day}
                            className="text-center text-xs font-semibold opacity-70 py-1"
                          >
                            {day}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((day, index) => (
                          <button
                            key={index}
                            onClick={() => day && setSelectedDate(day)}
                            className={`aspect-square text-xs font-medium rounded transition-colors py-2 ${
                              day === null ? 'invisible' : ''
                            } ${
                              day === selectedDate
                                ? 'bg-accent text-accent-foreground font-bold'
                                : 'hover:bg-muted cursor-pointer'
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time Slots */}
                    <div className="space-y-2">
                      {timeSlots.map((slot, index) => (
                        <Button variant="outline" className="block w-full" key={index}>
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 flex flex-col justify-between">
                    <div className="space-y-5">
                      <p className="text-sm">About you</p>

                      <div className="space-y-4">
                        {error && (
                          <Alert variant="destructive">
                            <AlertCircleIcon />
                            <AlertTitle className="capitalize">{error}</AlertTitle>
                          </Alert>
                        )}

                        <div>
                          <Label className="font-medium mb-2">Name</Label>
                          <Input
                            {...register('name')}
                            placeholder="Name"
                            className="w-full shadow-none"
                            required
                          />
                          {errors.name && (
                            <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                          )}
                        </div>

                        <div>
                          <Label className="font-medium mb-2">Email</Label>
                          <Input
                            {...register('email')}
                            placeholder="you@example.com"
                            className="w-full shadow-none"
                            type="email"
                            required
                          />
                          {errors.email && (
                            <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                          )}
                        </div>

                        <div>
                          <Label className="font-medium mb-2">Contact Number</Label>
                          <Input
                            {...register('contact_number')}
                            placeholder="09965594483"
                            className="w-full shadow-none"
                            type="tel"
                          />
                          {errors.contact_number && (
                            <p className="text-destructive text-sm mt-1">
                              {errors.contact_number.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label className="font-medium mb-2">Message</Label>
                          <Textarea
                            {...register('message')}
                            placeholder="Tell us more about your appointment..."
                            className="w-full shadow-none"
                          />
                          {errors.message && (
                            <p className="text-destructive text-sm mt-1">
                              {errors.message.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <CardFooter className="p-0">
                      <div className="flex-1" />
                      <Button onClick={handleSubmit(onSubmit)} disabled={isLoading}>
                        Book an Appointment <ChevronRight />
                      </Button>
                    </CardFooter>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ComponentThemeProvider>
      </DialogContent>
    </Dialog>
  );
}
