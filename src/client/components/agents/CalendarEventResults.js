import { useState } from "react" // Importing useState hook from React for managing component state
import {
	IconCalendarEvent, // Icon for calendar event
	IconUser, // Icon for user/attendee
	IconChevronDown, // Icon for dropdown chevron (down)
	IconChevronUp, // Icon for dropdown chevron (up)
	IconMapPin, // Icon for location
	IconExternalLink, // Icon for external link
	IconClock, // Icon for time
	IconCalendarPlus, // Icon for event creation
	IconInfoCircle, // Icon for event description
} from "@tabler/icons-react" // Importing icons from tabler-icons-react library
import IconGoogleCalendar from "../icons/IconGoogleCalendar" // Import Google Calendar icon
import React from "react"

/**
 * EventItem Component - Displays a summarized view of a calendar event in a list.
 *
 * This component renders a single calendar event with details like title, time, location,
 * attendees, etc. It includes an expandable section to show the full event description
 * and a toggle button to expand/collapse the details.
 *
 * @param {object} props - Component props.
 * @param {object} props.event - An object containing the calendar event details.
 * @param {string} props.event.summary - The title/summary of the event.
 * @param {object} props.event.start - The start time object with dateTime or date property.
 * @param {object} props.event.end - The end time object with dateTime or date property.
 * @param {string} props.event.location - The location of the event (optional).
 * @param {string} props.event.description - The description of the event (optional).
 * @param {Array} props.event.attendees - List of attendees (optional).
 * @param {string} props.event.htmlLink - Link to the event in Google Calendar.
 *
 * @returns {React.ReactNode} - The EventItem component UI.
 */
const EventItem = ({ event }) => {
	// State to manage the expanded/collapsed state of the event details
	const [expanded, setExpanded] = useState(false)

	/**
	 * Toggles the expanded state of the event details.
	 *
	 * Sets the `expanded` state to the opposite of its current value, effectively toggling the visibility
	 * of the full event details within the EventItem component.
	 *
	 * @function handleToggle
	 * @returns {void}
	 */
	const handleToggle = () => setExpanded(!expanded) // Toggles the 'expanded' state
    
	// Format dates for display
	const formatDateTime = (dateTimeObj) => {
		if (!dateTimeObj) return "N/A"
        
		// Check if it's a full day event (date property) or specific time (dateTime property)
		const dateTimeStr = dateTimeObj.dateTime || dateTimeObj.date
		if (!dateTimeStr) return "N/A"
        
		const date = new Date(dateTimeStr)
        
		// For all-day events (no time component)
		if (dateTimeObj.date) {
			return date.toLocaleDateString(undefined, { 
				weekday: 'short',
				year: 'numeric', 
				month: 'short', 
				day: 'numeric'
			})
		}
        
		// For timed events
		return date.toLocaleString(undefined, {
			weekday: 'short',
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	// Format date range for display
	const getDateTimeRange = () => {
		const start = formatDateTime(event.start)
		const end = formatDateTime(event.end)
		
		// If start and end dates are the same (for full day events)
		if (event.start.date && event.end.date && start === end) {
			return `${start} (All day)`
		}
        
		return `${start} - ${end}`
	}
    
	// Open event in Google Calendar
	const openEventInCalendar = (e) => {
		e.stopPropagation() // Prevent event from toggling the expanded state
		if (event.htmlLink) {
			window.open(event.htmlLink, "_blank", "noopener noreferrer")
		}
	}

	return (
		<li className="p-4 bg-matteblack rounded-md border border-gray-700 hover:border-lightblue transition-colors">
			{/* Main container for each event item */}
			<div className="flex justify-between items-start">
				{/* Left side container for event summary info */}
				<div className="flex flex-col">
					{/* Title/summary line with calendar icon */}
					<div className="flex items-center space-x-2">
						<IconCalendarEvent className="w-5 h-5 text-lightblue" />
						<span className="font-Quicksand text-white font-semibold">
							{event.summary || "Untitled Event"}
						</span>
					</div>
					
					{/* Date and time */}
					<div className="flex items-center space-x-2 mt-1">
						<IconClock className="w-4 h-4 text-gray-400" />
						<span className="font-Quicksand text-gray-300 text-sm">
							{getDateTimeRange()}
						</span>
					</div>
                    
					{/* Location if available */}
					{event.location && (
						<div className="flex items-center space-x-2 mt-1">
							<IconMapPin className="w-4 h-4 text-gray-400" />
							<span className="font-Quicksand text-gray-300 text-sm">
								{event.location}
							</span>
						</div>
					)}
                    
					{/* Preview of attendees if available */}
					{event.attendees && event.attendees.length > 0 && (
						<div className="flex items-center space-x-2 mt-1">
							<IconUser className="w-4 h-4 text-gray-400" />
							<span className="font-Quicksand text-gray-300 text-sm">
								{`${event.attendees.length} attendee${event.attendees.length > 1 ? 's' : ''}`}
							</span>
						</div>
					)}
				</div>
				
				{/* Right side container for expand/collapse toggle button */}
				<div className="flex items-center space-x-2">
					<button
						onClick={handleToggle} // Call handleToggle function on button click
						className="text-lightblue hover:text-white"
						title="Show Details"
					>
						{/* Conditional rendering of chevron icon based on 'expanded' state */}
						{expanded ? (
							<IconChevronUp className="w-5 h-5" /> // Show ChevronUp icon when expanded is true
						) : (
							<IconChevronDown className="w-5 h-5" /> // Show ChevronDown icon when expanded is false
						)}
					</button>
				</div>
			</div>
            
			{/* Expanded event details section, conditionally rendered based on 'expanded' state */}
			{expanded && (
				<div className="mt-3 border-t border-gray-600 pt-3">
					{/* Description if available */}
					{event.description && (
						<div className="mb-3">
							<div className="flex items-center mb-1">
								<IconInfoCircle className="w-4 h-4 text-gray-400 mr-2" />
								<span className="font-Quicksand text-gray-200 text-sm font-semibold">Description:</span>
							</div>
							<p className="font-Quicksand text-white text-sm whitespace-pre-wrap ml-6">
								{event.description}
							</p>
						</div>
					)}
                    
					{/* Detailed attendee list if available */}
					{event.attendees && event.attendees.length > 0 && (
						<div className="mb-3">
							<div className="flex items-center mb-1">
								<IconUser className="w-4 h-4 text-gray-400 mr-2" />
								<span className="font-Quicksand text-gray-200 text-sm font-semibold">Attendees:</span>
							</div>
							<ul className="list-disc list-inside ml-6">
								{event.attendees.map((attendee, index) => (
									<li key={index} className="font-Quicksand text-white text-sm">
										{attendee.email || attendee}
										{attendee.responseStatus && ` (${attendee.responseStatus})`}
									</li>
								))}
							</ul>
						</div>
					)}

					{/* Link to open in Google Calendar */}
					{event.htmlLink && (
						<button
							onClick={openEventInCalendar}
							className="flex items-center space-x-2 text-sm text-lightblue hover:text-white transition-colors mt-2"
						>
							<IconExternalLink className="w-4 h-4" />
							<span>Open in Google Calendar</span>
						</button>
					)}
				</div>
			)}
		</li>
	)
}

/**
 * CalendarEventResults Component - Displays calendar event details.
 *
 * This component takes a calendar event object and renders its details in a card format,
 * showing information like event summary, time, location, attendees, etc.
 * It can represent a newly created event or the result of a calendar search/query.
 *
 * @param {object} props - Component props.
 * @param {boolean} props.isNewEvent - Whether this is a newly created event or search results.
 * @param {Array<object>} props.events - An array of calendar event objects representing search results or a single new event.
 * @param {string} props.calendarLink - The URL to open the calendar in a browser (optional).
 *
 * @returns {React.ReactNode} - The CalendarEventResults component UI.
 */
const CalendarEventResults = ({ isNewEvent = false, events = [], calendarLink }) => {
	// Open Google Calendar in a new tab
	const openCalendar = () => {
		const url = calendarLink || "https://calendar.google.com/"
		window.open(url, "_blank", "noopener noreferrer")
	}

	return (
		<div className="w-full bg-smokeblack rounded-lg p-4 mb-4 border border-lightblue">
			{/* Header section of the Calendar Results card */}
			<div className="flex items-center gap-2 mb-4">
				<IconGoogleCalendar className="w-6 h-6" />
				<h3 className="text-xl font-Poppins font-semibold text-white">
					{isNewEvent ? "Calendar Event Created" : "Calendar Events"}
				</h3>
			</div>
			
			{/* Button to open Google Calendar */}
			<div className="mb-4">
				<button
					onClick={openCalendar} // Call openCalendar function on button click
					className="flex items-center gap-2 px-3 py-2 bg-lightblue text-black rounded-sm hover:bg-blue-400 transition-colors"
				>
					<IconExternalLink className="w-5 h-5" />
					<span className="font-Quicksand text-sm">
						Open Google Calendar
					</span>
				</button>
			</div>
            
			{/* Conditional rendering of events list or "No events found" message */}
			{events && events.length > 0 ? (
				<ul className="space-y-4">
					{/* Map through events array and render EventItem for each event */}
					{events.map((event, index) => (
						<EventItem key={index} event={event} />
					))}
				</ul>
			) : (
				// Displayed when no events are found
				<div className="text-white font-Quicksand">
					No events found.
				</div>
			)}
		</div>
	)
}

export default CalendarEventResults
