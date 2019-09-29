import React from 'react'
import { withSession } from '../Session'
import { Container, Col, Alert, FormGroup, FormLabel, FormControl } from 'react-bootstrap'
import { API_HOST } from '../../routes'
import { withRouter } from 'react-router-dom'
import { withAuthorization } from '../Auth';

const INITIAL_QUESTION_CREATION_STATE = {
    questionNo: "",
    questionBody: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    answer: "",
    error: null,
    success: null,
}

class CreatorWorks extends React.Component {
    constructor(props) {
        super(props)
        this.state = { ...INITIAL_QUESTION_CREATION_STATE }
    }
    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }
    onSubmit = event => {
        const { questionNo, questionBody, optionA, optionB, optionC, optionD, answer } = this.state
        fetch(`${API_HOST}/questions/${this.props.match.params.testId}/`, {
            method: "POST",
            body: JSON.stringify({
                questionNo: +questionNo,
                questionBody,
                options: { A: optionA, B: optionB, C: optionC, D: optionD },
                answer,
            }),
            headers: {
                "Authorization": `Bearer ${this.props.session.token}`,
                "Content-Type": "application/json"
            },
        }).then(response => response.json())
            .then(data => {
                if (data.message) throw new Error(data.message)
                else {
                    this.setState({ success: data.success, error: null })
                }
            })
            .catch(error => {
                this.setState({ error, success: null })
            })
        event.preventDefault()
    }
    render() {
        const { questionNo, answer, questionBody, optionA, optionB, optionC, optionD, error, success } = this.state
        const isInvalid = !questionNo || !answer || !questionBody || !optionA || !optionB || !optionC || !optionD
        return (
            <Container className="py-5 row mx-auto">
                <Col xs={12} md={5} className="mx-md-auto">
                    <form onSubmit={this.onSubmit}>
                        <FormGroup>
                            <FormLabel htmlFor="questionNo">Question number</FormLabel>
                            <FormControl id="questionNo" type="number" name="questionNo" value={questionNo} onChange={this.onChange} placeholder="Enter name of test" />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor="questionBody">Question</FormLabel>
                            <FormControl id="questionBody" type="text" name="questionBody" value={questionBody} onChange={this.onChange} placeholder="Enter name of test" />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor="optionA">Option A</FormLabel>
                            <FormControl id="optionA" type="text" name="optionA" value={optionA} onChange={this.onChange} placeholder="Enter option A" />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor="optionB">Option B</FormLabel>
                            <FormControl id="optionB" type="text" name="optionB" value={optionB} onChange={this.onChange} placeholder="Enter option B" />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor="optionC">Option C</FormLabel>
                            <FormControl id="optionC" type="text" name="optionC" value={optionC} onChange={this.onChange} placeholder="Enter option C" />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor="optionD">Option D</FormLabel>
                            <FormControl id="optionD" type="text" name="optionD" value={optionD} onChange={this.onChange} placeholder="Enter option D" />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor="answer">Answer</FormLabel>
                            <select className="ml-2" name="answer" defaultValue={answer} onChange={this.onChange}>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                            </select>
                        </FormGroup>

                        <button disabled={isInvalid} className="btn btn-success mt-4">Create Question</button>
                        {error && <Alert variant="danger" className="mt-3">{error.message}</Alert>}
                        {success && <Alert variant="success" className="mt-3">{success}</Alert>}
                    </form>
                </Col>
            </Container>
        )
    }
}

export default withRouter(withSession(withAuthorization(CreatorWorks)))
