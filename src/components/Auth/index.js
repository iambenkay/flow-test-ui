import React from 'react'
import SignIn from './SignIn'
import SignUp from './SignUp'
import {Redirect} from 'react-router-dom'
import {SessionContext} from '../Session'

export {SignIn, SignUp}

export const withAuthorization = Component => props => (
    <SessionContext.Consumer>
        {session => {
            return (session.token)
                ? <Component {...props} session={session} />
                : <Redirect to="/signin" />
        }}
    </SessionContext.Consumer>
)
