import { default as React, Component } from 'react';
import { r, DefaultSession as RethinkSession } from 'react-rethinkdb';

export class SendMessageForm extends Component {
  constructor(props) {
    super(props);
    this.handleSendMessage = this.handleSendMessage.bind(this);
  }

  handleSendMessage(event) {
    event.preventDefault();
    const bodyInput = this.refs.body;
    const body = bodyInput.value;
    bodyInput.value = '';
    const query = r.table('messages').insert({
      body,
      userId: this.props.curUserId,
      createdAt: r.now(),
    });
    RethinkSession.runQuery(query);
  }

  render() {
    return (
      <form onSubmit={this.handleSendMessage} className="chatboxForm">
        <input
          type="text"
          ref="body"
          placeholder="Type a message"
          autoFocus={true}
        />
        <button type="submit">
          Send
        </button>
      </form>
    );
  }
}
