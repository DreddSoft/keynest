import React from 'react'
import FooterOut from '@/components/FooterOut'

function OutLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {children}
      </main>
      <FooterOut />
    </div>
  )
}

export default OutLayout