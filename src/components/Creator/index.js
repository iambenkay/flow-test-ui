import React from 'react'
import { withSession } from '../Session'
import CreatorWorks from './works'
import { Container, Col, Alert, FormText, FormGroup, FormLabel, FormControl, } from 'react-bootstrap'
import { API_HOST } from '../../routes'
import { withRouter } from 'react-router-dom'
import { withAuthorization } from '../Auth';

const INITIAL_TEST_CREATION_STATE = {
    current: 1,
    testname: "",
    testid: "",
    noOfQuestions: "",
    passpercent: "",
    duration: "",
    error: null
}

class Creator extends React.Component {
    constructor(props) {
        super(props)
        this.state = { ...INITIAL_TEST_CREATION_STATE }
    }
    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }
    onSubmit = event => {
        const { testname, testid, noOfQuestions, passpercent, duration } = this.state
        fetch(`${API_HOST}/tests/`, {
            method: "POST",
            body: JSON.stringify({
                name: testname,
                code: testid,
                duration,
                noOfQuestions,
                passPercent: passpercent
            }),
            headers: {
                "Authorization": `Bearer ${this.props.session.token}`,
                "Content-Type": "application/json"
            },
        }).then(response => response.json())
            .then(data => {
                if (data.error) throw new Error(data.error)
                else {
                    this.props.history.push(`/creator/${data._id}/manage`)
                }
            })
            .catch(error => {
                this.setState({ error })
            })
        event.preventDefault()
    }
    render() {
        const { testname, testid, noOfQuestions, passpercent, duration, error } = this.state
        const isInvalid = !testname || !testid || !noOfQuestions || !passpercent || !duration
        return (
            <Container className="py-5 row mx-auto">
                <Col xs={12} md={5} className="mx-md-auto">
                    <form onSubmit={this.onSubmit}>
                        <FormGroup>
                            <FormLabel htmlFor="test_name">Name of your test</FormLabel>
                            <FormControl id="test_name" type="text" name="testname" value={testname} onChange={this.onChange} placeholder="Enter name of test" />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor="test_id">Unique ID for test</FormLabel>
                            <FormControl id="test_id" type="text" name="testid" value={testid} onChange={this.onChange} placeholder="Enter unique ID for test" />
                            <FormText className="text-muted">The above fields must be unique. Test will not be created if there are tests already having these details</FormText>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor="no_of_questions" >No. of questions</FormLabel>
                            <FormControl id="no_of_questions" type="number" name="noOfQuestions" value={noOfQuestions} onChange={this.onChange} placeholder="Enter number of questions test should have" />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor="duration" >Duration (in minutes)</FormLabel>
                            <FormControl id="duration" type="number" name="duration" value={duration} onChange={this.onChange} placeholder="Enter duration of the test" />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor="passPercent" >Percentage for Pass (%)</FormLabel>
                            <FormControl id="passPercent" type="number" name="passpercent" value={passpercent} onChange={this.onChange} placeholder="Enter minimum percentage pass mark" />
                        </FormGroup>
                        <button disabled={isInvalid} className="btn btn-success mt-4">Submit</button>
                        {error && <Alert variant="danger" className="mt-3">{error.message}</Alert>}
                    </form>
                </Col>
            </Container>
        )
    }
}

export default withRouter(withSession(withAuthorization(Creator)))
export { CreatorWorks }
