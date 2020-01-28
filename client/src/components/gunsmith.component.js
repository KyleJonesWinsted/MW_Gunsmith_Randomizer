import React, { Component } from 'react'
import Attachment from './attachment.component'

class Gunsmith extends Component {

    constructor(props) {
        super(props)

        this.state = {
            gun_id: "",
            gun_name: "",
            gun_imgUrl: "",
            gun_rank: 100,
            attachments: []
        }

        this.getNewGun = this.getNewGun.bind(this)
        this.getAttachments = this.getAttachments.bind(this)
        this.rerollAttachments = this.rerollAttachments.bind(this)
        this.attachmentsList = this.attachmentsList.bind(this)
        this.onChangeGunRank = this.onChangeGunRank.bind(this)
    }

    async getNewGun(playerRank = 55) {
        const url = "/gun/random/" + playerRank
        try {
            const response = await fetch(url)
            if (response.ok) {
                const json = await response.json()
                return Promise.resolve(json)
            }
            throw new Error('Unable to get new gun')
        } catch(error) {
            console.log(error)
            return Promise.reject(error)
        }
    }

    async getAttachments(gunId) {
        if (!gunId) {
            return
        }
        const url = "/attachments/" + gunId + '/' + this.state.gun_rank
        try {
            const response = await fetch(url)
            if (response.ok) {
                const json = await response.json()
                while (json.length < 5) {
                    json.push({
                        name: "-",
                        gunId: "",
                        rankUnlocked: 100,
                        imgUrl: "",
                        slot: "-"
                    })
                }
                return Promise.resolve(json)
            }
            throw new Error('Unable to get attachments.')
        } catch(error) {
            console.log(error)
            return Promise.reject(error)
        }
    }

    async rerollAttachments() {
        try {
            const attachments = await this.getAttachments(this.state.gun_id)
            this.setState({
                attachments: attachments
            })
        } catch(error) {
            console.log(error)
            alert(error)
        }
    }

    async componentDidMount() {
        try {
            const gun = await this.getNewGun()
            const attachments = await this.getAttachments(gun._id)
            this.setState({
                gun_id: gun._id,
                gun_name: gun.name,
                gun_imgUrl: gun.imgUrl,
                gun_rank: 100,
                attachments: attachments
            })
        } catch(error) {
            console.log(error)
            alert(error)
        }
    }

    attachmentsList() {
        return this.state.attachments.map((currentAttachment, i) => {
            return <Attachment attachment={currentAttachment} key={i} />
        })
    }

    onChangeGunRank(e) {
        this.setState({
            gun_rank: e.target.value
        })
    }
    
    render() {
        return(
            <div className="gunsmith">
                <h1 className="gunsmith-title">{ this.state.gun_name } Gunsmith</h1>
                <div className="gunsmith-flex">
                    <div className="attachments">
                        <div>{ this.attachmentsList() }</div>
                    </div>
                    <div className="gun">
                        <div className="gun-img-frame">
                            <img className="gun-img" src={this.state.gun_imgUrl} alt={this.state.gun_name} />
                            <h3 className="gun-title">{ this.state.gun_name }</h3>
                        </div>
                        <div className="controls">
                            <label htmlFor="gunRank" id="gun-rank-label">Gun Rank:</label>
                            <input type="number" name="gunRank" id="gun-rank-input" value={this.state.gun_rank} onChange={this.onChangeGunRank} />
                            <button id="new-attachments-button" onClick={this.rerollAttachments}>New Attachments</button>
                            <br />
                            <button id="reroll-button" onClick={this.componentDidMount.bind(this)}>Reroll</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Gunsmith