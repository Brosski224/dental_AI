"use client"

import React from "react"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import NewAppointmentForm from "./new-appointment-form"

export default function Schedule() {
  const [date, setDate] = useState<Date>(new Date())
  const [view, setView] = useState<"month" | "week" | "day">("month")

  const monthName = date.toLocaleString("default", { month: "long" })
  const year = date.getFullYear()

  const goToPrevious = () => {
    const newDate = new Date(date)
    if (view === "month") {
      newDate.setMonth(date.getMonth() - 1)
    } else if (view === "week") {
      newDate.setDate(date.getDate() - 7)
    } else {
      newDate.setDate(date.getDate() - 1)
    }
    setDate(newDate)
  }

  const goToNext = () => {
    const newDate = new Date(date)
    if (view === "month") {
      newDate.setMonth(date.getMonth() + 1)
    } else if (view === "week") {
      newDate.setDate(date.getDate() + 7)
    } else {
      newDate.setDate(date.getDate() + 1)
    }
    setDate(newDate)
  }

  const goToToday = () => {
    setDate(new Date())
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Schedule</h2>

        <div className="flex items-center gap-2">
          <div className="bg-white border rounded-md p-1 flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={view === "month" ? "bg-gray-100" : ""}
              onClick={() => setView("month")}
            >
              Month
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={view === "week" ? "bg-gray-100" : ""}
              onClick={() => setView("week")}
            >
              Week
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={view === "day" ? "bg-gray-100" : ""}
              onClick={() => setView("day")}
            >
              Day
            </Button>
          </div>

          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700">New Appointment</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
              </DialogHeader>
              <NewAppointmentForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={goToPrevious}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={goToNext}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <h2 className="text-lg font-medium">
                {monthName} {year}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-1">
                <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                Regular
              </Badge>
              <Badge variant="outline" className="gap-1">
                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                Operation
              </Badge>
              <Badge variant="outline" className="gap-1">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                Blocked
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {view === "month" && (
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              className="rounded-md border-0"
              classNames={{
                head_cell: "text-muted-foreground rounded-md w-full font-normal text-xs",
                cell: "relative h-12 w-12 lg:h-20 lg:w-auto p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                day: "h-12 w-12 lg:h-20 lg:w-auto p-0 hover:bg-accent hover:text-accent-foreground focus:z-10",
                day_selected:
                  "bg-white text-primary-foreground hover:bg-white hover:text-primary-foreground focus:bg-white focus:text-primary-foreground",
                day_today: "bg-teal-50 text-teal-600 border border-teal-200",
              }}
              components={{
                Day: ({ day, ...props }) => {
                  // Ensure day is a valid Date object
                  if (!(day instanceof Date)) {
                    return null;
                  }
                  // Render appointments for this day
                  const appointments = getAppointmentsForDay(day);
                  return (
                    <div {...props} className="h-full w-full flex flex-col p-1 aria-selected:bg-teal-100">
                      <div className="text-right">{day.getDate()}</div>
                      <div className="flex-1 mt-1 flex flex-col gap-1 overflow-hidden">
                        {appointments.map((appt, i) => (
                          <div
                            key={i}
                            className={`text-xs truncate px-1 py-0.5 rounded ${
                              appt.type === "operation"
                                ? "bg-amber-100 text-amber-700"
                                : appt.type === "blocked"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-teal-100 text-teal-700"
                            }`}
                          >
                            {appt.time} {appt.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                },
              }}
            />
          )}

          {view === "day" && <DayView date={date} />}

          {view === "week" && <WeekView date={date} />}
        </CardContent>
      </Card>
    </div>
  )
}

function DayView({ date }: { date: Date }) {
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ]

  // Get appointments for this day
  const appointments = getAppointmentsForDay(date)

  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-4">{formattedDate}</h3>

      <div className="space-y-2">
        {timeSlots.map((time, index) => {
          const appt = appointments.find((a) => a.time === time)

          return (
            <div key={index} className="flex items-start gap-4 h-20">
              <div className="w-20 text-sm text-gray-500 pt-2">{time}</div>
              {appt ? (
                <div
                  className={`flex-1 rounded-md p-2 h-full border ${
                    appt.type === "operation"
                      ? "bg-amber-50 border-amber-200"
                      : appt.type === "blocked"
                        ? "bg-red-50 border-red-200"
                        : "bg-teal-50 border-teal-200"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm">{appt.label}</h4>
                      <p className="text-xs text-gray-500">
                        {appt.type === "regular"
                          ? "Regular Appointment"
                          : appt.type === "operation"
                            ? "Surgical Operation"
                            : "Blocked"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-500">{appt.duration} min</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 rounded-md border border-dashed border-gray-200 h-full flex items-center justify-center">
                  <Button variant="ghost" size="sm" className="text-gray-400 text-xs">
                    + Add
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function WeekView({ date }: { date: Date }) {
  // Get the week start and end dates
  const startOfWeek = new Date(date)
  startOfWeek.setDate(date.getDate() - date.getDay())

  const weekDays = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)
    weekDays.push(day)
  }

  const timeSlots = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"]

  return (
    <div className="p-4">
      <div className="grid grid-cols-8 gap-2">
        <div className="col-span-1"></div>
        {weekDays.map((day, index) => (
          <div key={index} className="text-center">
            <p className="text-xs text-gray-500">{day.toLocaleDateString("en-US", { weekday: "short" })}</p>
            <p className={`text-sm font-medium ${isSameDay(day, new Date()) ? "text-teal-600" : ""}`}>
              {day.getDate()}
            </p>
          </div>
        ))}

        {timeSlots.map((time, timeIndex) => (
          <React.Fragment key={timeIndex}>
            <div className="text-xs text-gray-500 pt-2">{time}</div>

            {weekDays.map((day, dayIndex) => {
              const appointments = getAppointmentsForDay(day)
              const appt = appointments.find((a) => {
                const apptHour = Number.parseInt(a.time.split(":")[0])
                const timeHour = Number.parseInt(time.split(":")[0])
                return (
                  apptHour === timeHour ||
                  (time.includes("PM") && apptHour === timeHour + 12) ||
                  (apptHour === 12 && timeHour === 12 && time.includes("PM"))
                )
              })

              return (
                <div
                  key={dayIndex}
                  className={`rounded-md p-1 h-12 border text-xs ${
                    appt
                      ? appt.type === "operation"
                        ? "bg-amber-50 border-amber-200"
                        : appt.type === "blocked"
                          ? "bg-red-50 border-red-200"
                          : "bg-teal-50 border-teal-200"
                      : "border-dashed border-gray-200"
                  }`}
                >
                  {appt && <div className="truncate">{appt.label}</div>}
                </div>
              )
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
// Utility function to check if two dates are the same day
function isSameDay(date1: Date, date2: Date) {
  // Check if both dates are valid Date objects
  if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
    return false;
  }
  
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

// Mock data function
function getAppointmentsForDay(day: Date) {
  // Ensure day is a valid Date object
  if (!(day instanceof Date)) {
    return [];
  }
  
  // Sample data - in a real app this would come from an API
  const allAppointments = [
    { date: new Date(2025, 2, 5), time: "9:00 AM", label: "Robert Johnson", type: "regular", duration: 60 },
    { date: new Date(2025, 2, 5), time: "11:00 AM", label: "Maria Garcia", type: "regular", duration: 30 },
    { date: new Date(2025, 2, 5), time: "1:00 PM", label: "James Wilson", type: "operation", duration: 90 },
    { date: new Date(2025, 2, 5), time: "3:30 PM", label: "Emma Thompson", type: "operation", duration: 60 },

    { date: new Date(2025, 2, 6), time: "10:00 AM", label: "David Lee", type: "regular", duration: 45 },
    { date: new Date(2025, 2, 6), time: "2:00 PM", label: "Sarah Williams", type: "regular", duration: 60 },

    { date: new Date(2025, 2, 7), time: "9:00 AM", label: "Office Closed", type: "blocked", duration: 480 },

    { date: new Date(2025, 2, 10), time: "11:00 AM", label: "Michael Brown", type: "regular", duration: 30 },
    { date: new Date(2025, 2, 10), time: "1:30 PM", label: "Jennifer Davis", type: "regular", duration: 45 },

    { date: new Date(2025, 2, 12), time: "9:30 AM", label: "Thomas Miller", type: "regular", duration: 60 },
    { date: new Date(2025, 2, 12), time: "3:00 PM", label: "Elizabeth Wilson", type: "operation", duration: 120 },

    { date: new Date(2025, 2, 15), time: "10:00 AM", label: "Christopher Moore", type: "regular", duration: 45 },
    { date: new Date(2025, 2, 15), time: "2:00 PM", label: "Staff Meeting", type: "blocked", duration: 60 },
    { date: new Date(2025, 2, 15), time: "4:00 PM", label: "Jessica Taylor", type: "regular", duration: 30 },
  ]

  return allAppointments.filter((appt) => isSameDay(appt.date, day))
}