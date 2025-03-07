"use client"

import { useState } from "react"
import { Calendar, Users, Clock, LogOut, Menu } from "lucide-react"
import Appointments from "./appointments"
import PatientList from "./patient-list"
import Schedule from "./schedule"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import StatsCards from "./stats-cards"

export default function DentalDashboard() {
  const [currentTab, setCurrentTab] = useState("appointments")

  const tabs = [
    { id: "appointments", label: "Appointments", icon: Clock },
    { id: "patientList", label: "Patients", icon: Users },
    { id: "schedule", label: "Schedule", icon: Calendar },
  ]

  const TabContent = {
    appointments: Appointments,
    patientList: PatientList,
    schedule: Schedule,
  }

  const CurrentTabComponent = TabContent[currentTab]
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with date display */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="flex justify-between items-center px-4 h-16">
          <Sheet>
            <SheetTrigger className="lg:hidden">
              <Menu className="w-6 h-6 text-gray-600" />
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Dental Clinic</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setCurrentTab(tab.id)
                      document.querySelector("[data-radix-collection-item]")?.click()
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                      ${currentTab === tab.id ? "bg-teal-100 text-teal-600" : "hover:bg-gray-100"}`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          <h1 className="text-xl font-semibold text-teal-600">Dental Clinic Dashboard</h1>

          <div className="flex items-center gap-4">
            <span className="hidden md:block text-sm text-gray-500">{currentDate}</span>
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16 pb-20 p-4 lg:pl-64">
        <div className="max-w-7xl mx-auto">
          <StatsCards />
          <CurrentTabComponent />
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="bg-white fixed bottom-0 left-0 right-0 border-t md:hidden">
        <div className="grid grid-cols-3 h-16">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-1
                ${currentTab === tab.id ? "text-teal-600" : "text-gray-600 hover:text-gray-900"}`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 bg-white border-r p-4 mt-16">
        <div className="flex flex-col gap-2 mt-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${currentTab === tab.id ? "bg-teal-100 text-teal-600" : "hover:bg-gray-100"}`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>
      </aside>
    </div>
  )
}

