import React from "react";
import FullCalendar, {
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
// import PageContent from '@/components/PageContent';
import { INITIAL_EVENTS } from "./event-utils";
import EventModal from "./EventModal";
import AppLayout from "../../layouts/AppLayout";

const Calendar = () => {
  const [editable, setEditable] = React.useState(false);
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setEditable(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    setEditable(true);
  };

  return (
    <AppLayout activePage="Calendar" title="Calendar" className="calendar-app">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        initialView="dayGridMonth"
        weekends
        editable
        selectable
        selectMirror
        dayMaxEvents
        nextDayThreshold={"09:00:00"}
        initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
        select={handleDateSelect}
        eventContent={renderEventContent} // custom render function
        eventClick={handleEventClick}
      />
      <EventModal
        open={editable}
        onClose={() => setEditable(false)}
        onAddEvent={() => {
          setEditable(false);
        }}
      />
    </AppLayout>
  );
};

function renderEventContent(eventContent: EventContentArg) {
  const { timeText, event } = eventContent;
  return (
    <>
      {timeText && (
        <>
          <div className="fc-daygrid-event-dot"></div>
          <div className="fc-event-time">{eventContent.timeText}</div>
        </>
      )}
      <div className="fc-event-title">{event.title}</div>
    </>
  );
}

export default Calendar;
