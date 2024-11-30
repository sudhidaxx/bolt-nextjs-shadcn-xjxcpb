'use client'

import dynamic from 'next/dynamic'

const LegalInterview = dynamic(() => import('@/components/legal-interview'), {
  ssr: false,
})

export default function Home() {
  return <LegalInterview />
}