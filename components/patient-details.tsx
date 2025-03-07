import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CalendarPlus, Clock, FileText, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PatientDetails({ patient }) {
  return (
    <Tabs defaultValue="overview">
      <TabsList className="w-full grid grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="medical">Medical History</TabsTrigger>
        <TabsTrigger value="treatments">Treatments</TabsTrigger>
        <TabsTrigger value="records">X-Rays & Records</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4 mt-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">{patient.name}</h2>
            <p className="text-gray-500">
              ID: {patient.id} • {patient.age} years • {patient.gender}
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <CalendarPlus className="h-4 w-4" />
              Schedule Appointment
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700 gap-2">
              <FileText className="h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-1">
                <p>
                  <span className="font-medium">Phone:</span> {patient.phone}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {patient.email}
                </p>
                <p>
                  <span className="font-medium">Address:</span> 123 Main St, Anytown, USA
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {patient.upcomingAppointment ? (
                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium">Upcoming</p>
                    <p className="flex items-center gap-1 text-gray-600">
                      <Clock className="h-3 w-3" />
                      {patient.upcomingAppointment}
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Last Visit</p>
                    <p className="text-gray-600">{patient.lastVisit}</p>
                  </div>
                </div>
              ) : (
                <div className="text-sm">
                  <p className="font-medium">Last Visit</p>
                  <p className="text-gray-600">{patient.lastVisit || "No previous visits"}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Billing Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <p className="text-sm">Total Billed</p>
                  <p className="font-medium">$1,248.00</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm">Pending</p>
                  <p className="font-medium">$0.00</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm">Insurance Coverage</p>
                  <p className="font-medium">$986.00</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="medical" className="space-y-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Medical Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="text-sm font-medium">Blood Group</h4>
                <p className="text-gray-600">O+</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Allergies</h4>
                <p className="text-gray-600">Penicillin, Latex</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Existing Conditions</h4>
                <p className="text-gray-600">Hypertension, Diabetes Type 2</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Current Medications</h4>
                <p className="text-gray-600">Metformin 500mg, Lisinopril 10mg</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dental History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="text-sm font-medium">Last Checkup</h4>
                <p className="text-gray-600">{patient.lastVisit}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Previous Procedures</h4>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Root Canal (Lower Right Molar) - Jan 2024</li>
                  <li>Dental Cleaning - Oct 2023</li>
                  <li>Cavity Filling (Upper Left) - Jul 2023</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="treatments" className="mt-4">
        <div className="relative">
          <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200"></div>
          <div className="space-y-6 pl-10 pb-6">
            <div className="relative">
              <div className="absolute -left-10 top-2 h-4 w-4 rounded-full border-2 border-teal-600 bg-white"></div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">Dental Implant Treatment Plan</h3>
                  <p className="text-xs text-gray-500">Jun 2024 - Sep 2024</p>
                </div>
                <p className="text-sm text-gray-600">
                  Single-tooth implant replacement for missing lower right first molar
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">In Progress</span>
                  <span>Cost: $3,200</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-10 top-2 h-4 w-4 rounded-full border-2 border-gray-300 bg-white"></div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">Root Canal Therapy</h3>
                  <p className="text-xs text-gray-500">Jan 2024</p>
                </div>
                <p className="text-sm text-gray-600">Root canal treatment for lower right molar with deep decay</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded-full">Completed</span>
                  <span>Cost: $950</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-10 top-2 h-4 w-4 rounded-full border-2 border-gray-300 bg-white"></div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">Full Dental Cleaning</h3>
                  <p className="text-xs text-gray-500">Oct 2023</p>
                </div>
                <p className="text-sm text-gray-600">Professional dental cleaning and fluoride treatment</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded-full">Completed</span>
                  <span>Cost: $120</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="records" className="mt-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">X-Ray Images</h3>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Download All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=300&width=300"
                  alt="Dental X-Ray"
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex justify-between items-center text-sm">
                <p className="font-medium">Panoramic View</p>
                <p className="text-xs text-gray-500">May 15, 2024</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=300&width=300"
                  alt="Dental X-Ray"
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex justify-between items-center text-sm">
                <p className="font-medium">Lower Right Molar</p>
                <p className="text-xs text-gray-500">Jan 10, 2024</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=300&width=300"
                  alt="Dental X-Ray"
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex justify-between items-center text-sm">
                <p className="font-medium">Full Mouth Series</p>
                <p className="text-xs text-gray-500">Oct 05, 2023</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-3">Reports & Documents</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <FileText className="text-gray-400" />
                  <div>
                    <p className="font-medium">Treatment Plan Report</p>
                    <p className="text-xs text-gray-500">PDF • May 15, 2024</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <FileText className="text-gray-400" />
                  <div>
                    <p className="font-medium">Root Canal Procedure Notes</p>
                    <p className="text-xs text-gray-500">PDF • Jan 15, 2024</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <FileText className="text-gray-400" />
                  <div>
                    <p className="font-medium">Initial Assessment</p>
                    <p className="text-xs text-gray-500">PDF • Oct 10, 2023</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}

