"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function NewAppointmentForm() {
  const [date, setDate] = useState<Date>()

  return (
    <Tabs defaultValue="existing">
      <TabsList className="w-full mb-4">
        <TabsTrigger value="existing" className="flex-1">
          Existing Patient
        </TabsTrigger>
        <TabsTrigger value="new" className="flex-1">
          New Patient
        </TabsTrigger>
      </TabsList>

      <TabsContent value="existing">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patientSearch">Patient Search</Label>
            <Input id="patientSearch" placeholder="Search by name, phone, or ID" />
          </div>

          {/* Patient select would be populated via search results */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium mb-1">Robert Johnson</h3>
            <p className="text-sm text-gray-500">ID: P10056 • Last visit: 14 Mar 2024</p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="new">
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Gender</Label>
            <RadioGroup defaultValue="male" className="flex gap-4">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </TabsContent>

      <div className="border-t my-6"></div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Appointment Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="session">Session</Label>
            <Select>
              <SelectTrigger id="session">
                <SelectValue placeholder="Select time slot" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">09:00 AM - 10:00 AM</SelectItem>
                <SelectItem value="2">10:00 AM - 11:00 AM</SelectItem>
                <SelectItem value="3">11:00 AM - 12:00 PM</SelectItem>
                <SelectItem value="4">01:00 PM - 02:00 PM</SelectItem>
                <SelectItem value="5">02:00 PM - 03:00 PM</SelectItem>
                <SelectItem value="6">03:00 PM - 04:00 PM</SelectItem>
                <SelectItem value="7">04:00 PM - 05:00 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="treatment">Treatment Type</Label>
          <Select>
            <SelectTrigger id="treatment">
              <SelectValue placeholder="Select treatment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="checkup">Regular Checkup</SelectItem>
              <SelectItem value="cleaning">Teeth Cleaning</SelectItem>
              <SelectItem value="filling">Dental Filling</SelectItem>
              <SelectItem value="rootcanal">Root Canal</SelectItem>
              <SelectItem value="extraction">Tooth Extraction</SelectItem>
              <SelectItem value="crown">Dental Crown</SelectItem>
              <SelectItem value="implant">Dental Implant</SelectItem>
              <SelectItem value="whitening">Teeth Whitening</SelectItem>
              <SelectItem value="braces">Orthodontic Treatment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="notes">Notes</Label>
            <span className="text-xs text-gray-500">Optional</span>
          </div>
          <Textarea id="notes" placeholder="Add any special notes or requirements" />
        </div>

        <div className="space-y-2">
          <Label>Is this an operation?</Label>
          <RadioGroup defaultValue="no" className="flex gap-4">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="yes" id="isOperation" />
              <Label htmlFor="isOperation">Yes</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="no" id="isNotOperation" />
              <Label htmlFor="isNotOperation">No</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-teal-600 hover:bg-teal-700">Create Appointment</Button>
        </div>
      </div>
    </Tabs>
  )
}

