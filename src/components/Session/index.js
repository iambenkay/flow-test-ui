import React from 'react'
import {API_HOST} from '../../routes'

export default class Session {
    constructor(){
        this.token = window.localStorage.getItem("FLOW_TEST_TOKEN")
        this.user = JSON.parse(window.localStorage.getItem("FLOW_TEST_USER") || null)
        this.roles = JSON.parse(window.localStorage.getItem("FLOW_TEST_ROLES") || null)
        this.authEvent = new Event('AuthStateChanged')

    }
    doSignIn = (email, password) => {
        return fetch(`${API_HOST}/auth/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email, password}),
        })
        .then(response => response.json())
        .then(data => {
            if (!data.error) return data
            else throw new Error(data.error)
        })
        .then(async ({token, user}) => {
            this.token = token
            window.localStorage.setItem("FLOW_TEST_TOKEN", token)
            this.user = user
            window.localStorage.setItem("FLOW_TEST_USER", JSON.stringify(user))
            const roles = await this.getRoles()
            this.roles = roles
            window.localStorage.setItem("FLOW_TEST_ROLES", JSON.stringify(roles))
            document.dispatchEvent(this.authEvent)
        })
    }
    getRoles = () => {
        return fetch(`${API_HOST}/auth/roles/`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.token}`
            },
        }).then(response => {
            if(!response.ok) throw new Error("Not Authorized")
            return response.json()})
        .catch((e) => {
            console.error(e.message)
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
            if (!data.error) return data
            else throw new Error(data.error)
        })
    }
    doSignOut = () => {
        this.token = null
        window.localStorage.removeItem("FLOW_TEST_TOKEN")
        this.user = null
        window.localStorage.removeItem("FLOW_TEST_USER")
        this.roles = null
        window.localStorage.removeItem("FLOW_TEST_ROLES")
        document.dispatchEvent(this.authEvent)
    }
    onAuthStateChanged = callback => {
        document.addEventListener('AuthStateChanged', callback)
        return () => { document.removeEventListener('AuthStateChanged', callback) }
    }
}

export const SessionContext = React.createContext(null);

export const withSession = Component => props => (
    <SessionContext.Consumer>
        {session => <Component {...props} session={session} />}
    </SessionContext.Consumer>
)
