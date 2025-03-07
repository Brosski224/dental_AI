import { Users, Clock, CalendarCheck, Activity } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="bg-teal-100 p-3 rounded-full">
            <Clock className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Today's Appointments</p>
            <h3 className="text-2xl font-semibold">12</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-full">
            <Users className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Patients</p>
            <h3 className="text-2xl font-semibold">1,248</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="bg-amber-100 p-3 rounded-full">
            <CalendarCheck className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Upcoming Operations</p>
            <h3 className="text-2xl font-semibold">5</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="bg-rose-100 p-3 rounded-full">
            <Activity className="h-6 w-6 text-rose-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Weekly Revenue</p>
            <h3 className="text-2xl font-semibold">$8,560</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

