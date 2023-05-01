import React from "react";
import loss from "../images/loss.svg"
import gain from "../images/gain.svg"
export default class AssetsComp extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            name:this.props.name,
            totalPrice:this.props.totalPrice,
            changedTotalPrice:this.props.changedTotalPrice,
            singlePrice:this.props.singlePrice,
            singlePercent:this.props.singlePercent
        }
    }
    render(){
        return(
            <div class="row">
                <p id="name">{this.state.name}</p>
                <div>
                    <p>₹{this.state.singlePrice}</p>
                    <div>
                        <img src={gain} alt="gain"/>
                        <p className="gain">{this.state.singlePercent}%</p>
                    </div>
                </div>
                <div>
                    <p>₹{this.state.totalPrice}</p>
                    <div>
                        <img src={loss} alt="loss"/>
                        <p className="loss">₹{this.state.changedTotalPrice}</p>
                    </div>
                </div>
            </div>
        )
    }
}