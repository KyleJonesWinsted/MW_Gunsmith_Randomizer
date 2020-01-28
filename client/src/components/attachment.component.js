import React, { Component } from 'react'

class Attachment extends Component {

    render() {
        return(
            <div className="attachment-row">
                <p className="attachment-slot">{this.props.attachment.slot}</p>
                <p className="attachment-name">{this.props.attachment.name}</p>
            </div>
        )
    }
}

export default Attachment