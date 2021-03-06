import React from 'react';
import './NavigationRouterLinks.module.scss';
import { Link } from 'react-router-dom';
import styles from './NavigationRouterLinks.module.scss';
import { List, ListItem } from '@material-ui/core';
/*
user interface component that navigates with react router links. 
Displayed on the Home, Contact, Login, and FQA page. Is not shown once logged in.
*/
const NavigationRouterLinks = props => {
    return(
        <nav>
            <List>
                <ListItem>
                    <Link aria-label="go to the home page" className={styles.linkColor} exact="true" to="/" >Home</Link>
                </ListItem>
                <ListItem>
                    <Link aria-label="go to the contact page" className={styles.linkColor} to="/contact" >Contact</Link>
                </ListItem>
                <ListItem>
                    <Link aria-label="go to the login page" className={styles.linkColor} to="/login" >Login</Link>
                </ListItem>
                <ListItem>
                    <Link aria-label="go to the frequently asked page" className={styles.linkColor} to="/FAQ" >FAQ</Link>
                </ListItem>
            </List>
        </nav>
    );
};

export default NavigationRouterLinks;