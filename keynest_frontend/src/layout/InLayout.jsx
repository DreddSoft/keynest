import React from 'react'
import Footer from '../components/Footer'


function InLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default InLayout
