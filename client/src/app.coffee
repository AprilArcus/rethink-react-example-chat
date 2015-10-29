{ createElement, render } = require 'react'
{ AuthWrapper } = require './AuthWrapper'
require './style.css'

mountNode = document.getElementById 'app'
authWrapper = createElement AuthWrapper
render authWrapper, mountNode
