import React, { useState } from "react";
import styles from '../AccountSettings.module.scss';
import DOMPurify from 'dompurify';
import axios from '../../../../axios';
import { motion } from "framer-motion";
import { FormControl, InputLabel, OutlinedInput, Button } from '@material-ui/core';

/**
 * Child component of account settings. Is a form that takes the current password and the new username to update . 
 * Handles logic for updating the username in the database. 
*/
const UpdateUsernameForm = props => {
	let [newUsername, setNewUsername] = useState('');
	let [confirmUsername, setConfirmUsername] = useState('');
	let [password, setPassword] = useState('');

	/** 
	 * makes sure password is correct. If password is correct. 
	 * Handles alerting user if password is wrong.
	 * returns true if correct. returns false if wrong.
	*/
	const checkPassword = async() => {
        let isPasswordCorrect = await props.checkPasswordInput(password);
        if(isPasswordCorrect) {  
			return true;
		} else {
			props.showHideCustomAlert('Your password was incorrect.');
			return false;
		}	
	}

	/**
	 * See if an account is already registered with the username they are trying to change to. 
	 * Handles alerting user if username is taken.
	 * Return true if username is not taken. Return false if username is taken
	*/
	const checkIfUsernameIsTaken = async userName => {	
		//try to get the username they are wanting to register as
		let userID = await axios.get('userIDByUsername/' + userName + '.json');
		if(userID.data === null) {
			return true;
		} else {
			props.showHideCustomAlert("Username is already taken!");
			return false;		
		}		  
	}

	/**
	 * Makes sure new username and confirm new username fields are the same and that the new username is the correct length.
	 * Handles alerting user if username is invalid.
	 * Returns true if username is valid. Returns false if username is invalid.
	*/
	const validateNewUsername = () => {
		if(newUsername !== confirmUsername) { 
			props.showHideCustomAlert('User names do not match.');
			return false;
		}
		if(newUsername.length > 10 ) {
			props.showHideCustomAlert("Username must be less than 10 characters", null);
			return false;
		} else if(!newUsername || newUsername.length < 5) {
			props.showHideCustomAlert("Username must be 5 characters long.", null);
			return false;
		}
		return true;
	}

	// sanitizes the new username for security and returns the sanitized username 
	const sanitizeNewUsername = updatedUserObject => {
		updatedUserObject.userName = newUsername.toLowerCase();
		updatedUserObject.userName = DOMPurify.sanitize(updatedUserObject.userName);
		updatedUserObject.userName.replace(/[^\w]/g,'');
		return updatedUserObject;
	}

	/** 
	 * Updates authenticated user and authenticated username in the database with the new username.
	 * Handles alerting user if their is an error updating the database.
	*/
	const updateUsernameInDatabase = async (sanitizedUpdatedUserObject, sanitizedNewUsername) => {
		//updated auth user object in users/
		axios.put('users/u' + props.authUID + '.json', sanitizedUpdatedUserObject)
		.then(res => {
			props.showHideCustomAlert('username successfully changed!!', true)
			props.setAreSettingsShowing(false);
		})
		.catch(err => props.showHideCustomAlert(`Failed to update username in the database: ${err}`));

		//change username in userIDByUsername
		const userIDByUsername = await axios.get('userIDByUsername.json');
		let updatedUserIDByUsername = {...userIDByUsername.data};
		delete updatedUserIDByUsername[props.authUsername];
		//add the new name with props.authUID as value
		updatedUserIDByUsername[sanitizedNewUsername] = props.authUID;

		axios.put('userIDByUsername.json', updatedUserIDByUsername)
		.then(res => {props.setAreSettingsShowing(false); props.showHideCustomAlert('Changed username successfully!', true)})
		.catch(err => props.showHideCustomAlert(`Failed to update username by userID in the database: ${err}`));
	}

	//calls all the steps in the correct ordered that are needed to update the username.
	const updateUsernameOrchestrator = async(event) => {
		event.preventDefault();
		if(await checkPassword()) {
			let oldUserDataObject = (
				await axios.get('users/u' + props.authUID + '.json')
				.catch(err => props.showHideCustomAlert('Failed to update username'))
			);
			//sanitizes new username	
			let sanitizedUpdatedUserObject = sanitizeNewUsername({ ...oldUserDataObject.data })
			let sanitizedNewUsername = sanitizedUpdatedUserObject.userName;	

			if(validateNewUsername() && await checkIfUsernameIsTaken(sanitizedNewUsername)) {
				updateUsernameInDatabase(sanitizedUpdatedUserObject, sanitizedNewUsername)	
			}
		}	
    }
    
	return(
			<motion.div initial="hidden" animate="visible" variants={{
				hidden: {
					opacity: 0
				},
				visible: {
					opacity: 1,
					scale: 1
				}
			}}>
				<form onSubmit={ updateUsernameOrchestrator } className={ styles.form }>
					<legend>Update Your Username</legend>
					<FormControl fullWidth={true} variant="outlined" margin="normal">
                        <InputLabel htmlFor="newUsername">New Username</InputLabel>
						<OutlinedInput 
									id="newUsername" 
                                    inputProps={{ 'aria-label': 'Enter your new username', 'type': 'text', 'name': 'newUsername', 'required': 'true'}} 
									label="newUsername"
									onChange={ e => setNewUsername(e.target.value) }
                            />    
                    </FormControl> 
					<FormControl fullWidth={true} variant="outlined" margin="normal">
                        <InputLabel htmlFor="confirmUsername">Confirm Username</InputLabel>
						<OutlinedInput 
									id="confirmUsername" 
                                    inputProps={{ 'aria-label': 'Confirm your new username', 'type': 'text', 'name': 'confirmUsername', 'required': 'true'}} 
									label="confirmUsername"
									onChange={ e => setConfirmUsername(e.target.value) }
                            />    
                    </FormControl> 
					<FormControl fullWidth={true} variant="outlined" margin="normal">
                        <InputLabel htmlFor="password">Password</InputLabel>
						<OutlinedInput 
									id="password" 
                                    inputProps={{ 'aria-label': 'Enter the password for your account', 'type': 'password', 'name': 'password', 'required': 'true'}} 
									label="password"
									onChange={ e => setPassword(e.target.value) }
                            />    
                    </FormControl>
					<Button 
						aria-label="Click to proceeding updating your account username." 
						type="submit"
						variant="contained"
						color="primary"
					>
						Submit
					</Button>	
				</form>	
			</motion.div>
	);
}

export default UpdateUsernameForm;																																																																																			