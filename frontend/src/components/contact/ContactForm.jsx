import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSend, FiMail, FiUser, FiMessageSquare } from 'react-icons/fi'
import { submitContact } from '../../api/dashboardApi'
import SectionHeading from '../ui/SectionHeading'
import ScrollReveal from '../ui/ScrollReveal'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')
    try {
      await submitContact(form)
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.response?.data?.detail || 'Failed to send message. Please try again.')
    }
  }

  return (
    <ScrollReveal>
      <section id="contact">
        <SectionHeading badge="msg">Contact</SectionHeading>

        <div className="max-w-xl mx-auto rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-6">
          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-accent-100 dark:bg-accent-500/10 flex items-center justify-center mb-4">
                <FiSend className="w-6 h-6 text-accent-600 dark:text-accent-400" />
              </div>
              <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-1">Message Sent</h3>
              <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
                Thank you! I'll get back to you soon.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="text-sm font-medium text-accent-600 dark:text-accent-400 hover:underline"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                icon={FiUser}
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <InputField
                icon={FiMail}
                name="email"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
              <InputField
                icon={FiMessageSquare}
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
                required
              />
              <div className="relative">
                <FiMessageSquare className="absolute top-3 left-3 w-4 h-4 text-surface-400" />
                <textarea
                  name="message"
                  placeholder="Your message..."
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-surface-200 dark:border-surface-700
                             bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-surface-100
                             placeholder:text-surface-400 dark:placeholder:text-surface-500
                             focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-400
                             transition-all resize-none"
                />
              </div>

              {status === 'error' && (
                <p className="text-xs text-red-500 dark:text-red-400">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white
                           bg-accent-600 hover:bg-accent-700 disabled:bg-accent-400 rounded-lg
                           transition-colors"
              >
                {status === 'sending' ? (
                  <span className="animate-pulse">Sending...</span>
                ) : (
                  <>
                    <FiSend className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </ScrollReveal>
  )
}

function InputField({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon className="absolute top-3 left-3 w-4 h-4 text-surface-400" />
      <input
        {...props}
        className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-surface-200 dark:border-surface-700
                   bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-surface-100
                   placeholder:text-surface-400 dark:placeholder:text-surface-500
                   focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-400
                   transition-all"
      />
    </div>
  )
}