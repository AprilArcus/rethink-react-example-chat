import React from 'react';
import {AuthWrapper} from './AuthWrapper';
import './style.css';

const mountNode = document.getElementById('app');
React.render(<AuthWrapper />, mountNode);
