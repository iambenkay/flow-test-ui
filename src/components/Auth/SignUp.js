import React from 'react';
import { FormLabel, FormGroup, FormControl, Col, Container, FormText, Alert } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import {withSession} from '../Session'
import ROUTES from '../../routes';

const INITIAL_SIGNUP_STATE = {
    firstname: '',
    lastname: '',
    passwordOne: '',
    passwordTwo: '',
    email: '',
    error: null,
    loading: false,
}

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_SIGNUP_STATE };
    }
    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }
    onSubmit = event => {
        this.setState({loading: true})
        const { firstname, lastname, email, passwordOne } = this.state;
        this.props.session.doSignUp(email, lastname, firstname, passwordOne)
            .then(() => {
                this.setState({ ...INITIAL_SIGNUP_STATE });
                this.props.history.push(ROUTES.SIGNIN);
            })
            .catch(error => { this.setState({ error }) })
            .finally(() => {
                this.setState({loading: false})
             })

        event.preventDefault();
    }

    render() {
        const {
            firstname,
            lastname,
            passwordOne,
            passwordTwo,
            email,
            error,
            loading
        } = this.state;
        const isInvalid = passwordOne !== passwordTwo || passwordOne === '' || firstname === '' || email === '' || lastname === '' || loading;
        return (
            <Container className="py-5 row mx-auto">
                <Col xs={12} md={5} className="mx-md-auto">
                    <form method="post" onSubmit={this.onSubmit}>
                        <FormGroup>
                            <FormLabel htmlFor="firstname">First name</FormLabel>
                            <FormControl id="fullname" type="text" name="firstname" value={firstname} onChange={this.onChange} placeholder="Enter first name" />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor="lastname">Last name</FormLabel>
                            <FormControl id="username" type="text" name="lastname" value={lastname} onChange={this.onChange} placeholder="Enter last name" />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor="email" >Email address</FormLabel>
                            <FormControl id="email" type="email" name="email" value={email} onChange={this.onChange} placeholder="Enter email address" />
                            <FormText className="text-muted">We'll never share your email with anyone else</FormText>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor="password" >Password</FormLabel>
                            <FormControl id="password" type="password" name="passwordOne" value={passwordOne} onChange={this.onChange} placeholder="Enter password" />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor="confirm_password">Confirm password</FormLabel>
                            <FormControl id="confirm_password" type="password" name="passwordTwo" value={passwordTwo} onChange={this.onChange} placeholder="Confirm password" />
                        </FormGroup>
                        <button disabled={isInvalid} className="btn btn-success mt-4">Submit</button>
                        {error && <Alert variant="danger" className="mt-3">{error.message}</Alert>}
                    </form>
                    <br />
                    <span>Already have an account? <Link to={ROUTES.SIGNIN}>Sign In</Link></span>
                </Col>
            </Container>
        );
    }
}

export default withRouter(withSession(SignUp))
