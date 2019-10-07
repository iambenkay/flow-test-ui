import React from 'react'
import { withRouter } from 'react-router-dom'
import { withSession } from '../Session'
import { API_HOST } from '../../routes'
import { withAuthorization, noAdmin } from '../Auth';


class SubmitSuccess extends React.Component {
    constructor(props){
        super(props)
        this.state = {record: null, info: null}
    }
    componentDidMount() {
        fetch(`${API_HOST}/records/`, {
            headers: {
                "Authorization": `Bearer ${this.props.session.token}`,
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.info) this.setState({info: data.info})
                else this.setState({ record: data })
            })
            .catch(error => {
                console.error(error.message)
            })
    }
    render() {
        const {record, info} = this.state
        return (
            <>
                {
                    record
                        ? <h5 className="p-4">Your last test score was {record.score} %</h5>
                        : <h5 className="p-4">{info}</h5>
                }<hr />

            </>
        )
    }
}
export default withRouter(withSession(noAdmin(withAuthorization(SubmitSuccess))))
