import React from 'react';
import { FormLabel, FormGroup, FormControl, Col, FormCheck, Container, Alert } from 'react-bootstrap';
import FormCheckInput from 'react-bootstrap/FormCheckInput';
import FormCheckLabel from 'react-bootstrap/FormCheckLabel';
import { Link, withRouter } from 'react-router-dom';
import ROUTES from '../../routes';
import {withSession} from '../Session';

const INITIAL_SIGNIN_STATE = {
    email: '',
    password: '',
    error: null,
    loading: false,
}


class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_SIGNIN_STATE };
    }
    onSubmit = event => {
        event.preventDefault();
        this.setState({loading: true})
        const { email, password } = this.state;

        this.props.session.doSignIn(email, password)
            .then(() => {
                this.setState({...INITIAL_SIGNIN_STATE})
                this.props.history.push(ROUTES.HOME)
            })
            .catch(error => {
                this.setState({error})
            })
            .finally(() => {
                this.setState({loading: false})
            })
    }
    onChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }
    render() {
        const { email, password, error, loading } = this.state;
        const isInvalid = password === '' || email === '' || loading;
        return (
            <Container className="py-5 row mx-auto">
                <Col xs={12} md={5} className="mx-md-auto">
                    <form onSubmit={this.onSubmit}>
                        <FormGroup>
                            <FormLabel htmlFor="email">Email address</FormLabel>
                            <FormControl id="email" name="email" value={email} onChange={this.onChange} type="email" placeholder="Enter Email" />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <FormControl id="password" name="password" value={password} onChange={this.onChange} type="password" placeholder="Enter password" />
                        </FormGroup>
                        <FormCheck>
                            <FormCheckInput id="checkbox" />
                            <FormCheckLabel htmlFor="checkbox">Remember Me</FormCheckLabel>
                        </FormCheck>
                        <button disabled={isInvalid} className="mt-4 btn btn-success">Submit <div className={`spinner-border spinner-border-sm ${loading ? "": "d-none"}`} role="status">
                            <span className="sr-only">Loading...</span>
                        </div></button>
                        {error && <Alert variant="danger" className="mt-3">{error.message}</Alert>}
                    </form>
                    <br />
                    <span>Don't have an account? <Link to={ROUTES.SIGNUP}>Sign Up</Link></span>
                </Col>
            </Container>
        );
    }
}

export default withRouter(withSession(SignIn));
