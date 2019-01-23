import React, { Component } from "react"
import CONFIG from '../CONFIG.js'
import ReactTable from "react-table"
import 'react-table/react-table.css'
import matchSorter from 'match-sorter'
import styled from 'styled-components'

const Emoji = styled.div`
position: relative;
&:before {
  content: '${props => props.before}';
}
&:after {
  position: absolute;
  left: 0;
  content: '${props => props.after && "👍" +props.after}';
  padding-left: 0.25em;
  opacity: 0.2
}
`

class Table extends Component {
    state = {data: [], loading: true}
    componentWillMount(){
        fetch(CONFIG.fetchUrl).then((response)=> {
          return response.json();
        }).then((data)=> {
          this.props.getStats(data.stats)        
          data = data.scores
          data.sort((a,b) => (a.total < b.total) ? 1 : ((b.total < a.total) ? -1 : 0)); 
          data.map((el, i)=>{
            el.percentage = Math.round((100/(el.correct + el.wrong) * el.correct * 10)) / 10
            
            el.nr = i + 1
            if(!el.lastWord) el.lastWord = ""
            return el
          }) 
          this.setState({data, loading: false})
        });       
      }

    columns = [
      {
            Header: 'Koht',
            accessor: 'nr',
            maxWidth: 50
          },
      {
        Header: 'Nimi',
        accessor: "name",
      Cell: props => {
        let emoji = emojilist[props.row.nr - 1]      
        if(props.row.nr === 1) {return <Emoji className="cell" onMouseOver={()=>this.props.mouseHandler("👑")} before={"👑"} >{props.row.name} 
        </Emoji>}
        if(props.row.nr < 11) {return <Emoji onMouseOver={()=>this.props.mouseHandler(emoji)} before={emoji}>{props.row.name}</Emoji>}  return <Emoji>{props.row.name}</Emoji>
      }
      ,
        filterMethod: (filter, row) =>
        row[filter.id].toLowerCase().match(filter.value.toLowerCase())
       }, 
       
       {
        Header: 'Punkte',
        accessor: 'total',
        maxWidth: 100
      },
      {
        Header: 'Rekord',
        accessor: 'max',
        maxWidth: 100
      },
      {
        Header: 'Valesid',
        accessor: 'wrong',
        maxWidth: 100
      },
      {
        Header: 'Õigeid',
        accessor: 'correct',
        maxWidth: 100
      },
      {
        Header: () => (
          <span className="darkstar">{"★"}
          </span>)
        ,
        accessor: 'correctInRow',
        maxWidth: 40,
        Cell: props => {
          if(props.row.correctInRow){
            return <div className={props.row.nr < 11?"star":"darkstar"}>{props.row.correctInRow}</div>
          }
        }
      },
      {
        Header: 'Õigete %',
        accessor: 'percentage',
        maxWidth: 100      
      },
      {
        Header: 'Sõnu',
        accessor: 'totalWords',
        maxWidth: 100     
      },
      {
        Header: 'Viimane sõna',
        accessor: 'lastWord',
        filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["lastWord"] }),
                  filterAll: true
      },
      {
        Header: 'Viimati',
        accessor: 'lastPlayed',
        maxWidth: 200,
        Cell: props => {
          let date = new Date(props.row.lastPlayed).toLocaleString('et-EE', {
            year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit"
          })
          return date
        },
        filterMethod: (filter, row) =>{     
          return new Date(row[filter.id]).toLocaleString('et-EE', {
            year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit"
          }).match(filter.value)
        }
       ,
      },   
    ]
    
    render() {
      
      return (
      !this.state.loading && <ReactTable 
      previousText= 'Eelmine'
      nextText= 'Järgmine'
      pageText= 'Lehekülg'
      loadingText= 'Laadimine...'
      noDataText= 'Andmeid ei leitud...'
      rowsText= 'rida'
      ofText= 'Kokku:'
      loading = {this.state.loading}
      
      getTrProps={(state, rowInfo, column) => {
        if(rowInfo && rowInfo.row.nr ===1) {
          return {
            style: {
              background: "green",
              color: "white"
            }
          }
        }
        if(rowInfo && rowInfo.row.nr < 11) {
          return {
            style: {
              background: "#8bc34a",
              color: "white"
            }
          }
        }

        return {
          style: {
            background: "none"
          }
        }
       
      }}
    className="-striped" filterable data={this.state.data} columns={this.columns}/>)
    }
  }

  export default Table;

let emojilist = "👑 🐮 🐷 🐑 🐔 🦔 🐭 🐸 🐛 🥦".split(" ")