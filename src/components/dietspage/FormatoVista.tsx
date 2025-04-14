import React, { useState, useEffect } from 'react';

interface FormatoVistaProps {
  selectedWeek: number;
  selectedDay: string;
  isWeekSelectorOpen: boolean;
  isDaySelectorOpen: boolean;
  weeks: number[];
  days: string[];
  toggleWeekSelector: () => void;
  toggleDaySelector: () => void;
  handleWeekSelect: (week: number) => void;
  handleDaySelect: (day: string, date: Date) => void; // Updated to include date
}

const FormatoVista: React.FC<FormatoVistaProps> = ({
  selectedWeek,
  selectedDay,
  weeks,
  handleWeekSelect,
  handleDaySelect
}) => {
  // State for current week and dates
  const [currentWeekIndex, setCurrentWeekIndex] = useState<number>(weeks.indexOf(selectedWeek));
  const [weekDays, setWeekDays] = useState<Array<{name: string, date: Date, dayOfMonth: number, isToday: boolean}>>([]);
  const [currentMonthYear, setCurrentMonthYear] = useState<{month: string, year: number}>({ month: "Abril", year: 2025 });
  
  // Months in Spanish with first letter capitalized
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  
  // Days of the week in Spanish
  const dayNames = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
  
  // Function to get the first day of a week for a given week number
  const getFirstDayOfWeek = (year: number, weekNumber: number) => {
    // Create a date for Jan 1 of the year
    const date = new Date(year, 0, 1);
    
    // Get the day of the week for Jan 1 (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = date.getDay();
    
    // Calculate days to add to get to the first Monday
    const daysToAdd = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    
    // Add days to get to the first Monday of the year
    date.setDate(date.getDate() + daysToAdd);
    
    // Add weeks to get to the desired week
    date.setDate(date.getDate() + (weekNumber - 1) * 7);
    
    return date;
  };
  
  // Function to check if a date is today
  const isDateToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };
  
  // Generate week days based on current week
  useEffect(() => {
    if (currentWeekIndex < 0 || currentWeekIndex >= weeks.length) return;
    
    const weekNumber = weeks[currentWeekIndex];
    // Use current year instead of hardcoded 2025
    const currentYear = new Date().getFullYear();
    const firstDayOfWeek = getFirstDayOfWeek(currentYear, weekNumber);
    
    // Adjust for current month - if we're in April, we should show April dates
    // This gets the current date to use its month
    const today = new Date();
    const currentMonth = today.getMonth(); // 0-11 where 3 is April
    
    // Adjust the firstDayOfWeek to be in the current month
    // This ensures we're showing the correct month's week
    firstDayOfWeek.setMonth(currentMonth);
    
    // If we're near the end of the month, we might need to adjust to show the correct week
    // This ensures we're showing the correct week of the current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    if (firstDayOfWeek.getDate() > daysInMonth) {
      firstDayOfWeek.setDate(daysInMonth - 6); // Set to show the last week of the month
    }
    
    const newWeekDays = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(firstDayOfWeek);
      currentDate.setDate(firstDayOfWeek.getDate() + i);
      
      newWeekDays.push({
        name: dayNames[i],
        date: currentDate,
        dayOfMonth: currentDate.getDate(),
        isToday: isDateToday(currentDate)
      });
    }
    
    // Update month and year based on the first day of the week
    setCurrentMonthYear({
      month: months[firstDayOfWeek.getMonth()],
      year: firstDayOfWeek.getFullYear()
    });
    
    setWeekDays(newWeekDays);
    
    // Notify parent component about week change
    handleWeekSelect(weekNumber);
  }, [currentWeekIndex, weeks, handleWeekSelect]);  
  
  // Navigate to previous week
  const goToPreviousWeek = () => {
    if (currentWeekIndex > 0) {
      setCurrentWeekIndex(currentWeekIndex - 1);
    }
  };
  
  // Navigate to next week
  const goToNextWeek = () => {
    if (currentWeekIndex < weeks.length - 1) {
      setCurrentWeekIndex(currentWeekIndex + 1);
    }
  };

  return (
    <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header with week navigation */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
        <button 
          onClick={goToPreviousWeek}
          disabled={currentWeekIndex === 0}
          className="p-2 text-blue-500 hover:text-blue-700 disabled:text-gray-400"
          aria-label="Semana anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        
        <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          {/* Removed "Semana {weeks[currentWeekIndex]}" text */}
        </div>
        
        <button 
          onClick={goToNextWeek}
          disabled={currentWeekIndex === weeks.length - 1}
          className="p-2 text-blue-500 hover:text-blue-700 disabled:text-gray-400"
          aria-label="Semana siguiente"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Month and year display */}
      <div className="flex justify-end p-2 pr-4 text-sm text-gray-600 dark:text-gray-400">
        {currentMonthYear.month} - {currentMonthYear.year}
      </div>
      
      {/* Days of the week */}
      <div className="grid grid-cols-7 gap-1 p-2">
        {weekDays.map((day) => (
          <div 
            key={day.name}
            onClick={() => handleDaySelect(day.name, day.date)} // Pass the date object
            className={`flex flex-col items-center p-3 rounded-lg cursor-pointer
              ${selectedDay.toLowerCase() === day.name ? 
                'bg-blue-700 text-white' : 
                day.isToday ?
                'bg-green-100 dark:bg-green-900/20 border border-green-500' :
                'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            <span className="text-xs font-medium mb-1">{day.name}</span>
            <span className={`text-xl font-bold ${day.isToday ? 'text-green-600 dark:text-green-400' : ''}`}>
              {day.dayOfMonth}
            </span>
            {day.isToday && (
              <span className="text-xs text-green-600 dark:text-green-400 mt-1">Hoy</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormatoVista;