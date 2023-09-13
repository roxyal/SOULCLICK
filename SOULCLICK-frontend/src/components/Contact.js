import React, { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import './style/Contact.css'
import Modal from "./Modal";

/*
    Contact - The html template for Contact section in the home page
*/
const Contact = () => {

    const ref = useRef();
    // Use to handle the success message
    const [success, setSuccess] = useState(null);

    // Check for valid Name
    const NAME_REGEX = /^([a-zA-Z]{3,20}\s?)+$/

    // Check for valid Email
    const EMAIL_REGEX = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9]+\..+$/

    // Check for valid Email
    const TEXT_REGEX = /^([a-zA-Z0-9.!?\\()-_=\s]{20,}\s?)+$/

    const [name, setName] = useState('')
    const [validName, setValidName] = useState(false)

    const [email, setEmail] = useState('')
    const [validEmail, setValidEmail] = useState(false)

    const [text, setText] = useState('')
    const [validText, setValidText] = useState(false)

    // Check whether if the user's input is valid
    useEffect(() => {
        setValidName(NAME_REGEX.test(name))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email])

    useEffect(() => {
        setValidText(TEXT_REGEX.test(text))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text])

    // All the handleClick 
    const onNameChanged = e => setName(e.target.value)
    const onEmailChanged = e => setEmail(e.target.value)
    const onTextChanged = e => setText(e.target.value)

    const canSend = [validName, validEmail, validText].every(Boolean)
    
    // If field is empty or valid field then, we can hide the <h5> text
    const emptyName = (!name || validName) ? 'hide' : ''
    const emptyEmail = (!email || validEmail) ? 'hide': ''
    const emptyText = (!text || validText) ? 'hide' : ''

    // If error occurs, we will have validNameClass be error msg
    const validNameClass = !validName ? 'Please enter at least 3 characters (No digits)' : ''
    const validEmailClass = !validEmail ? 'Please enter a valid email (your@example.com)' : ''
    const validTextClass = !validText ? 'Please enter at least 20 characters' : ''

    const onFormSubmit = (e) => {
        e.preventDefault();

        // If canSend is true, we can proceed on to send the User's particular through the use of Emailjs
        if (canSend) { 
            emailjs.sendForm(process.env.REACT_APP_SERVICE_ID, process.env.REACT_APP_TEMPLATE_ID, ref.current, process.env.REACT_APP_PUBLIC_KEY)
          .then(
            (result) => {
              console.log(result.text)
              setSuccess(true)
            },
            (error) => {
              console.log(error.text)
              setSuccess(false)
            }
          )
          // Reset the field to empty strings for every successful send request
          setName('')
          setEmail('')
          setText('')
        }
      }

    return (
        <section id="contact">
            <div className="contact-success">
                <Modal text={success && "Your message has been sent. We will get back to you soon :)"} />
            </div>
            <div className="contact-container">
                <div className="contact-left">
                    <form ref={ref} onSubmit={onFormSubmit} className="contact-form">
                        <h1>Contact Us</h1>
                        <input
                            placeholder='Name'
                            name="name"
                            type="text"
                            auto-complete="off"
                            value={name}
                            onChange={onNameChanged}
                            required
                        />
                        <h5 className={emptyName}>{validNameClass}</h5>
                        <input         
                            placeholder='Email'
                            name="email"
                            type="text"
                            auto-complete="off"
                            value={email}
                            onChange={onEmailChanged}
                            required
                         />
                         <h5 className={emptyEmail}>{validEmailClass}</h5>
                         <textarea
                            placeholder="Write your message"
                            name="message"
                            rows={8}
                            value={text}
                            onChange={onTextChanged}
                            required
                         />
                         <h5 className={emptyText}>{validTextClass}</h5>
                         <button type="submit">Send</button>
                    </form>
                </div>
            </div>
        </section>
    )
}
export default Contact