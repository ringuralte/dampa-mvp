import type { Flow, Params, Settings, Styles } from 'react-chatbotify'
import { useEffect, useState } from 'react'
import ChatBot from 'react-chatbotify'
import { useNavigate } from 'react-router'

export default function AppChatBot() {
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    // Initial check
    checkMobile()

    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const flow: Flow = {
    start: {
      message: 'Hello! Welcome to Dampa Tiger Reserve. How can I assist you today?',
      options: ['Book a Visit', 'Gallery', 'About Us', 'Contact'],
      path: 'process_options',
    },
    process_options: {
      transition: { duration: 0 },
      path: (params) => {
        switch (params.userInput) {
          case 'Book a Visit':
            return 'booking'
          case 'Gallery':
            return 'gallery'
          case 'About Us':
            return 'about'
          case 'Contact':
            return 'contact'
          default:
            return 'unknown'
        }
      },
    },
    booking: {
      message: 'You can book your visit directly through our website.',
      component: (
        <div style={{ padding: 10 }}>
          <button
            type="button"
            onClick={() => navigate('/booking')}
            style={{
              padding: '8px 16px',
              background: '#d97706',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Go to Booking Page
          </button>
        </div>
      ),
      options: ['Back to Menu'],
      path: 'process_options',
    },
    gallery: {
      message: 'Check out our beautiful gallery of the reserve.',
      component: (
        <div style={{ padding: 10 }}>
          <button
            type="button"
            onClick={() => navigate('/gallery')}
            style={{
              padding: '8px 16px',
              background: '#d97706',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            View Gallery
          </button>
        </div>
      ),
      options: ['Back to Menu'],
      path: 'process_options',
    },
    about: {
      message: 'Dampa Tiger Reserve is home to diverse flora and fauna in Mizoram.',
      component: (
        <div style={{ padding: 10 }}>
          <button
            type="button"
            onClick={() => navigate('/about-us')}
            style={{
              padding: '8px 16px',
              background: '#d97706',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Read About Us
          </button>
        </div>
      ),
      options: ['Back to Menu'],
      path: 'process_options',
    },
    contact: {
      message: 'You can reach us at the contact details found in the footer, or visit the About Us page.',
      options: ['Back to Menu'],
      path: 'process_options',
    },
    unknown: {
      message: async (params: Params) => {
        try {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: params.userInput }),
          })

          if (!response.ok) {
            throw new Error('Network response was not ok')
          }

          const data = await response.json()
          await params.simulateStreamMessage(data.response, 'bot', MsgChunker)
          return ''
        }
        catch (error) {
          console.error('error', error)
          return 'I\'m having trouble connecting to the server. Please try again later or use the menu options.'
        }
      },
      path: 'process_options',
    },
  }

  const settings: Settings = {
    general: {
      embedded: false,
      fontFamily: 'inherit',
    },
    header: {
      title: 'Dampa Assistant',
      avatar: '/logo_3.png',
    },
    chatButton: {
      icon: '/logo_3.png',
    },
    tooltip: {
      mode: 'CLOSE',
      text: 'Need help? Chat with us!',
    },
    footer: {
      text: '',
    },
  }

  const styles: Styles = {
    chatButtonStyle: {
      bottom: isMobile ? '90px' : '20px',
      right: '20px',
    },
  }

  return (
    <ChatBot flow={flow} settings={settings} styles={styles} />
  )
}

export function MsgChunker(text: string): string[] {
  const chunks: string[] = []
  let i = 0
  while (i < text.length) {
    const chunkSize = Math.floor(Math.random() * 3) + 1
    chunks.push(text.slice(i, i + chunkSize))
    i += chunkSize
  }
  return chunks
}
