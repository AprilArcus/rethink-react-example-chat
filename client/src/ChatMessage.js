import React from 'react';
import pureRenderMixin from 'react-addons-pure-render-mixin';
import moment from 'moment';

export const ChatMessage = React.createClass({
  mixins: [pureRenderMixin],

  render() {
    const {curUserId, userId, body, createdAt} = this.props;
    return (
      <div className={'message ' + (userId === curUserId ? 'to' : 'from')}>
        <div className="messageSender">
          {userId}
        </div>
        <div className="messageBody">
          {body}
          <div className="timestamp">
            {moment(createdAt).calendar()}
          </div>
        </div>
      </div>
    );
  },
});
