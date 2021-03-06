import React from 'react';

import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import classes from './Toolbar.css';

const Toolbar = () => (
    <header className={classes.Toolbar}>
        <Logo/>
        <nav>
            <NavigationItems/>
        </nav>
    </header>
);

export default Toolbar;