import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

export const formatDate = (date: Date | string, formatStr = 'dd/MM/yyyy'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, formatStr);
};

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

export const formatDateTime = (date: Date, time: string): string => {
  return `${formatDate(date, 'EEE, MMM dd, yyyy')} at ${formatTime(time)}`;
};

export const getWeekDates = (date: Date = new Date()): Date[] => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
};

export const generateTimeSlots = (
  startTime: string,
  endTime: string,
  interval: number = 30
): string[] => {
  const slots: string[] = [];
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  let currentHour = startHour;
  let currentMinute = startMinute;

  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMinute < endMinute)
  ) {
    const hourStr = currentHour.toString().padStart(2, '0');
    const minuteStr = currentMinute.toString().padStart(2, '0');
    slots.push(`${hourStr}:${minuteStr}`);

    currentMinute += interval;
    if (currentMinute >= 60) {
      currentMinute -= 60;
      currentHour++;
    }
  }

  return slots;
};

export const isSlotAvailable = (
  date: Date,
  time: string,
  bookedSlots: { date: Date; time: string }[],
  availabilitySlots: { dayOfWeek: number; startTime: string; endTime: string }[]
): boolean => {
  const dayOfWeek = date.getDay();
  
  // Check if slot is within doctor's availability
  const isAvailable = availabilitySlots.some((slot) => {
    if (slot.dayOfWeek !== dayOfWeek) return false;
    return time >= slot.startTime && time <= slot.endTime;
  });

  if (!isAvailable) return false;

  // Check if slot is already booked
  const isBooked = bookedSlots.some(
    (slot) =>
      formatDate(slot.date) === formatDate(date) && slot.time === time
  );

  return !isBooked;
};