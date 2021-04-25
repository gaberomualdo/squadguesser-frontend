import './styles.css';
import React, { useState } from 'react';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import { Calendar } from 'react-modern-calendar-datepicker';

const LargeCalendar = (props) => {
  const { selectedDay, setSelectedDay } = props;

  return (
    <div className='large-calendar-component'>
      <Calendar value={selectedDay} onChange={setSelectedDay} />
    </div>
  );
};

export default LargeCalendar;
