'use client'

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, X } from "lucide-react"
import type { ValidationResult } from "@/types"

interface ReviewPopupProps {
  questions: string[]
  responses: string[]
  validations: ValidationResult[]
  onClose: () => void
  onSummarize: () => void
}

export function ReviewPopup({
  questions,
  responses,
  validations,
  onClose,
  onSummarize,
}: ReviewPopupProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[600px] max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">Interview Review</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1 p-4">
          {questions.map((question, index) => (
            <div key={index} className="mb-6">
              <h3 className="font-medium mb-2">{question}</h3>
              <p className="text-gray-600 mb-2">{responses[index]}</p>
              <div className={`text-sm ${
                validations[index]?.strength === 'Strong'
                  ? 'text-green-600'
                  : validations[index]?.strength === 'Moderate'
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}>
                Response strength: {validations[index]?.strength}
              </div>
            </div>
          ))}
        </ScrollArea>

        <div className="p-4 border-t flex justify-end">
          <Button
            onClick={onSummarize}
            className="bg-gradient-to-r from-blue-400 to-purple-500 text-white hover:from-blue-500 hover:to-purple-600"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Summary
          </Button>
        </div>
      </div>
    </div>
  )
}