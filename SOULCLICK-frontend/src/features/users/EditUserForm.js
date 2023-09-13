import './CreateNewUserForm.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUpdateUserMutation } from './usersApiSlice'

// EditUserForm contains particulars that user can UPDATE
// name, interest (arrayOfString), postImage.myFile (to get the file)
// We dont allow you to change Date of Birth and Gender after you created (to prevent fake profile creators)
// User can change password/email but this will not be add EditUserForm
const EditUserForm = ({ user }) => {
    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation()

    const navigate = useNavigate()

    // Regular Expression that only allows these field
    const NAME_REGEX = /^[a-zA-Z]{3,20}$/

    // Set the starting of the state of each particulars to their previous last use 
    const [name, setName] = useState(user.name)
    const [validName, setValidName] = useState(false)

    const [interest, setInterest] = useState(user.interest)
    const [validInterest, setValidInterest] = useState(false)

    const [postImage, setPostImage] = useState( {myFile: user.postImage.myFile} )

    // Check whether if the user's input is valid
    useEffect(() => {
        setValidName(NAME_REGEX.test(name))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name])

    useEffect(() => {
        setValidInterest(checkInterest(interest))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interest])

    // Once isSuccess is TRUE, then we reset all to ''
    useEffect(() => {
        if (isSuccess) {
            setName('')
            setInterest([])
            navigate('/soulclick/users') // Will change to go back to Welcome (after user login) Page
        }
    }, [isSuccess, navigate])

    // All the handleClick 
    const onNameChanged = e => setName(e.target.value)
    // Because user will enter multiple interest split with ','
    const onInterestChanged = e => setInterest((e.target.value).split(','))

    // File(Profile pic) upload, convert it to Base64 to be able to store in the MongoDB database
    const onFileUploadChanged = async (e) => {
        const file = e.target.files[0]
        const base64 = await convertToBase64(file)
        setPostImage({...postImage, myFile: base64})
    }

    // If all condition fulfill then we can save/create the User
    let canSave
    
    // If user never changed anything, then we make SAVE button unclickable 
    // OR User make all field became empty (you will not allow him to save)
    if ((user.name === name && user.interest === interest && user.postImage.myFile === postImage.myFile) ||
        (!name && !interest.length && !postImage.myFile)) {
            canSave = false
        }
    else {
        canSave = [validName, validInterest, postImage.myFile]
                        .every(Boolean) && !isLoading
    }
        
    // editUser handle, such that when form is click, it will edit the user if canSave is TRUE
    const onEditUserClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await updateUser({ id: user.id, name, interest, postImage })
        }
    }

    // If error occurs, we will have className set to "incomplete css"
    // If error occurs, we will have className set to "incomplete css"
    const errClass = isError ? "errmsg" : "offscreen"
    const validNameClass = !validName ? 'form-input-incomplete' : ''
    const validInterestClass = !validInterest ? 'form-input-incomplete' : ''
    const validFileUploadClass = !postImage.myFile ? 'form-input-incomplete' : ''
    
    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>
            <div className="create-user-form">
                <form onSubmit={onEditUserClicked}>
                    <div className="create-user-form-title">
                        <h1>Sign Up!</h1>
                        <h5>Come & Make new friends NOW!</h5>
                    </div> 
                    <div className="profile-particular-box">
                        <div className="profile-logo">
                            <label htmlFor='file-upload'>
                                <img src={postImage.myFile || profile_logo} alt="" />
                            </label>
                            <input
                                className={`${validFileUploadClass}`}
                                type="file"
                                name="myFile"
                                id="file-upload"
                                accept=".jpeg, .png, .jpg"
                                onChange={onFileUploadChanged}
                                required
                            />
                            <h5>Click me to upload</h5>
                        </div>
                        <div className="particular-box">
                            <div className="particular-each-container">
                                <h5>Name:</h5>
                                <input
                                    className={`input-group ${validNameClass}`}
                                    placeholder='3 - 20 characters'
                                    id="name"
                                    name="name"
                                    type="text"
                                    auto-complete="off"
                                    value={name}
                                    onChange={onNameChanged}
                                    required
                                />
                                {/* <button><FiHelpCircle className="form-info-circle"/><span>What's your name</span></button> */}
                            </div>
                            <div className="particular-each-container interest-input">
                                <h5>Interest:</h5>
                                <input
                                    className={`input-group ${validInterestClass}`}
                                    placeholder='Interest (min. 3 interest)'
                                    id="interest"
                                    name="interest"
                                    type="text"
                                    auto-complete="off"
                                    value={interest}
                                    onChange={onInterestChanged}
                                    required
                                />
                            </div>
                            {/* <FiHelpCircle className="form-info-circle"/> */}
                        </div>
                    </div>
                    <button type="submit">SAVE</button>
                </form>
            </div>
        </>
    )
    return content
}
export default EditUserForm