import React, { Component } from "react";

class Footer extends Component {
  render() {
    return <>
    <div className="footer">
    Sõnu kokku: <b>{this.props.stats.totalWords}</b> <span className="separator">⬤</span> Arvatud sõnu: <b>{this.props.stats.guessedWords}</b> <span className="separator">⬤</span> Pakkumisi: <b>{this.props.stats.totalGuesses}</b> <span className="separator">⬤</span> Mängijaid: <b>{this.props.stats.totalPlayers} </b>
    </div>
    </>
  }
}

export default Footer;