import React from 'react'
import { withRouter } from 'react-router-dom'
import { withSession } from '../Session'
import { API_HOST } from '../../routes'
import { withAuthorization } from '../Auth';

class Clock extends React.Component {
    constructor(props) {
        super(props)
        this.state = { minutes: 0, seconds: 0 }
    }
    componentDidMount(){
        this.interval = setInterval(x => {
            if(Date.now() >= this.props.elapsed){
                clearInterval(this.interval)
                this.props.onTimeUp()
                return;
            }
            const y = this.props.elapsed - Date.now()
            this.setState({ minutes: parseInt(y / 60000), seconds: parseInt((y % 60000) / 1000) })
        }, 1000)
    }
    componentWillUnmount(){
        clearInterval(this.interval)
    }
    render(){
        const {minutes, seconds} = this.state
        return (
            <h4>{minutes < 10 ? "0" + minutes : minutes}:{seconds < 10 ? "0" + seconds : seconds}</h4>
        )
    }
}

class TestPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            current: 1,
            maxReached: true,
            minReached: true,
            noOfQuestions: null,
            questions: [],
            solutions: {},
        }
    }
    nextQuestion = () => {
        this.setState(state => ({
            current: state.current + 1,
            minReached: (state.current + 1) === 1,
            maxReached: (state.current + 1) === state.noOfQuestions,
        }))
    }
    previousQuestion = () => {
        this.setState(state => ({
            current: state.current - 1,
            minReached: (state.current - 1) === 1,
            maxReached: (state.current - 1) === state.noOfQuestions,
        }))
    }
    addSolution = event => {
        const { testId } = this.props.match.params
        const solutions = Object.assign({}, this.state.solutions)
        solutions[this.state.current] = event.target.id
        this.setState({ solutions, expires: data.expires })
        fetch(`${API_HOST}/${testId}/records/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.props.session.token}`
            },
            body: JSON.stringify({ solutions }),
        }).then(response => response.json())
            .then(data => {
                this.setState({ solutions: data.solutions, expires: data.expires })
            })
            .catch(error => {
                console.error(error)
            })
    }
    onClick = () => {
        const { testId } = this.props.match.params
        fetch(`${API_HOST}/${testId}/records/submit`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.props.session.token}`
            },
        }).then(response => response.json())
            .then(data => {
                console.log("I happened")
                if(data.message) throw new Error(data.message)
                else this.props.history.push(`/test/submitted/successfully/${testId}/`)
            })
            .catch(error => {
                console.error(error)
            })
    }
    componentDidMount() {
        const { testId } = this.props.match.params
        fetch(`${API_HOST}/assessments/${testId}/`)
            .then(response => response.json())
            .then(test => {
                const { questions, noOfQuestions } = test
                this.setState({
                    questions,
                    noOfQuestions,
                })
            })
        fetch(`${API_HOST}/${testId}/records/`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.props.session.token}`
            }
        }).then(response => response.json())
            .then(data => {
                this.setState({ solutions: data.solutions, expires: data.expires })
            })
            .catch(error => {
                console.error(error)
            })
        this.setState(state => ({
            minReached: state.current === 1,
            maxReached: state.current === state.noOfQuestions,
        }))
    }
    render() {
        const { current, noOfQuestions, questions, maxReached, minReached, solutions } = this.state;
        const question = questions.find(x => x.questionNo === current)

        return (
            <div className="container mt-3">
                <Clock elapsed={this.state.expires} onTimeUp={this.onClick} />
                <h1>Question {current}/{noOfQuestions}</h1>
                {
                    question
                        ? <div className="pb-4">
                            <div className="border p-2 mb-4">{question.questionBody}</div>
                            <div className="border p-2 pl-5 mb-2 form-check">
                                <input className="mr-2 form-check-input" onClick={this.addSolution} type="radio" id="A" name="options" value="A" readOnly checked={solutions[current] === 'A'} />
                                <label className="form-check-label" htmlFor="A">
                                    A. {question.options.A}
                                </label>
                            </div>
                            <div className="border p-2 pl-5 mb-2 form-check">
                                <input className="mr-2 form-check-input" onClick={this.addSolution} type="radio" id="B" name="options" value="B" readOnly checked={solutions[current] === 'B'} />
                                <label className="form-check-label" htmlFor="B">
                                    B. {question.options.B}
                                </label>
                            </div>
                            <div className="border p-2 pl-5 mb-2 form-check">
                                <input className="mr-2 form-check-input" onClick={this.addSolution} type="radio" id="C" name="options" value="C" readOnly checked={solutions[current] === 'C'} />
                                <label className="form-check-label" htmlFor="C">
                                    C. {question.options.C}
                                </label>
                            </div>
                            <div className="border p-2 pl-5 mb-2 form-check">
                                <input className="mr-2 form-check-input" onClick={this.addSolution} type="radio" id="D" name="options" value="D" readOnly checked={solutions[current] === 'D'} />
                                <label className="form-check-label" htmlFor="D">
                                    D. {question.options.D}
                                </label>
                            </div>
                        </div>
                        : <div className="p-2 pb-4">There is no question {current}</div>
                }
                <button disabled={minReached} className="btn btn-danger mr-4" onClick={this.previousQuestion}>Previous</button>
                <button disabled={maxReached} className="btn btn-success mr-5" onClick={this.nextQuestion}>Next</button>
                <button className="btn btn-info ml-5" onClick={this.onClick}>Submit</button>
            </div>
        )
    }
}


export default withRouter(withSession(withAuthorization(TestPage)))
