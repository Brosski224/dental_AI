"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FilePlus, File } from "lucide-react"
import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type PrescriptionData = {
  firstName: string
  lastName: string
  dob: string
  gender: string
  bloodGroup: string
  phone: string
  email: string
  address: string
  emergencyContact: string
  allergies?: string
  existingConditions?: string
  currentMedications?: { name: string; dosage: string; frequency: string; duration: string }[]
  lastDentalCheckup?: string
  previousDentalProcedures?: string
  doctor?: string
  date?: string
  medications?: { name: string; dosage: string; frequency: string; duration: string }[]
  notes?: string
}

export default function NewPatientForm() {
  const [extractedPrescription, setExtractedPrescription] = useState<PrescriptionData>({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    phone: "",
    email: "",
    address: "",
    emergencyContact: "",
  })
  const [editMode, setEditMode] = useState(true)
  const [xrayAnalysisResult, setXrayAnalysisResult] = useState(null)
  type PhotoAnalysisResult = {
    findings: { type: string; severity: string }[]
    recommendations: string
  }
  const [xrayResultImage, setXrayResultImage] = useState<string | null>(null);
  const [xrayAnalysisDetails, setXrayAnalysisDetails] = useState(null);
  const [photoAnalysisResult, setPhotoAnalysisResult] = useState<PhotoAnalysisResult | null>(null)
  const [treatmentPlan, setTreatmentPlan] = useState(null)
  const [xrayFile, setXrayFile] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const [prescriptionFile, setPrescriptionFile] = useState(null)
  const [isLoading, setIsLoading] = useState({
    prescription: false,
    xray: false,
    photo: false,
    treatment: false,
  })

  const prescriptionFileInput = useRef(null)
  const xrayFileInput = useRef(null)
  const photoFileInput = useRef(null)

  // 1. Upload and extract prescription data
  const uploadPrescription = async (file) => {
    if (!file) return
    setPrescriptionFile(file)
  }

  // Extract data from uploaded prescription
  const extractPrescriptionData = async () => {
    if (!prescriptionFile) return

    setIsLoading((prev) => ({ ...prev, prescription: true }))

    try {
      const formData = new FormData()
      formData.append("file", prescriptionFile)

      const response = await fetch("http://localhost:8000/api/extract", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to extract prescription data")
      }

      const data = await response.json()

      // Map the extracted data to our frontend format
      setExtractedPrescription({
        firstName: data.Name?.split(" ")[0] || "",
        lastName: data.Name?.split(" ").slice(1).join(" ") || "",
        dob: "", // Not available in the extracted data
        gender: data.Gender || "",
        bloodGroup: data["Blood Group"] || "",
        phone: "", // Not available in the extracted data
        email: "", // Not available in the extracted data
        address: "", // Not available in the extracted data
        emergencyContact: "", // Not available in the extracted data
        allergies: data.Allergies || "",
        existingConditions: data["Existing Conditions"] || "",
        currentMedications: data["Current Medications"]
          ? [{ name: data["Current Medications"], dosage: "", frequency: "", duration: "" }]
          : [],
        previousDentalProcedures: data["Previous Dental Procedures"] || "",
        notes: data["Doctor's Notes"] || "",
      })
    } catch (error) {
      console.error("Error extracting prescription data:", error)
      alert("Failed to extract prescription data")
    } finally {
      setIsLoading((prev) => ({ ...prev, prescription: false }))
    }
  }

  // 2. Analyze X-ray using YOLO model
  // 2. Analyze X-ray using YOLO model
  const analyzeXray = async () => {
    if (!xrayFile) {
        console.log("No X-ray file selected");
        return;
    }

    setIsLoading((prev) => ({ ...prev, xray: true }));

    try {
        const formData = new FormData();
        formData.append("file", xrayFile);

        console.log("Sending X-ray to API...");

        const response = await fetch("http://localhost:8000/api/analyze-xray", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to analyze X-ray");
        }

        const data = await response.json(); // Get JSON response

        // ✅ Set the correct image path (served by FastAPI)
        const imageUrl = "http://localhost:8000/static/temp/output.jpg";  
        setXrayResultImage(imageUrl);

        // ✅ Store analysis details (detections)
        setXrayAnalysisDetails(data.detections);
    } catch (error) {
        console.error("Error analyzing X-ray:", error);
        alert("Failed to analyze X-ray");
    } finally {
        setIsLoading((prev) => ({ ...prev, xray: false }));
    }
};



  // 3. Analyze photo using DenseNet model
  const analyzePhoto = async () => {
    if (!photoFile) {
        console.log("No photo file selected");
        return;
    }

    console.log("Starting photo analysis...");

    setIsLoading((prev) => ({ ...prev, photo: true }));

    try {
        const formData = new FormData();
        formData.append("file", photoFile);
        
        console.log("Sending request to API...");
        
        const response = await fetch("http://localhost:8000/api/analyze-photo", {
            method: "POST",
            body: formData,
        });

        console.log("Received response:", response);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Failed to analyze photo. Server response:", errorText);
            throw new Error("Failed to analyze photo: " + errorText);
        }

        const data = await response.json();
        console.log("API Response Data:", data);

        const conditionType = data.predicted_class || data.condition || "Unknown condition";

        setPhotoAnalysisResult({
            findings: [{ type: conditionType, severity: data.severity || "Detected" }],
            recommendations: `${conditionType} has been detected. ${data.recommendations || "Consider appropriate treatment."}`,
        });

    } catch (error) {
        console.error("Error analyzing photo:", error);
        alert("Failed to analyze photo");
        setPhotoAnalysisResult({
            findings: [{ type: "Analysis failed", severity: "Unknown" }],
            recommendations: "Photo analysis failed. Please try again or proceed without analysis.",
        });
    } finally {
        setIsLoading((prev) => ({ ...prev, photo: false }));
    }
};

  // 4. Generate treatment recommendation
  const generateTreatmentPlan = async () => {
    setIsLoading((prev) => ({ ...prev, treatment: true }))

    try {
      // Prepare patient data for the API
      const patientData = {
        name: `${extractedPrescription.firstName} ${extractedPrescription.lastName}`,
        gender: extractedPrescription.gender,
        bloodGroup: extractedPrescription.bloodGroup,
        allergies: extractedPrescription.allergies,
        existingConditions: extractedPrescription.existingConditions,
        currentMedications: extractedPrescription.currentMedications?.map((med) => med.name).join(", "),
        previousDentalProcedures: extractedPrescription.previousDentalProcedures,
        xrayFindings: xrayAnalysisResult ? xrayAnalysisResult.findings.map((f) => f.type).join(", ") : "",
        photoFindings: photoAnalysisResult ? photoAnalysisResult.findings.map((f) => f.type).join(", ") : "",
      }

      const response = await fetch("http://localhost:8000/api/treatment-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      })

      if (!response.ok) {
        throw new Error("Failed to generate treatment plan")
      }

      const treatmentData = await response.json()

      setTreatmentPlan(treatmentData)

      // Update prescription with recommended medications if any
      if (treatmentData.medications && treatmentData.medications.length > 0) {
        const formattedMeds = treatmentData.medications.map((med) => {
          // Check if medication is already an object or just a string
          if (typeof med === "string") {
            return { name: med, dosage: "", frequency: "", duration: "" }
          }
          return med
        })

        setExtractedPrescription((prev) => ({
          ...prev,
          medications: formattedMeds,
        }))
      }
    } catch (error) {
      console.error("Error generating treatment plan:", error)
      alert("Failed to generate treatment plan")
    } finally {
      setIsLoading((prev) => ({ ...prev, treatment: false }))
    }
  }

  // Save to database
  const saveToDatabase = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...extractedPrescription,
          xrayAnalysis: xrayAnalysisResult,
          photoAnalysis: photoAnalysisResult,
          treatmentPlan: treatmentPlan,
        }),
      })
      if (response.ok) {
        alert("Patient data saved successfully!")
        return true
      }
      return false
    } catch (error) {
      console.error("Error saving to database:", error)
      alert("Failed to save patient data")
      return false
    }
  }

  return (
    <div className="space-y-4 max-h-screen overflow-y-auto">
      {/* Tabs */}
      <Tabs defaultValue="personal-info">
        <TabsList>
          <TabsTrigger value="personal-info">Personal Information</TabsTrigger>
          <TabsTrigger value="medical-history">Medical History</TabsTrigger>
          <TabsTrigger value="x-rays">X-Rays & Records</TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal-info">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Enter patient's personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload and Extract Prescription */}
              <div className="flex space-x-2">
                <Button
                  onClick={() => prescriptionFileInput.current?.click()}
                  variant="outline"
                  className="flex-1"
                  disabled={isLoading.prescription}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {isLoading.prescription ? "Uploading..." : "Upload Previous Prescription"}
                </Button>
                <Button
                  onClick={extractPrescriptionData}
                  variant="outline"
                  className="flex-1"
                  disabled={!prescriptionFile || isLoading.prescription}
                >
                  <FilePlus className="mr-2 h-4 w-4" />
                  {isLoading.prescription ? "Extracting..." : "Extract PDF"}
                </Button>
              </div>
              <Input
                type="file"
                ref={prescriptionFileInput}
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    uploadPrescription(e.target.files[0])
                  }
                }}
              />

              {/* File Selected Indicator */}
              {prescriptionFile && (
                <div className="flex items-center p-2 bg-gray-100 rounded">
                  <File className="h-4 w-4 mr-2" />
                  <span className="text-sm">{prescriptionFile.name}</span>
                </div>
              )}

              {/* Personal Information Fields */}
              <Input
                placeholder="First Name"
                value={extractedPrescription?.firstName || ""}
                onChange={(e) => setExtractedPrescription((prev) => ({ ...prev, firstName: e.target.value }))}
              />
              <Input
                placeholder="Last Name"
                value={extractedPrescription?.lastName || ""}
                onChange={(e) => setExtractedPrescription((prev) => ({ ...prev, lastName: e.target.value }))}
              />
              <Input
                type="date"
                value={extractedPrescription?.dob || ""}
                onChange={(e) => setExtractedPrescription((prev) => ({ ...prev, dob: e.target.value }))}
              />
              <RadioGroup
                value={extractedPrescription?.gender || ""}
                onChange={(value) => setExtractedPrescription((prev) => ({ ...prev, gender: value }))}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
              <Select
                value={extractedPrescription?.bloodGroup || ""}
                onValueChange={(value) => setExtractedPrescription((prev) => ({ ...prev, bloodGroup: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Blood Group" />
                </SelectTrigger>
                <SelectContent>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Phone"
                value={extractedPrescription?.phone || ""}
                onChange={(e) => setExtractedPrescription((prev) => ({ ...prev, phone: e.target.value }))}
              />
              <Input
                placeholder="Email"
                value={extractedPrescription?.email || ""}
                onChange={(e) => setExtractedPrescription((prev) => ({ ...prev, email: e.target.value }))}
              />
              <Textarea
                placeholder="Address"
                value={extractedPrescription?.address || ""}
                onChange={(e) => setExtractedPrescription((prev) => ({ ...prev, address: e.target.value }))}
              />
              <Input
                placeholder="Emergency Contact"
                value={extractedPrescription?.emergencyContact || ""}
                onChange={(e) => setExtractedPrescription((prev) => ({ ...prev, emergencyContact: e.target.value }))}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medical History Tab */}
        <TabsContent value="medical-history">
          <Card>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
              <CardDescription>Record patient's medical history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Allergies"
                value={extractedPrescription?.allergies || ""}
                onChange={(e) => setExtractedPrescription((prev) => ({ ...prev, allergies: e.target.value }))}
              />
              <Textarea
                placeholder="Existing Conditions"
                value={extractedPrescription?.existingConditions || ""}
                onChange={(e) => setExtractedPrescription((prev) => ({ ...prev, existingConditions: e.target.value }))}
              />
              <h4 className="font-semibold">Current Medications:</h4>
              {extractedPrescription?.currentMedications?.length > 0 ? (
                extractedPrescription.currentMedications.map((med, index) => (
                  <div key={index}>
                    {med.name} - {med.dosage}, {med.frequency}, {med.duration}
                  </div>
                ))
              ) : (
                <div>No current medications</div>
              )}
              <Textarea
                placeholder="Previous Dental Procedures"
                value={extractedPrescription?.previousDentalProcedures || ""}
                onChange={(e) =>
                  setExtractedPrescription((prev) => ({ ...prev, previousDentalProcedures: e.target.value }))
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* X-Rays Tab */}
        <TabsContent value="x-rays">
          <Card>
            <CardHeader>
              <CardTitle>X-Rays & Records</CardTitle>
              <CardDescription>Upload and analyze X-Rays and photos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload Buttons */}
              <div className="flex gap-4">
                <Button onClick={() => xrayFileInput.current?.click()} variant="outline">
                  Upload X-Ray
                </Button>
                <Button onClick={() => photoFileInput.current?.click()} variant="outline">
                  Upload Photo
                </Button>
              </div>

              {/* Hidden File Inputs */}
              <Input
                type="file"
                ref={xrayFileInput}
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setXrayFile(e.target.files[0])
                    setPhotoFile(null) // Clear photo if X-ray selected
                  }
                }}
              />
              <Input
                type="file"
                ref={photoFileInput}
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setPhotoFile(e.target.files[0])
                    setXrayFile(null) // Clear X-ray if photo selected
                  }
                }}
              />

              {/* Analysis Buttons */}
              {xrayFile && (
                <Button onClick={analyzeXray} disabled={!xrayFile || isLoading.xray} className="w-full">
                  {isLoading.xray ? "Analyzing..." : "Analyze X-Ray"}
                </Button>
              )}
              {photoFile && (
                <Button onClick={analyzePhoto} disabled={!photoFile || isLoading.photo} className="w-full">
                  {isLoading.photo ? "Analyzing..." : "Analyze Photo"}
                </Button>
              )}

{/* Analysis Results */}
{xrayResultImage && (
  <div className="space-y-2">
    <h3 className="font-semibold">X-Ray Analysis Results</h3>

    {/* Display the processed image */}
    <img
      src={xrayResultImage}
      alt="Processed X-Ray"
      className="w-full h-64 object-contain border rounded"
    />

    {/* Display detection details */}
    {xrayAnalysisDetails && (
      <div className="space-y-1">
        {xrayAnalysisDetails.map((finding, index) => (
          <div key={index} className="p-2 border rounded">
            <Badge variant="secondary">{finding.class}</Badge>
            <div>Confidence: {Math.round(finding.confidence * 100)}%</div>
            <div>Coordinates: {finding.coordinates.join(", ")}</div>
          </div>
        ))}
      </div>
    )}
  </div>
)}

              {/* Analysis Results */}
              {xrayAnalysisResult && (
                <div className="space-y-2">
                  <h3 className="font-semibold">X-Ray Analysis Results</h3>
                  {xrayFile && (
                    <img
                      src={URL.createObjectURL(xrayFile) || "/placeholder.svg"}
                      alt="X-Ray"
                      className="w-full h-64 object-contain border rounded"
                    />
                  )}
                  <div className="space-y-1">
                    {xrayAnalysisResult.findings.map((finding, index) => (
                      <div key={index} className="p-2 border rounded">
                        <Badge variant="secondary">{finding.type}</Badge>
                        <div>Location: {finding.location}</div>
                        <div>Severity: {finding.severity}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {photoAnalysisResult && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Photo Analysis Results</h3>
                  {photoFile && (
                    <img
                      src={URL.createObjectURL(photoFile) || "/placeholder.svg"}
                      alt="Dental Photo"
                      className="w-full h-64 object-contain border rounded"
                    />
                  )}
                  <div className="space-y-1">
                    {photoAnalysisResult.findings.map((finding, index) => (
                      <div key={index} className="p-2 border rounded">
                        <Badge variant="secondary">{finding.type}</Badge>
                        {finding.severity && <div>Severity: {finding.severity}</div>}
                      </div>
                    ))}
                    {/* Parse the recommendations to avoid duplication */}
                    <p className="mt-2 text-gray-700">
                      {photoAnalysisResult.recommendations.replace(/^(.*?) has been detected\./i, "").trim()}
                    </p>
                  </div>
                </div>
              )}

              {/* Treatment Recommendation */}
              {(xrayAnalysisResult || photoAnalysisResult) && (
                <Button onClick={generateTreatmentPlan} className="w-full" disabled={isLoading.treatment}>
                  {isLoading.treatment ? "Generating..." : "Recommend Treatment"}
                </Button>
              )}

              {/* Treatment Plan Display */}
              {treatmentPlan && (
                <div className="space-y-2 p-4 border rounded bg-gray-50">
                  <h3 className="font-semibold text-lg">Recommended Treatment Plan</h3>

                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Diagnosis:</span> {treatmentPlan.diagnosis}
                    </div>

                    {treatmentPlan.symptoms && (
                      <div>
                        <span className="font-medium">Symptoms:</span> {treatmentPlan.symptoms}
                      </div>
                    )}

                    <div>
                      <span className="font-medium">Treatment:</span> {treatmentPlan.treatment}
                    </div>

                    {treatmentPlan.medications && treatmentPlan.medications.length > 0 && (
                      <div>
                        <span className="font-medium">Recommended Medications:</span>
                        <ul className="list-disc pl-5 mt-1">
                          {treatmentPlan.medications.map((med, index) => (
                            <li key={index}>
                              {typeof med === "string"
                                ? med
                                : `${med.name} ${med.dosage} - ${med.frequency} for ${med.duration}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Save Button */}
              {treatmentPlan && (
                <Button onClick={saveToDatabase} className="w-full bg-teal-600 hover:bg-teal-700">
                  Save Patient Record
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
