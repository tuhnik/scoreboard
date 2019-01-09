import React, { Component } from 'react';


class Card extends Component {
  state = {flipped: true}
  flip = () =>{
      console.log("flipping")
      this.setState({flipped: !this.state.flipped})
  }
  render() {
    return (
        <div onClick={this.flip} className={this.state.flipped?"Card flipped":"Card"}></div>
    );
  }
}

export default Card;
