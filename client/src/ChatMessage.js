import React from 'react';
import moment from 'moment';

export function ChatMessage({curUserId, userId, body, createdAt}) {

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

}
