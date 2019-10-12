import React from 'react'
import './App.css'
import { Nav, Navbar } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import ROUTES from './routes'
import Home from './components/Home'
import { SignIn, SignUp } from './components/Auth'
import TestPage from './components/TestPage'
import { withSession } from './components/Session'
import ManageTests from './components/ManageTests'
import Creator, { CreatorWorks } from './components/Creator'
import SubmitSuccess from './components/SubmitSuccess'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: props.session.user,
    }
  }
  componentDidMount() {
    this.listener = this.props.session.onAuthStateChanged(() => {
      this.setState({
        user: this.props.session.user
            ? Object.assign({}, this.props.session.user)
            : null,
        })
        this.setState({
          user: this.props.session.user
              ? Object.assign({}, this.props.session.user)
              : null,
          })
    })

  }
  componentWillUnmount() {
    this.listener()
    
  }
  render() {
    const { user } = this.state
    return (
      <Router>
        {
            user
            ? <Navbar variant="dark" expand="md" bg="success">
              <Navbar.Brand href="/" className="font-weight-bold">Flow for Tests</Navbar.Brand>
              <Navbar.Toggle aria-controls="navigation-bar" />
              <Navbar.Collapse id="navigation-bar">
                <Nav className="mr-auto">
                  {
                      user.isSuperUser
                          ? <NavLink to={ROUTES.MANAGETESTS} className="nav-link font-weight-bold">Manage tests</NavLink>
                          : <>
                              <NavLink to={ROUTES.HOME} className="nav-link font-weight-bold">Home</NavLink>
                              <NavLink to={ROUTES.TESTSUBMITTED} className="nav-link font-weight-bold">Records</NavLink>
                            </>
                  }
                </Nav>
              <span className="nav-link text-white font-weight-bold"><span className="text-dark">{user.email}</span> {user.firstName} {user.lastName}</span>
              <button className="btn btn-success font-weight-bold" onClick={this.props.session.doSignOut}>Sign Out</button>
              </Navbar.Collapse>
            </Navbar>
            : <Navbar variant="light" expand="md" bg="light">
              <Navbar.Toggle aria-controls="navigation-bar" />
              <Navbar.Collapse id="navigation-bar" className="text-right">
                  <NavLink to={ROUTES.SIGNIN} className="nav-link text-success font-weight-bold">Sign In</NavLink>
                  <NavLink to={ROUTES.SIGNUP} className="nav-link text-success font-weight-bold">Sign Up</NavLink>
              </Navbar.Collapse>
            </Navbar>
        }
        <Route path={ROUTES.HOME} exact component={Home} />
        <Route path={ROUTES.SIGNIN} exact component={SignIn} />
        <Route path={ROUTES.SIGNUP} exact component={SignUp} />
        <Route path={ROUTES.TESTPAGE} exact component={TestPage} />
        <Route path={ROUTES.CREATOR} exact component={Creator} />
        <Route path={ROUTES.CREATORWORKS} exact component={CreatorWorks} />
        <Route path={ROUTES.MANAGETESTS} exact component={ManageTests} />
        <Route path={ROUTES.TESTSUBMITTED} exact component={SubmitSuccess} />
      </Router>
    )
  }
}

export default withSession(App)
