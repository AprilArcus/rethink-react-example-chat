{ Component, DOM: {div} } = require 'react';

# http://blog.vjeux.com/2013/javascript/scroll-position-with-react.html
module.exports = AutoScrollDown: class AutoScrollDown extends Component
  componentWillUpdate: ->
    node = @refs.node;
    d = node.scrollHeight - node.scrollTop - node.offsetHeight;
    @shouldScrollBottom = d <= 20;

  componentDidUpdate: ->
    if @shouldScrollBottom
      node = @refs.node;
      node.scrollTop = node.scrollHeight;

  render: ->
    div
      className: 'autoScrollDown'
      ref: 'node'
      @props.children
