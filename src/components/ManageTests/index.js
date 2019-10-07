import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withSession } from '../Session'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import ROUTES, {API_HOST} from '../../routes'
import { withAuthorization, noUser } from '../Auth';

class ManageTests extends React.Component {
    constructor(props) {
        super(props)
        this.state = { tests: null }
    }
    componentDidMount() {
        fetch(`${API_HOST}/tests/`, {
            headers: {
                "Authorization": `Bearer ${this.props.session.token}`,
            },
        }
        )
            .then(response => response.json())
            .then(tests => {
                if (!tests.message) this.setState({ tests })
                else throw new Error(tests.message)
            })
            .catch(error => {
                console.error(error)
            })
    }
    onClick = id => {
        this.props.history.push(`/creator/${id}/manage/`)
    }
    render() {
        const { tests } = this.state
        return (
            <>
                <div className="container p-5"><Link to={ROUTES.CREATOR} className="btn btn-success p-3 font-weight-bold">Create Test +</Link></div>
                <h1 className="mt-3 ml-3">Tests</h1>
                <div className="container text-center mx-auto">
                    {tests
                        ? (
                            tests.length
                                ? <Tests tests={tests} onClick={this.onClick} />
                                : <h2>No tests were found</h2>
                        )
                        : (<div className="spinner-border mt-5" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>)}
                </div>
            </>
        )
    }
}

class Tests extends React.Component {
    renderTests() {
        return this.props.tests.map(test => (
            <ListGroupItem key={test._id} className="text-left">
                {test.name}
            <button className="btn ml-3 float-right btn-success" onClick={() => { this.props.onClick(test._id)}}>Manage Test</button>
            </ListGroupItem>
        ))
    }

    render() {
        return (
            <ListGroup>
                {this.renderTests()}
            </ListGroup>
        )
    }
}

export default withRouter(withSession(noUser(withAuthorization(ManageTests))));
