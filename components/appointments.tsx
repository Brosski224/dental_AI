"use client"

import { useState } from "react"
import { Calendar, Plus, Check, Clock, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NewAppointmentForm from "./new-appointment-form"

export default function Appointments() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Appointments</h2>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {formattedDate}
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                New Appointment
              </Button>
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

      <Tabs defaultValue="today">
        <TabsList>
          <TabsTrigger value="today">Today's Appointments</TabsTrigger>
          <TabsTrigger value="operations">Today's Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4 mt-4">
          {appointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </TabsContent>

        <TabsContent value="operations" className="space-y-4 mt-4">
          {operations.map((operation) => (
            <OperationCard key={operation.id} operation={operation} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AppointmentCard({ appointment }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
              {appointment.patient.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h3 className="font-medium">{appointment.patient.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{appointment.time}</span>
                <span>•</span>
                <span>{appointment.treatment}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={appointment.status} />
            <Button variant="outline" size="sm">
              Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function OperationCard({ operation }) {
  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg font-medium">{operation.treatment}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
              {operation.patient
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h3 className="font-medium">{operation.patient}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{operation.time}</span>
                <span>•</span>
                <span>{operation.duration} mins</span>
              </div>
            </div>
          </div>

          <StatusBadge status={operation.status} />
        </div>

        <div className="mt-3 pt-3 border-t">
          <h4 className="text-sm font-medium mb-2">Required Equipment</h4>
          <div className="flex flex-wrap gap-2">
            {operation.equipment.map((item, index) => (
              <Badge key={index} variant="outline" className="bg-gray-100">
                {item}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t">
          <h4 className="text-sm font-medium mb-2">Staff Assigned</h4>
          <div className="flex flex-wrap gap-2">
            {operation.staff.map((person, index) => (
              <Badge key={index} variant="outline" className="bg-gray-100">
                {person}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }) {
  const statusStyles = {
    confirmed: { bg: "bg-blue-100", text: "text-blue-600", icon: Clock },
    arrived: { bg: "bg-amber-100", text: "text-amber-600", icon: Clock },
    completed: { bg: "bg-green-100", text: "text-green-600", icon: Check },
    cancelled: { bg: "bg-red-100", text: "text-red-600", icon: AlertCircle },
  }

  const style = statusStyles[status] || statusStyles.confirmed

  return (
    <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${style.bg} ${style.text}`}>
      <style.icon className="h-3 w-3" />
      <span className="capitalize">{status}</span>
    </div>
  )
}

// Mock data
const appointments = [
  {
    id: 1,
    patient: {
      name: "Robert Johnson",
      id: "P10056",
    },
    time: "09:00 AM",
    treatment: "Dental Checkup",
    status: "confirmed",
  },
  {
    id: 2,
    patient: {
      name: "Maria Garcia",
      id: "P10057",
    },
    time: "10:00 AM",
    treatment: "Root Canal",
    status: "arrived",
  },
  {
    id: 3,
    patient: {
      name: "David Lee",
      id: "P10058",
    },
    time: "11:30 AM",
    treatment: "Teeth Whitening",
    status: "completed",
  },
  {
    id: 4,
    patient: {
      name: "Sarah Williams",
      id: "P10059",
    },
    time: "02:00 PM",
    treatment: "Dental Filling",
    status: "cancelled",
  },
]

const operations = [
  {
    id: 1,
    patient: "James Wilson",
    time: "01:00 PM",
    duration: 90,
    treatment: "Dental Implant Surgery",
    status: "confirmed",
    equipment: ["Surgical Kit", "Implant System", "Bone Graft Material", "Surgical Drill"],
    staff: ["Dr. Miller", "Dr. Parker", "Nurse Johnson"],
  },
  {
    id: 2,
    patient: "Emma Thompson",
    time: "03:30 PM",
    duration: 60,
    treatment: "Wisdom Tooth Extraction",
    status: "arrived",
    equipment: ["Extraction Forceps", "Surgical Elevator", "Suture Kit"],
    staff: ["Dr. Parker", "Nurse Williams"],
  },
]

