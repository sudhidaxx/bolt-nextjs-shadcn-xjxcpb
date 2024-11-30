'use client'

import { ValidationResult } from "@/types"
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ResponseFeedbackProps {
  validation: ValidationResult
  isActive: boolean
}

export function ResponseFeedback({ validation, isActive }: ResponseFeedbackProps) {
  if (!validation || !isActive) return null

  return (
    <div className={cn(
      "text-sm p-2 rounded-md flex items-start gap-2",
      validation.strength === 'Strong'
        ? "bg-green-50 text-green-700"
        : validation.strength === 'Moderate'
        ? "bg-yellow-50 text-yellow-700"
        : "bg-red-50 text-red-700"
    )}>
      {validation.strength === 'Strong' ? (
        <CheckCircle className="h-4 w-4 mt-0.5" />
      ) : validation.strength === 'Moderate' ? (
        <AlertTriangle className="h-4 w-4 mt-0.5" />
      ) : (
        <AlertCircle className="h-4 w-4 mt-0.5" />
      )}
      <div>
        <p className="font-medium">Response {validation.strength}</p>
        <ul className="mt-1 list-disc list-inside">
          {validation.missingDetails.map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}