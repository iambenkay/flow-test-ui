import React from 'react'
import {API_HOST} from '../../routes'
import {Redirect} from 'react-router-dom'

export default class Session {
    constructor(){
        this.token = window.localStorage.getItem("FLOW_TEST_TOKEN") || null
        this.authEvent = new Event('AuthStateChanged')
        this.user = JSON.parse(window.localStorage.getItem("FLOW_TEST_USER") || null)
        if(this.token){
            this.getUser()
                .then(data => {
                    this.user = data
                    window.localStorage.setItem("FLOW_TEST_USER", JSON.stringify(data))
                })
                .finally(() => {
                    document.dispatchEvent(this.authEvent)
                })
        } else {
            this.user = null
            window.localStorage.removeItem("FLOW_TEST_USER")
        }

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
            document.dispatchEvent(this.authEvent)
        })
    }
    getUser = () => {
        return fetch(`${API_HOST}/auth/user/`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.token}`
            },
        }).then(response => {
            if(!response.ok) throw new Error("Not Authorized")
            return response.json()})
        .catch((e) => {
            console.error(e.message)
            this.token = null
            window.localStorage.removeItem("FLOW_TEST_TOKEN")
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
            if (!data.error) return data
            else throw new Error(data.error)
        })
    }
    doSignOut = () => {
        this.token = null
        window.localStorage.removeItem("FLOW_TEST_TOKEN")
        this.user = null
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
