import React, { useState, useEffect, useRef } from "react";
import "../auth/register/register.css"; // Importa el CSS del componente de registro

const CustomDatePicker = ({ value, onChange }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value || null);
  const [currentMonth, setCurrentMonth] = useState(
    (value && value.getMonth()) || new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = useState(
    (value && value.getFullYear()) || new Date().getFullYear()
  );

  const wrapperRef = useRef(null);

  // Genera un arreglo de años (por ejemplo, desde 1900 hasta el año actual)
  const yearOptions = [];
  for (let y = 1900; y <= new Date().getFullYear(); y++) {
    yearOptions.push(y);
  }

  // Retorna la cantidad de días del mes
  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const getDaysArray = () => {
    const totalDays = daysInMonth(currentMonth, currentYear);
    return Array.from({ length: totalDays }, (_, i) => i + 1);
  };

  const handleDayClick = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    setSelectedDate(date);
    if (onChange) onChange(date);
    setShowCalendar(false);
  };

  const formatDate = (date) => {
    if (!date) return "";
    const mm = (date.getMonth() + 1).toString().padStart(2, "0");
    const dd = date.getDate().toString().padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  // Cierra el calendario al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prevYear) => prevYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prevYear) => prevYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return (
    <div className="custom-datepicker-wrapper" ref={wrapperRef}>
      <input
        type="text"
        readOnly
        value={formatDate(selectedDate)}
        placeholder="Fecha de Nacimiento"
        className="register__input custom-datepicker-input"
        onClick={() => setShowCalendar(!showCalendar)}
      />
      {showCalendar && (
        <div className="custom-calendar">
          <div className="custom-calendar-header">
            <button
              type="button"
              className="custom-calendar-nav"
              onClick={handlePrevMonth}
            >
              &#10094;
            </button>
            <div className="custom-calendar-title">
              <span>{monthNames[currentMonth]}</span>
              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                className="custom-calendar-year-select"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="custom-calendar-nav"
              onClick={handleNextMonth}
            >
              &#10095;
            </button>
          </div>
          <div className="custom-calendar-body">
            {getDaysArray().map((day) => (
              <div
                key={day}
                className={`custom-calendar-day ${
                  selectedDate &&
                  selectedDate.getDate() === day &&
                  selectedDate.getMonth() === currentMonth &&
                  selectedDate.getFullYear() === currentYear
                    ? "selected"
                    : ""
                }`}
                onClick={() => handleDayClick(day)}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
