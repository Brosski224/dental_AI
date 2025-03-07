"use client"

import { useState } from "react"
import { Search, Plus, Edit, ChevronRight, CalendarPlus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NewPatientForm from "./new-patient-form"
import PatientDetails from "./patient-details"

export default function PatientList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPatient, setSelectedPatient] = useState(null)

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Patients</h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="pl-9 w-full sm:w-64"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
              </DialogHeader>
              <NewPatientForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Patients</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients
              .filter(
                (patient) =>
                  patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  patient.phone.includes(searchQuery),
              )
              .map((patient) => (
                <PatientCard key={patient.id} patient={patient} onSelect={() => setSelectedPatient(patient)} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients
              .filter(
                (patient) =>
                  patient.lastVisit && new Date(patient.lastVisit) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              )
              .map((patient) => (
                <PatientCard key={patient.id} patient={patient} onSelect={() => setSelectedPatient(patient)} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients
              .filter((patient) => patient.upcomingAppointment)
              .map((patient) => (
                <PatientCard key={patient.id} patient={patient} onSelect={() => setSelectedPatient(patient)} />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedPatient && (
        <Dialog open={!!selectedPatient} onOpenChange={(open) => !open && setSelectedPatient(null)}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Patient Details</DialogTitle>
            </DialogHeader>
            <PatientDetails patient={selectedPatient} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function PatientCard({ patient, onSelect }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
                {patient.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h3 className="font-medium">{patient.name}</h3>
                <p className="text-sm text-gray-500">{patient.id}</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {patient.lastVisit ? `Last visit: ${patient.lastVisit}` : "New patient"}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
            <div>
              <p className="text-gray-500">Phone</p>
              <p>{patient.phone}</p>
            </div>
            <div>
              <p className="text-gray-500">Age/Gender</p>
              <p>
                {patient.age}, {patient.gender}
              </p>
            </div>
          </div>

          {patient.upcomingAppointment && (
            <div className="text-xs text-gray-500 flex items-center gap-1 mb-3">
              <CalendarPlus className="h-3 w-3" />
              <span>Upcoming: {patient.upcomingAppointment}</span>
            </div>
          )}
        </div>

        <div className="flex border-t divide-x">
          <Button
            variant="ghost"
            className="flex-1 rounded-none h-10 text-xs font-normal text-gray-600"
            onClick={onSelect}
          >
            View Details
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
          <Button variant="ghost" className="flex-1 rounded-none h-10 text-xs font-normal text-gray-600">
            <Edit className="mr-1 h-4 w-4" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Mock patients data
const patients = [
  {
    id: "P10056",
    name: "Robert Johnson",
    age: 42,
    gender: "Male",
    phone: "(555) 123-4567",
    email: "robert.j@example.com",
    lastVisit: "May 15, 2024",
    upcomingAppointment: "Jun 30, 2024 - 10:00 AM",
  },
  {
    id: "P10057",
    name: "Maria Garcia",
    age: 35,
    gender: "Female",
    phone: "(555) 234-5678",
    email: "maria.g@example.com",
    lastVisit: "Apr 28, 2024",
  },
  {
    id: "P10058",
    name: "David Lee",
    age: 28,
    gender: "Male",
    phone: "(555) 345-6789",
    email: "david.lee@example.com",
    lastVisit: "May 22, 2024",
    upcomingAppointment: "Jun 28, 2024 - 2:30 PM",
  },
  {
    id: "P10059",
    name: "Sarah Williams",
    age: 45,
    gender: "Female",
    phone: "(555) 456-7890",
    email: "sarah.w@example.com",
    lastVisit: "Mar 10, 2024",
  },
  {
    id: "P10060",
    name: "James Wilson",
    age: 52,
    gender: "Male",
    phone: "(555) 567-8901",
    email: "james.w@example.com",
    lastVisit: "May 05, 2024",
    upcomingAppointment: "Jun 25, 2024 - 1:00 PM",
  },
  {
    id: "P10061",
    name: "Emma Thompson",
    age: 31,
    gender: "Female",
    phone: "(555) 678-9012",
    email: "emma.t@example.com",
    lastVisit: "May 18, 2024",
    upcomingAppointment: "Jun 22, 2024 - 3:30 PM",
  },
]

