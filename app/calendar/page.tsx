import React from 'react'
import StudyCalendar from './StudyCalendar'
export const metadata = {title: "Study Smart | Calendar"}

const CalendarPage = () => {
  return (
    <div className='pt-28'>
        <div>
            <StudyCalendar />
        </div>
    </div>
  )
}

export default CalendarPage