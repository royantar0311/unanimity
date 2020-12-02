import React, { useState } from 'react';
import styles from './Input.module.scss';
import DOMPurify from 'dompurify';
let oldTime = null;

const Input = props => {
    let [userMessage, setUserMessage] = useState('');

    /*
        make aria label dynamic
    */
    const handleEmoji = (event, emojiObject) => {
        console.log(emojiObject.originalUnified);
        props.newMessage(`<span role="img" aria-label="sheep">${emojiObject.Unified}</span> `);
    }
    return(
        <div className={ styles.inputContainer }>
           
            <textarea 
                aria-label="Type a messages and press enter to send." 
                spellCheck="true" 
                placeholder="Press Enter to send Message" 
                maxLength="1999"
                className={ styles.input }
                onChange={ e => {
                    setUserMessage(DOMPurify.sanitize(e.target.value));
                }}
                onKeyDown={ e => {
                    if(e.key === 'Enter') {
                        if(props.currentChatRoomName && props.currentChatRoomName !== 'Unanimity') {
                            if( oldTime === null ) {                                      
                                oldTime = Date.now();
                                oldTime -= 50000;                           
                            }                       
                            let currentTime = Date.now();                           
                            if(currentTime >= (oldTime + 2000)) {                               
                                    oldTime = currentTime;                                       
                                    props.newMessage(userMessage);
                                    e.target.value = ''; //makes the input box empty once newMessage gets the input                            
                            } else {
                                props.showAlert(" Please wait two seconds before sending another message! ");
                            }
                        } else {
                            props.showAlert(' Please select a chatroom before sending a message! ');                           
                        }
                    }
                }}             
            >
            </textarea>       
        </div>
    );
}

export default Input;