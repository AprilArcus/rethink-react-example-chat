import { default as React, Component } from 'react';

// http://blog.vjeux.com/2013/javascript/scroll-position-with-react.html
export class AutoScrollDown extends Component {
  componentWillUpdate() {
    const node = this.refs.node;
    const d = node.scrollHeight - node.scrollTop - node.offsetHeight;
    this.shouldScrollBottom = d <= 20;
  }

  componentDidUpdate() {
    if (this.shouldScrollBottom) {
      const node = this.refs.node;
      node.scrollTop = node.scrollHeight;
    }
  }

  render() {
    return (
      <div className="autoScrollDown" ref="node">
        {this.props.children}
      </div>
    );
  }
}
