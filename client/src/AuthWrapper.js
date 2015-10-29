import { default as React, Component } from 'react';
import request from 'superagent';
import { DefaultSession as RethinkSession } from 'react-rethinkdb';
import { ChatBox } from './ChatBox';
import { webPort } from '../../server/config';

const apiServer = {
  protocol: 'http:',
  hostname: 'localhost',
  path: '/db',
  port: webPort
}

export class AuthWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: window.localStorage.getItem('userId'),
      error: false,
    };
    this.handleButton = this.handleButton.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.renderLoggedIn = this.renderLoggedIn.bind(this);
    this.renderLoggedOut = this.renderLoggedOut.bind(this);
  }

  componentWillMount() {
    if (this.state.userId) {
      this.connect();
    }
  }

  connect() {
    const userId = window.localStorage.getItem('userId');
    const authToken = window.localStorage.getItem('authToken');
    const path = apiServer.path
               + '?userId=' + encodeURIComponent(userId)
               + '&authToken=' + encodeURIComponent(authToken);
    const secure = apiServer.protocol === 'https:';
    RethinkSession.connect({
      host: apiServer.hostname,
      port: apiServer.port,
      path: path,
      secure: secure,
      db: 'react_example_chat',
    });
  }

  handleButton(action, event) {
    event.preventDefault();
    const { protocol, hostname, port } = apiServer;
    const path = {'login': '/login', 'signup': '/signup'}[action];
    const uri = `${protocol}//${hostname}:${port}${path}`;
    const userId = this.refs.userId.value;
    const password = this.refs.password.value;
    this.setState({error: false});
    request
    .post(uri)
    .query({userId, password})
    .set('Accept', 'application/json')
    .end((err, res) => {
      if (err) {
        this.setState({error: true});
      } else {
        const {authToken} = res.body;
        window.localStorage.setItem('userId', userId);
        window.localStorage.setItem('authToken', authToken);
        this.connect();
        this.setState({userId});
      }
    });
  }

  handleLogout() {
    RethinkSession.close();
    this.setState({userId: null});
    window.localStorage.removeItem('userId');
    window.localStorage.removeItem('authToken');
  }

  renderLoggedIn() {
    return (
      <div className="contentOuter">
        <div className="logoutBar">
          <button type="button" onClick={this.handleLogout}>
            Logout
          </button>
        </div>
        <div className="contentInner">
          <ChatBox curUserId={this.state.userId} />
        </div>
      </div>
    );
  }

  renderLoggedOut() {
    return (
      <div className="loggedOut">
        {this.state.error && <div>Authentication error</div>}
        <input type="text" placeholder="Username" ref="userId" autoFocus={true} />
        <input type="text" placeholder="Password" ref="password" />
        <button type="button" onClick={this.handleButton.bind(this, 'login')}>
          Login
        </button>
        <button type="button" onClick={this.handleButton.bind(this, 'signup')}>
          Signup
        </button>
      </div>
    );
  }

  render() {
    if (this.state.userId) {
      return this.renderLoggedIn();
    } else {
      return this.renderLoggedOut();
    }
  }
}
