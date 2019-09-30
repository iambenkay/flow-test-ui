import React from 'react'
import { withRouter } from 'react-router-dom'
import { withSession } from '../Session'
import { API_HOST } from '../../routes'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import { isArray } from 'util';
import { withAuthorization } from '../Auth';


class SubmitSuccess extends React.Component {
    constructor(props){
        super(props)
        this.state = {records: null}
    }
    componentDidMount() {
        fetch(`${API_HOST}/${this.props.match.params.testId}/records/submitted/`, {
            headers: {
                "Authorization": `Bearer ${this.props.session.token}`,
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) throw new Error(data.message)
                else this.setState({ records: data })
            })
            .catch(error => {
                console.error(error)
            })
    }
    renderRecords = () => {
        if(isArray(this.state.records))
            return this.state.records.map((x, i) => <ListGroupItem key={i}>Score: {x.score} % || Passed: {x.passed ? "Yes" : "No"} === Submitted: {new Date(x.updatedAt).toLocaleString()}</ListGroupItem>)
        return null
    }
    render() {
        const {records} = this.state
        return (
            <>
                <h5 className="p-4">The test {this.props.match.params.testId} has been submitted.</h5>
                <hr />
                <h4>Test History</h4>
                <ListGroup>
                    {
                        records
                            ? this.renderRecords()
                            : null
                    }
                </ListGroup>
            </>
        )
    }
}
export default withRouter(withSession(withAuthorization(SubmitSuccess)))
