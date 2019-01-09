import React, { Component } from "react";
import Table from "./components/Table";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CONFIG from './CONFIG.js'

class App extends Component {

  state={headerEmoji: "🧠", stats: ""}

  componentWillMount = () => {
    document.getElementsByTagName("title")[0].innerHTML = CONFIG.title + " - " + CONFIG.siteName
  }

  mouseHandler = (emoji) => {
    this.setState({headerEmoji: emoji})
  }

  getStats = (stats) =>{
    this.setState({stats})
  }

  render() {
    return <div className="main">
    <Header emoji={this.state.headerEmoji}/>
    <div className="table"><Table getStats={this.getStats} mouseHandler={this.mouseHandler}/></div>
    {this.state.stats && <Footer stats={this.state.stats} />}
    </div>
  }
}

export default App;
