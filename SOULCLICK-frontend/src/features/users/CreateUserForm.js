import '../../components/style/CreateNewUserForm.css'
import profile_logo from '../img/profile_logo.png'
import { useState, useEffect } from 'react'
import { useCreateNewUserMutation, useGetUsersQuery } from './usersApiSlice'
import { useNavigate } from 'react-router-dom'
import useTitle from '../../hooks/useTitle'
import LogoBtn from '../../components/LogoBtn'

// CreateUserForm contain particulars like
// name, email, password, interest (arrayOfString), gender, dob (string), postImage.myFile (to get the file)
const CreateUserForm = () => {
    useTitle('SOULCLICK: Sign Up for FREE')
    // The difference between Mutation/Query is that createNewUser will only be called when u triggered it
    const [createNewUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useCreateNewUserMutation()

    // Use GetUserQuery hook to filter to see if there is any existing email (key in by user)
    const {
        data: users, // rename data to be users
        isLoading: usersLoading,
        isSuccess: usersSuccess,
        isError: usersError,
        error: usersErrorMsg
    } = useGetUsersQuery('usersList', {
        pollingInterval: 60000, // this UserList will be fetch every 60s 
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    // Input: email
    // Ouput: boolean (TRUE or FALSE whether email Exists)
    const emailExists = (email) => {
        if (usersSuccess) {
          const { ids, entities } = users
          const filteredIds = ids.filter(userId => entities[userId].email === email)
          return filteredIds.length > 0
        }
        return false
    }
    const navigate = useNavigate()

    // Regular Expression that only allows these field
    // const NAME_REGEX = /^([a-zA-Z]{3,20})*$/
    const NAME_REGEX = /^([a-zA-Z]{3,20}\s?)+$/
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
    const EMAIL_REGEX = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9]+\..+$/

    const [step, setStep] = useState(1);
    const [errorMsg, setErrorMsg] = useState('')
    const [name, setName] = useState('')
    const [validName, setValidName] = useState(false)

    const [email, setEmail] = useState('')
    const [validEmail, setValidEmail] = useState(false)

    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)

    const [interest, setInterest] = useState([])
    const [validInterest, setValidInterest] = useState(false)

    const [gender, setGender] = useState('male')
    const [dob, setDob] = useState('')
    const [postImage, setPostImage] = useState( {myFile: ""} )
    
    // Check whether if the user's input is valid
    useEffect(() => {
        setValidName(NAME_REGEX.test(name))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name])

    
    useEffect(() => {
        if (emailExists(email)) {
            setErrorMsg('That email is invalid or in use')
            setValidEmail(false)
        }
        else {
            setValidEmail(EMAIL_REGEX.test(email))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [password])

    useEffect(() => {
        setValidInterest(checkInterest(interest))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interest])

    // Once isSuccess is TRUE, then we reset all to ''
    useEffect(() => {
        if (isSuccess) {
            setName('')
            setEmail('')
            setPassword('')
            setInterest([])
            setGender('')
            setDob('')
            navigate('/success-creation')
        }
    }, [isSuccess, navigate])

    // All the handleClick 
    const onNameChanged = e => setName(e.target.value)
    const onEmailChanged = e => setEmail(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)

    // Because user will enter multiple interest split with ','
    const onInterestChanged = e => setInterest((e.target.value).split(',').map(value => value.trim()))

    const onGenderChanged = e => setGender(e.target.value)
    const onDobChanged = e => setDob(e.target.value)

    // File(Profile pic) upload, convert it to Base64 to be able to store in the MongoDB database
    const onFileUploadChanged = async (e) => {
        const file = e.target.files[0]
        const base64 = await convertToBase64(file)
        setPostImage({...postImage, myFile: base64})
    }

    // If all condition fulfill then we can save/create the User
    const canSave = [validName, validEmail, validPassword,validInterest, gender, dob, postImage.myFile]
                        .every(Boolean) && !isLoading


    // Handle the previousClick, if the user click back, when the step === 1,
    // then we sent them back to home page 
    const onPreviousClick = () => {
        if (step - 1 === 0) {
            navigate('/')
        }  
        setErrorMsg('')
        setStep(step - 1)
    }

    // Handle the checks to see if user key a valid field or missing field
    const onNextClick = () => {
        console.log("STEP: ", step)
        let msg = ''
        if (step === 1) {
            msg = !validName ? '[Please enter a valid name (minimum 3 character)]' : ''
        }
        if (step === 2) {
            msg = !validEmail ? '[Please enter a valid email]' : ''
        }
        if (step === 3) {
            msg = !validPassword ? '[at least 8 characters (minimum 1 uppercase & 1 lowercase & 1 digit)]' : ''
        }
        if (step === 4) {
            msg = !validInterest ? '[Please give at least 3 interest]' : ''
        }
        if (step === 5) {
            msg = !dob ? '[Please enter your Date of Birth]' : ''
        }
        if (step === 7) {
            msg = postImage.myFile === '' ? '[Please upload a photo of yourself]' : ''
        }

        // If no error msg, we can move to the next Step, (setErrorMsg to be empty)
        if (msg === '' || step === 6) {
            setStep(step + 1)
            setErrorMsg('')
        }
        else { // Set ErrowMsg to msg
            setErrorMsg(msg)
        }
    }

    // Reuseable renderStep function that renders (Name, Email, Password, Interest, DOB)
    const renderStep = (stepNumber, fields) => {
        return (
            <>
                {fields.map((field)=>(
                    <div className="render-container" key={field.id}>
                        <label htmlFor={field.id}>{field.label}</label>
                        <div className="particular-container">
                            <h3>{field.name}</h3>
                            <input
                                type={field.type}
                                id={field.id}
                                value={field.value}
                                checked={field.checked}
                                onChange={field.onChange}
                            />
                            {!errorMsg ? '' : <span>{errorMsg}</span>}
                            {stepNumber < 7 && (
                                <button className="next-btn" onClick={onNextClick}>Next</button>
                            )}
                            {stepNumber === 7 && (
                                <button type="submit">Create Account</button>
                            )}
                        </div>
                    </div>
                ))}
            </>
        )
    }
    // The reason why we have this standalone is because the html and css design is abit difference
    const renderGender = (stepNumber) => {
        return (
            <>
                <div className="render-container">
                    <label htmlFor="gender">What is your gender ?</label>
                    <div className="particular-container">
                        <div id="gender">
                            <label>
                                Male
                                <input type="radio" name="gender" value="male" checked={gender === 'male'} onChange={onGenderChanged}/>
                            </label>
                            <label>
                                Female
                                <input type="radio" name="gender" value="female" checked={gender === 'female'} onChange={onGenderChanged}/>
                            </label>
                        </div>
                        {stepNumber < 7 && (
                            <button className="next-btn" onClick={onNextClick}>Next</button>
                        )}
                    </div>
                </div>
            </>
        )
    } 
    
    // The reason why we have this standalone is because the html and css design is abit difference
    const renderProfile = (stepNumber) => {
        return (
            <>
                <div className="render-container">
                    <label htmlFor="profile">Upload a photo of yourself</label>
                    <div className="particular-container">
                        <div className="profile-logo">
                                <label htmlFor='file-upload'>
                                    <img src={postImage.myFile || profile_logo} alt="" />
                                </label>
                                <input
                                    type="file"
                                    name="myFile"
                                    id="file-upload"
                                    accept=".jpeg, .png, .jpg"
                                    onChange={onFileUploadChanged}
                                />
                                <h5>Click me to upload</h5>
                        </div>
                        {!errorMsg ? '' : <span>{errorMsg}</span>}
                        {stepNumber === 7 && (
                            <button id="create-submit-btn" type="submit">Create Account</button>
                        )}
                    </div>
                </div>
            </>
        )
    } 

    const stepOneFields = [
    {
        id: 'name',
        name: 'Name',
        label: 'Welcome! What is your name ?',
        type: 'text',
        value: name,
        onChange: onNameChanged,
    }]

    const stepTwoFields = [
    {
        id: 'email',
        name: 'Email',
        label: 'What is your email ?',
        type: 'email',
        value: email,
        onChange: onEmailChanged
    }]

    const stepThreeFields = [
    {
        id: 'password',
        name: 'Password',
        label: 'Create your password',
        type: 'password',
        value: password,
        onChange: onPasswordChanged
    }]

    const stepFourFields = [
    {
        id: 'interest',
        name: 'Interest',
        label: 'Write at least 3 things you like to do (e.g badminton, gaming, hiking)',
        type: 'text',
        value: interest,
        onChange: onInterestChanged
    }]

    const stepFiveFields = [
    {
        id: 'dob',
        name: 'Date of Birth',
        label: 'When is your birthday ?',
        type: 'date',
        value: dob,
        onChange: onDobChanged
    }]


    // createAccount handle, such that when form is click, it will create the user if canSave is TRUE
    const onCreateAccountClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            console.log("CREATING ACCOUNT ....")
            await createNewUser({ name, email, password, interest, dob, gender, postImage })
        }
        else {
            onNextClick()
            console.log("CANNOT CREATE ERROR")
        }
    }

    const content = (
        <>
            <p>{error?.data?.message}</p>
            <div className="create-account-page-container">
                <LogoBtn />
                <div className="create-user-form">
                    <form className="create-user-container" onSubmit={onCreateAccountClicked}>
                        <div className="create-user-form-title">
                            <h1 onClick={onPreviousClick}>&lt;</h1>
                            <h3>About You</h3>
                        </div>

                        {step === 1 && renderStep(1, stepOneFields)}
                        {step === 2 && renderStep(2, stepTwoFields)}
                        {step === 3 && renderStep(3, stepThreeFields)}
                        {step === 4 && renderStep(4, stepFourFields)}
                        {step === 5 && renderStep(5, stepFiveFields)}

                        {step === 6 && renderGender(6)}
                        {step === 7 && renderProfile(7)}
                    </form>
                </div>
            </div>
        </>
    )
    return content
}
export default CreateUserForm

// Helper function to convert the user's input profile image to a Base64 such that to be able to store in DB
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.readAsDataURL(file)
        fileReader.onload = () => {
            resolve(fileReader.result)
        }
        fileReader.onerror = (error) => {
            reject(error)
        }
    })
}

// check to see if the user's input interest have at least 3 tagging anot
function checkInterest(interest) {
    if (interest.length >= 3) {
        return true
    }
    else return false
}
