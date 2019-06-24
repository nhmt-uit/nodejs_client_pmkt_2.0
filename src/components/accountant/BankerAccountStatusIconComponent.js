import React, { Component } from 'react'

class BankerAccountStatusIconComponent extends Component {
    render() {
        const {bankerAccountStatus} = this.props
        let xhtml = null
        if(!bankerAccountStatus) return xhtml
        
        
        switch (bankerAccountStatus.type) {
            case "notify" :
                xhtml = <i className="fa fa-spinner font-yellow-soft spinner-animate" />
            break
            case "resolve" :
                xhtml = <i className="fa fa-check font-green-jungle" />
            break
            case "reject" :
            case "stop" :
                xhtml = <i className="fa fa-close font-red-pink" />
            break
            default: break
        }


        return (
            xhtml
        )
    }
}

export default BankerAccountStatusIconComponent