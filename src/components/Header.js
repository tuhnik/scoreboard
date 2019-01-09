import React, { Component } from "react";
import CONFIG from '../CONFIG.js'
class Header extends Component {
  render() {
    return <>
    <div className="header">
      <h1 onClick={()=>window.location.reload()}><span role="img" aria-label="emoji">{this.props.emoji}</span> {CONFIG.title || "Scoreboard"} <span role="img" aria-label="emoji">{this.props.emoji}</span></h1>
      <div className="slogan">
        <a href={CONFIG.siteUrl || "https://example.com" }>{CONFIG.siteName || "example.com"}</a>
      </div>
    </div>
    </>
  }
}

export default Header;