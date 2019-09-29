import React from 'react'
import {API_HOST} from '../../routes'

export default class Session {
    constructor(){
        this.token = window.localStorage.getItem("FLOW_TEST_TOKEN")
        this.user = JSON.parse(window.localStorage.getItem("FLOW_TEST_USER"))
        this.authEvent = new Event('AuthStateChanged')
    }
    doSignIn = (email, password) => {
        return fetch(`${API_HOST}/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email, password}),
        })
        .then(response => response.json())
        .then(data => {
            if (!data.message) return data
            else throw new Error(data.message)
        })
        .then(({token, user}) => { 
            this.token = token
            window.localStorage.setItem("FLOW_TEST_TOKEN", token)
            this.user = user
            window.localStorage.setItem("FLOW_TEST_USER", JSON.stringify(user))

            document.dispatchEvent(this.authEvent)
        })
    }
    doSignUp = (email, lastName, firstName, authPassword) => {
        return fetch(`${API_HOST}/users/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email, authPassword, firstName, lastName}),
        })
        .then(response => response.json())
        .then(data => {
            if (!data.message) return data
            else throw new Error(data.message)
        })
    }
    doSignOut = () => {
        this.token = null
        window.localStorage.removeItem("FLOW_TEST_TOKEN")
        this.user = null
        window.localStorage.removeItem("FLOW_TEST_USER")
        document.dispatchEvent(this.authEvent)
    }
    onAuthStateChanged = callback => {
        document.addEventListener('AuthStateChanged', callback)
    }
}

export const SessionContext = React.createContext(null);

export const withSession = Component => props => (
    <SessionContext.Consumer>
        {session => <Component {...props} session={session} />}
    </SessionContext.Consumer>
)
