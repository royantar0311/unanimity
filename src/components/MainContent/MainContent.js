import React, {useState, Fragment } from 'react';
import ChatroomHeader from './ChatroomHeader/ChatroomHeader';
import ChatRoom from './Chatroom/Chatroom';
import AccountSettings from './AccountSettings/AccountSettings';
import Input from './Input/Input';

/*
Parent component for Header, ChatRoom, Input, and AccountSettings.
*/
const MainContent = props => {
    const [areSettingsShowing, setAreSettingsShowing,] = useState(false);
    //default to the chatroom
    let body = <ChatRoom 
                    currentChatRoom={ props.currentChatRoom } 
                    recipientName={ props.currentChatRoomName } 
                    authUsername={ props.authUsername} 
                    authUID={ props.authUID }
                />;
    let input = <Input newMessage={ props.newMessage } currentChatRoomName={ props.currentChatRoomName } showHideCustomAlert={ props.showHideCustomAlert }/>;

    //sets body to account settings if user has opened the settings and sets input to null.
    const showSettingsMenu = () => {
        if(areSettingsShowing) {
            body = <AccountSettings 
                        authUID={ props.authUID } 
                        setAreSettingsShowing={setAreSettingsShowing} 
                        authUsername={props.authUsername}
                        showHideCustomAlert={ props.showHideCustomAlert }                     
                    />;
            input = null;
        }
    }

    showSettingsMenu();
    return(
       <Fragment>
            <ChatroomHeader 
                currentChatRoomName={ props.currentChatRoomName }
                toggleSidebar={ props.toggleSidebar }
                isSidebarOpen={ props.isSidebarOpen }
                logout={ props.setAuth }
                authUID={ props.authUID }
                authUsername={ props.authUsername }
                setAreSettingsShowing={setAreSettingsShowing}
                areSettingsShowing={areSettingsShowing}
            />
            {body}
            {input}
       </Fragment>
    );
};

export default MainContent;