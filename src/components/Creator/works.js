import React from 'react'
import { withSession } from '../Session'
import { Container, Col, Alert, FormGroup, FormLabel, FormControl } from 'react-bootstrap'
import { API_HOST } from '../../routes'
import { withRouter } from 'react-router-dom'
import { withAuthorization, noUser } from '../Auth';

class CreatorWorks extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            test: null,
            current: 1,
        }
        this.QUpdateEvent = new Event("Question index updated")
    }
    componentDidMount(){
        this.setup()
        document.addEventListener("Submitted", this.setup)
    }
    setup = () => {
        fetch(`${API_HOST}/tests/${this.props.match.params.testId}`, {
            headers: {
                "Authorization": `Bearer ${this.props.session.token}`,
                "Content-Type": "application/json"
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) throw new Error(data.error)
            this.setState({test: data})
        })
        .catch(error => {
            console.error(error)
        })
    }
    componentDidUpdate(){
        document.dispatchEvent(this.QUpdateEvent)
    }
    componentWillUnmount(){
        document.removeEventListener("Submitted", this.setup)
    }
    renderQuestionIndices(){
        const {test} = this.state
        return test && Array.from({length: test.noOfQuestions}, (x, i) => i + 1).map((x, i) => (
            <button
                key={i}
                className={`m-2 btn btn-${test.questions.find(a => +a.questionNo === x) ? "success": "light"}`}
                onClick={() => this.setState({current: x})}>{x}</button>))
    }
    onPublish = () => {
        fetch(`${API_HOST}/tests/${this.props.match.params.testId}/publish/`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${this.props.session.token}`,
                "Content-Type": "application/json"
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) throw new Error(data.error)
            this.setup()
        })
        .catch(error => {
            console.error(error.message)
        })
    }
    onUnPublish = () => {
        fetch(`${API_HOST}/tests/${this.props.match.params.testId}/unpublish/`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${this.props.session.token}`,
                "Content-Type": "application/json"
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) throw new Error(data.error)
            this.setup()
        })
        .catch(error => {
            console.error(error.message)
        })
    }
    render(){
        const {test, current} = this.state
        const canPublish = test ? test.questions.length !== +test.noOfQuestions : false
        return (
            <>
                <div className="my-4">
                    <div className="text-right">
                        {
                            test ? !test.published
                                ? <button className="mt-2 mx-3 mb-3 py-3 px-4 btn btn-success" disabled={canPublish} onClick={this.onPublish}>Publish Test</button>
                                : <button className="mt-2 mx-3 mb-3 py-3 px-4 btn btn-danger" onClick={this.onUnPublish}>Unpublish Test</button>
                            : null
                        }
                    </div>
                    <br/>
                    {this.renderQuestionIndices()}
                </div>
                <EditQuestionsPage token={this.props.session.token} testId={this.props.match.params.testId} current={current} question={(test ? test.questions.find(a => +a.questionNo === current) : null)} />
            </>
        )
    }
}

class EditQuestionsPage extends React.Component {
    constructor(props) {
        super(props)
        const {question, current} = props
        this.state = {
            questionNo: question ? question.questionNo : current,
            questionBody: question ? question.questionBody : "",
            optionA: question ? question.options.A : "",
            optionB: question ? question.options.B : "",
            optionC: question ? question.options.C : "",
            optionD: question ? question.options.D : "",
            answer: question ? question.answer : "",
            error: null,
            success: null,
        }
        this.SubmitEvent = new Event("Submitted")
    }
    onUpdate = () => {
        const {question, current} = this.props
        this.setState({
            questionNo: question ? question.questionNo : current,
            questionBody: question ? question.questionBody : "",
            optionA: question ? question.options.A : "",
            optionB: question ? question.options.B : "",
            optionC: question ? question.options.C : "",
            optionD: question ? question.options.D : "",
            answer: question ? question.answer : "",
            error: null,
            success: null,
        })
    }
    componentDidMount(){
        document.addEventListener("Question index updated", this.onUpdate)
    }
    componentWillUnmount(){
        document.removeEventListener("Question index updated", this.onUpdate)
    }
    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }
    onCreateQuestion = event => {
        const { questionNo, questionBody, optionA, optionB, optionC, optionD, answer } = this.state
        fetch(`${API_HOST}/questions/`, {
            method: "POST",
            body: JSON.stringify({
                testId: this.props.testId,
                questionNo: +questionNo,
                questionBody,
                options: { A: optionA, B: optionB, C: optionC, D: optionD },
                answer,
            }),
            headers: {
                "Authorization": `Bearer ${this.props.token}`,
                "Content-Type": "application/json"
            },
        }).then(response => response.json())
            .then(data => {
                if (data.error) throw new Error(data.error)
                else {
                    this.setState({ success: data.success, error: null })
                    document.dispatchEvent(this.SubmitEvent)
                }
            })
            .catch(error => {
                this.setState({ error, success: null })
            })
    }
    onUpdateQuestion = event => {
        const { questionNo, questionBody, optionA, optionB, optionC, optionD, answer } = this.state
        fetch(`${API_HOST}/questions/`, {
            method: "PUT",
            body: JSON.stringify({
                testId: this.props.testId,
                questionNo: +questionNo,
                questionBody,
                options: { A: optionA, B: optionB, C: optionC, D: optionD },
                answer,
            }),
            headers: {
                "Authorization": `Bearer ${this.props.token}`,
                "Content-Type": "application/json"
            },
        }).then(response => response.json())
            .then(data => {
                if (data.error) throw new Error(data.error)
                else {
                    this.setState({ success: data.success, error: null })
                    document.dispatchEvent(this.SubmitEvent)
                }
            })
            .catch(error => {
                this.setState({ error, success: null })
            })
    }
    render() {
        const { questionNo, answer, questionBody, optionA, optionB, optionC, optionD, error, success } = this.state
        const isInvalid = !questionNo || !answer || !questionBody || !optionA || !optionB || !optionC || !optionD
        return (
            <Container className="py-5 row mx-auto">
                <Col xs={12} md={5} className="mx-md-auto">
                    <form onSubmit={(event) => event.preventDefault()}>
                        <FormGroup>
                            <FormLabel htmlFor="questionNo">Question number</FormLabel>
                            <FormControl id="questionNo" type="number" name="questionNo" value={questionNo} onChange={this.onChange} placeholder="Enter question number" />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor="questionBody">Question</FormLabel>
                            <FormControl id="questionBody" as="textarea" name="questionBody" value={questionBody} onChange={this.onChange} placeholder="Enter question body" />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor="optionA">Option A</FormLabel>
                            <FormControl id="optionA" as="textarea" name="optionA" value={optionA} onChange={this.onChange} placeholder="Enter option A" />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor="optionB">Option B</FormLabel>
                            <FormControl id="optionB" as="textarea" name="optionB" value={optionB} onChange={this.onChange} placeholder="Enter option B" />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor="optionC">Option C</FormLabel>
                            <FormControl id="optionC" as="textarea" name="optionC" value={optionC} onChange={this.onChange} placeholder="Enter option C" />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor="optionD">Option D</FormLabel>
                            <FormControl id="optionD" as="textarea" name="optionD" value={optionD} onChange={this.onChange} placeholder="Enter option D" />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor="answer">Answer</FormLabel>
                            <FormControl className="ml-2 w-50" as="select" name="answer" value={answer} onChange={this.onChange}>
                                <option value="default">Select Answer</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                            </FormControl>
                        </FormGroup>
                        {
                            this.props.question
                                ? <button disabled={isInvalid} className="btn btn-success mt-4" onClick={this.onUpdateQuestion}>Update Question</button>
                                : <button disabled={isInvalid} className="btn btn-success mt-4" onClick={this.onCreateQuestion}>Create Question</button>
                        }
                        {error && <Alert variant="danger" className="mt-3">{error.message}</Alert>}
                        {success && <Alert variant="success" className="mt-3">{success}</Alert>}
                    </form>
                </Col>
            </Container>
        )
    }
}

export default withRouter(withSession(noUser(withAuthorization(CreatorWorks))))
