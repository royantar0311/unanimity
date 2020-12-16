import React, { useState } from 'react';
import styles from './Input.module.scss';
import DOMPurify from 'dompurify';
let lastMessageSentTime = null;

/*
Child component of MainContent. Is a textarea where users enter their message to send.
Throttles message send rate to prevent spam.
*/
const Input = props => {
    let [userMessage, setUserMessage] = useState('');

    return(
        <div className={ styles.inputContainer }> 
            <textarea 
                aria-label="Type a messages and press enter to send. You can also send emoji." 
                spellCheck="true" 
                maxLength="1999"
                placeholder="Enter your message. Use our emojis by :smile:"
                className={ styles.input }
                onChange={ e => {
                    setUserMessage(DOMPurify.sanitize(e.target.value));
                }}
                onKeyDown={ e => {
                    if(e.key === 'Enter') {
                        if(props.currentChatRoomName && props.currentChatRoomName !== 'Unanimity') {
                            //if user has not sent a message yet, don't throttle message send rate.
                            if( lastMessageSentTime === null ) {                                      
                                lastMessageSentTime = Date.now();
                                lastMessageSentTime -= 50000;                           
                            }                       
                            let currentTime = Date.now();                           
                            if(currentTime >= (lastMessageSentTime + 2000)) {                               
                                    lastMessageSentTime = currentTime;                                       
                                    props.newMessage(userMessage);
                                    //makes the input box empty once newMessage gets the input   
                                    e.target.value = '';                          
                            } else {
                                props.showHideCustomAlert(" Please wait two seconds before sending another message! ");
                            }
                        } else {
                            props.showHideCustomAlert(' Please select a chatroom before sending a message! ');                           
                        }
                    }
                }}             
            >
            </textarea>       
        </div>
    );
}

export default Input;