import React from 'react'
import { useState } from 'react'
import { siteConfig } from '../content/siteContent.js'

const initialState = {
  description: '',
  email: '',
  name: '',
  nextStep: 'Book a consultation call',
  organisation: '',
  phone: '',
  service: 'Business & Organisational Consulting',
}

export function ContactForm() {
  const [formData, setFormData] = useState(initialState)
  const [isReady, setIsReady] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const subject = `${siteConfig.name} enquiry from ${formData.name || 'Website visitor'}`
    const body = [
      `Full Name: ${formData.name}`,
      `Organisation: ${formData.organisation}`,
      `Email Address: ${formData.email}`,
      `Phone Number: ${formData.phone}`,
      `Service of Interest: ${formData.service}`,
      `Preferred Next Step: ${formData.nextStep}`,
      '',
      'Brief Description of Need:',
      formData.description,
    ].join('\n')

    window.location.href = `mailto:${siteConfig.primaryEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setIsReady(true)
  }

  return (
    <form className="contact-form" id="enquiry" onSubmit={handleSubmit}>
      <label className="field">
        <span>Full Name</span>
        <input name="name" onChange={handleChange} required type="text" value={formData.name} />
      </label>
      <label className="field">
        <span>Organisation</span>
        <input name="organisation" onChange={handleChange} type="text" value={formData.organisation} />
      </label>
      <label className="field">
        <span>Email Address</span>
        <input name="email" onChange={handleChange} required type="email" value={formData.email} />
      </label>
      <label className="field">
        <span>Phone Number</span>
        <input name="phone" onChange={handleChange} type="tel" value={formData.phone} />
      </label>
      <label className="field">
        <span>Service of Interest</span>
        <select name="service" onChange={handleChange} value={formData.service}>
          <option>Business &amp; Organisational Consulting</option>
          <option>Capacity Building &amp; Professional Development</option>
          <option>Institutional &amp; Project Advisory</option>
          <option>Not sure yet</option>
        </select>
      </label>
      <label className="field field--wide">
        <span>Brief Description of Need</span>
        <textarea
          name="description"
          onChange={handleChange}
          placeholder="Tell us about your goals, challenge, or preferred engagement."
          required
          rows="6"
          value={formData.description}
        />
      </label>
      <label className="field field--wide">
        <span>Preferred Next Step</span>
        <select name="nextStep" onChange={handleChange} value={formData.nextStep}>
          <option>Book a consultation call</option>
          <option>Request a proposal</option>
          <option>Receive more information</option>
        </select>
      </label>
      <div className="contact-form__footer">
        <button className="button button--primary" type="submit">
          Send Enquiry
        </button>
        <p className="form-note">
          {isReady
            ? 'Your mail app should open with the enquiry prefilled.'
            : 'Submitting opens your email app with the enquiry prefilled to the consulting team.'}
        </p>
      </div>
    </form>
  )
}
