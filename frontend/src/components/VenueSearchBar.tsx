import { useState } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type VenueSearchBarProps = {
  onSearch: (query: string, place: string, occasion: string, date: Date | null) => void;
};

export default function VenueSearchBar({ onSearch }: VenueSearchBarProps) {
  const [query, setQuery] = useState('');
  const [place, setPlace] = useState('');
  const [occasion, setOccasion] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="w-full flex flex-col md:flex-row items-center gap-4 bg-white rounded-xl shadow p-4 mb-8">
      <input
        type="text"
        placeholder="Venue name"
        className="flex-1 px-4 py-2 border rounded focus:outline-none"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <input
        type="text"
        placeholder="Location"
        className="flex-1 px-4 py-2 border rounded focus:outline-none"
        value={place}
        onChange={e => setPlace(e.target.value)}
      />
      <input
        type="text"
        placeholder="Occasion (e.g. Wedding, Birthday)"
        className="flex-1 px-4 py-2 border rounded focus:outline-none"
        value={occasion}
        onChange={e => setOccasion(e.target.value)}
      />
      <div className="relative flex items-center">
        <button
          type="button"
          className="flex items-center px-4 py-2 border rounded bg-blue-50 hover:bg-blue-100"
          onClick={() => setShowCalendar((v) => !v)}
        >
          <CalendarIcon className="h-5 w-5 text-blue-600 mr-2" />
          {date ? date.toLocaleDateString() : 'Select date'}
        </button>
        {showCalendar && (
          <div className="absolute left-0 top-full mt-2 z-10">
            <DatePicker
              selected={date}
              onChange={(d: Date | null) => {
                setDate(d);
                setShowCalendar(false);
              }}
              inline
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
          </div>
        )}
      </div>
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        onClick={() => onSearch(query, place, occasion, date)}
      >
        Search
      </button>
    </div>
  );
}