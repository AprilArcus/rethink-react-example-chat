{ createElement } = require 'react'
{ render } = require 'react-dom'
{ AuthWrapper } = require './AuthWrapper'
require './style.css'

mountNode = document.getElementById 'app'
authWrapper = createElement AuthWrapper
render authWrapper, mountNode
