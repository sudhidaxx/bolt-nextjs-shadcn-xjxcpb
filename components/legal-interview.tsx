'use client'

import { useState, useEffect } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Search, PenSquare, ChevronRight, Sparkles } from 'lucide-react'
import { validateResponse } from '@/utils/validation-utils'
import { ResponseFeedback } from './response-feedback'
import { generateFollowUpQuestions } from '@/utils/follow-up-questions'
import { ReviewPopup } from './review-popup'
import type { ValidationResult, LegalMatter, InterviewData } from '@/types'
import { legalMatters } from '@/data/legal-matters'
import { interviewQuestions } from '@/data/interview-questions'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default function LegalInterview() {
  const [description, setDescription] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [questions, setQuestions] = useState<string[]>([])
  const [responses, setResponses] = useState<string[]>([])
  const [validations, setValidations] = useState<ValidationResult[]>([])
  const [activeResponseIndex, setActiveResponseIndex] = useState<number | null>(null)
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([])
  const [pressedQuestions, setPressedQuestions] = useState<string[]>([])
  const [interviewHistory, setInterviewHistory] = useState<InterviewData[]>([])
  const [activeInterviewId, setActiveInterviewId] = useState<string | null>(null)
  const [isReviewOpen, setIsReviewOpen] = useState(false)

  const classifyLegalMatter = (text: string) => {
    const lowerText = text.toLowerCase()
    for (const [category, matter] of Object.entries(legalMatters)) {
      if (
        matter.scenarios.some(scenario => lowerText.includes(scenario.toLowerCase())) ||
        matter.vocabulary.some(word => lowerText.includes(word.toLowerCase()))
      ) {
        return category
      }
    }
    return text.length > 0 ? 'general' : null
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setDescription(text)
    const newCategory = classifyLegalMatter(text)
    if (newCategory !== activeCategory) {
      setActiveCategory(newCategory)
      setActiveInterviewId(null)
    }
  }

  const handleResponseChange = (index: number, value: string) => {
    const newResponses = [...responses]
    newResponses[index] = value
    setResponses(newResponses)

    const newValidations = [...validations]
    newValidations[index] = validateResponse(activeCategory || 'general', index, value)
    setValidations(newValidations)

    if (!activeInterviewId && value.trim() !== '') {
      const newId = Date.now().toString()
      const newInterview: InterviewData = {
        id: newId,
        partyName: index === 0 ? value : 'Unnamed Client',
        category: activeCategory || 'general',
        responses: newResponses,
        followUpQuestions: [],
      }
      setInterviewHistory(prev => [...prev, newInterview])
      setActiveInterviewId(newId)
    } else if (activeInterviewId) {
      setInterviewHistory(prev => prev.map(interview => 
        interview.id === activeInterviewId 
          ? { 
              ...interview, 
              responses: newResponses,
              partyName: index === 0 ? value : interview.partyName
            }
          : interview
      ))
    }
  }

  const handleGenerateFollowUp = () => {
    const newFollowUpQuestions = generateFollowUpQuestions(activeCategory || 'general', responses)
    setFollowUpQuestions(prev => [...prev, ...newFollowUpQuestions])
  }

  const handleFollowUpQuestionClick = (question: string) => {
    setPressedQuestions(prev => [...prev, question])
    setQuestions(prev => [...prev, question])
    setResponses(prev => [...prev, ''])
    setValidations(prev => [...prev, { isValid: false, strength: 'Weak', missingDetails: ['No response provided'] }])
  }

  const loadInterview = (id: string) => {
    const interview = interviewHistory.find(i => i.id === id)
    if (interview) {
      setActiveCategory(interview.category)
      setResponses(interview.responses)
      setFollowUpQuestions(interview.followUpQuestions)
      setPressedQuestions(interview.followUpQuestions)
      setActiveInterviewId(id)
    }
  }

  const handleReview = () => {
    setIsReviewOpen(true)
  }

  const handleSummarize = () => {
    const pdf = new jsPDF()
    pdf.text('FileNote', 14, 15)
    pdf.autoTable({
      head: [['Question', 'Answer']],
      body: questions.map((q, i) => [q, responses[i]]),
      startY: 25,
    })
    pdf.save('FileNote.pdf')
  }

  useEffect(() => {
    if (activeCategory) {
      const newQuestions = interviewQuestions[activeCategory as keyof typeof interviewQuestions]
      setQuestions(newQuestions)
      setResponses(new Array(newQuestions.length).fill(''))
      setValidations(new Array(newQuestions.length).fill({
        isValid: false,
        strength: 'Weak',
        missingDetails: ['No response provided']
      }))
      setFollowUpQuestions([])
      setPressedQuestions([])
    } else {
      setQuestions([])
      setResponses([])
      setValidations([])
      setFollowUpQuestions([])
      setPressedQuestions([])
      setActiveInterviewId(null)
    }
  }, [activeCategory])

  return (
    <div className="flex h-screen bg-purple-50">
      {/* Navigation Bar */}
      <div className="w-64 bg-purple-100 p-4 flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Interview History</h2>
        <div className="flex items-center mb-4">
          <div className="relative flex-grow">
            <Input 
              type="search" 
              placeholder="Search interviews..." 
              className="pl-8 pr-4 py-2 w-full"
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          </div>
          <Button size="icon" variant="ghost" className="ml-2" onClick={() => setActiveCategory(null)}>
            <PenSquare className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          {interviewHistory.map((interview) => {
            const firstPartyName = interview.responses[0]?.split(',')[0] || 'Unnamed Client'
            return (
              <Button
                key={interview.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left mb-2",
                  activeInterviewId === interview.id && "bg-purple-200"
                )}
                onClick={() => loadInterview(interview.id)}
              >
                <span className="truncate">{firstPartyName}</span>
                <ChevronRight className="ml-auto h-4 w-4" />
              </Button>
            )
          })}
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 pt-20 space-y-6 overflow-y-auto relative">
        <div className="fixed top-0 left-64 right-64 bg-purple-50 z-10">
          <div className="flex items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">👩‍⚖️</span>
              </div>
              <h1 className="text-2xl font-semibold">LISA</h1>
            </div>
            <Button
              onClick={handleReview}
              className="bg-gradient-to-r from-blue-400 to-purple-500 text-white hover:from-blue-500 hover:to-purple-600 flex items-center gap-2"
            >
              Review
              <Sparkles className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-medium">How can I help you today?</h2>
          <Textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Please describe your legal matter..."
            className="min-h-[150px] border-purple-100"
          />
        </div>

        <div className="flex gap-4 justify-center">
          {['general', 'family', 'tax'].map((category) => (
            <button
              key={category}
              className={cn(
                "px-6 py-3 rounded-lg transition-all duration-300",
                "bg-gradient-to-r from-blue-400 to-purple-500 text-white",
                activeCategory === category 
                  ? "opacity-100 from-blue-600 to-purple-700" 
                  : "opacity-70 hover:opacity-90",
                "font-medium"
              )}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)} matters
            </button>
          ))}
        </div>

        {questions.length > 0 && (
          <div className="space-y-6 mt-8">
            {questions.map((question, index) => (
              <div key={index} className="space-y-2">
                <p className="font-medium">{question}</p>
                <Textarea
                  value={responses[index]}
                  onChange={(e) => handleResponseChange(index, e.target.value)}
                  onFocus={() => setActiveResponseIndex(index)}
                  onBlur={() => setActiveResponseIndex(null)}
                  placeholder="Enter your answer here..."
                  className={cn(
                    "w-full transition-colors duration-200",
                    validations[index]?.strength === 'Strong'
                      ? "border-2 border-green-500 focus:border-green-500 focus:ring-green-500"
                      : validations[index]?.strength === 'Moderate'
                      ? "border-2 border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500"
                      : "border-2 border-red-500 focus:border-red-500 focus:ring-red-500"
                  )}
                />
                <ResponseFeedback 
                  validation={validations[index]} 
                  isActive={activeResponseIndex === index}
                />
              </div>
            ))}
            <Button
              onClick={handleGenerateFollowUp}
              className="bg-gradient-to-r from-blue-400 to-purple-500 text-white hover:from-blue-500 hover:to-purple-600 flex items-center gap-2"
            >
              Generate Follow-up Questions
              <Sparkles className="w-4 h-4 ml-1" />
            </Button>
            <div className="space-y-2">
              {followUpQuestions.map((question, index) => (
                pressedQuestions.includes(question) ? null : (
                  <Button
                    key={index}
                    variant="outline"
                    className="bg-purple-100 text-purple-800 hover:bg-purple-200"
                    onClick={() => handleFollowUpQuestionClick(question)}
                  >
                    {question}
                  </Button>
                )
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div className="w-64 bg-purple-100 p-4 flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Notes</h2>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Type your notes here..."
          className="flex-1 bg-white resize-none"
        />
      </div>

      {isReviewOpen && (
        <ReviewPopup
          questions={questions}
          responses={responses}
          validations={validations}
          onClose={() => setIsReviewOpen(false)}
          onSummarize={handleSummarize}
        />
      )}
    </div>
  )
}