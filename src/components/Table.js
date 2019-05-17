import React, { Component } from "react";
import CONFIG from "../CONFIG.js";
import ReactTable from "react-table";
import "react-table/react-table.css";
import matchSorter from "match-sorter";
import styled from "styled-components";

const WithEmoji = styled.div`
position: relative;
&:before {
  content: '${props => props.before}';
}
`;

class Table extends Component {
  state = { data: [], loading: true };
  componentWillMount() {
    fetch(CONFIG.fetchUrl)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.props.getStats(data.stats);
        data = data.scores;

        data.sort((a, b) =>
          a.total < b.total ? 1 : b.total < a.total ? -1 : 0
        );
        data.map((el, i) => {
          el.percentage =
            Math.round((100 / (el.correct + el.wrong)) * el.correct * 10) / 10;
          el.nr = i + 1;
          if (!el.lastWord) el.lastWord = "";
          return el;
        });

        this.setState({ data, loading: false });
      });
  }

  columns = [
    {
      Header: "Koht",
      accessor: "nr",
      maxWidth: 50
    },
    {
      Header: "Nimi",
      accessor: "name",
      Cell: props => {
        let emoji = emojilist[props.row.nr - 1];
        if (props.row.nr < 11) {
          return (
            <WithEmoji
              onMouseOver={() => this.props.mouseHandler(emoji)}
              before={emoji}
            >
              {props.row.name}
            </WithEmoji>
          );
        }

        return props.row.name;
      },
      filterMethod: (filter, row) =>
        row[filter.id].toLowerCase().match(filter.value.toLowerCase())
    },

    {
      Header: "Punkte",
      accessor: "total",
      defaultSortDesc: true,

      maxWidth: 100
    },
    {
      Header: "Rekord",
      accessor: "max",
      defaultSortDesc: true,
      maxWidth: 100
    },
    {
      Header: "Valesid",
      accessor: "wrong",
      defaultSortDesc: true,
      maxWidth: 100
    },
    {
      Header: "Õigeid",
      defaultSortDesc: true,
      accessor: "correct",
      maxWidth: 100
    },
    {
      Header: () => <span className="darkstar">{"★"}</span>,
      accessor: "correctInRow",
      maxWidth: 40,
      defaultSortDesc: true,
      Cell: props => {
        if (props.row.correctInRow) {
          return (
            <div className={props.row.nr < 11 ? "star" : "darkstar"}>
              {props.row.correctInRow}
            </div>
          );
        }
      }
    },
    {
      Header: "Õigete %",
      id: "percentage",
      accessor: d => d,
      Cell: row => row.original.percentage,
      maxWidth: 100,
      defaultSortDesc: true,
      sortMethod: (a, b) => {
        if (a.percentage === b.percentage) {
          return a.total > b.total ? 1 : -1;
        }
        return a.percentage > b.percentage ? 1 : -1;
      }
    },
    {
      Header: "Sõnu",
      accessor: "totalWords",
      defaultSortDesc: true,
      maxWidth: 100
    },
    {
      Header: "Viimane sõna",
      accessor: "lastWord",
      filterMethod: (filter, rows) =>
        matchSorter(rows, filter.value, { keys: ["lastWord"] }),
      filterAll: true
    },
    {
      Header: "Viimati",
      accessor: "lastPlayed",
      maxWidth: 200,
      defaultSortDesc: true,
      Cell: props => {
        let date = new Date(props.row.lastPlayed).toLocaleString("et-EE", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        });
        return date;
      },
      filterMethod: (filter, row) => {
        return new Date(row[filter.id])
          .toLocaleString("et-EE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
          })
          .match(filter.value);
      }
    }
  ];

  render() {
    return (
      !this.state.loading && (
        <ReactTable
          previousText="Eelmine"
          defaultPageSize={100}
          nextText="Järgmine"
          pageText="Lehekülg"
          loadingText="Laadimine..."
          noDataText="Andmeid ei leitud..."
          rowsText="rida"
          ofText="Kokku:"
          loading={this.state.loading}
          defaultSorted={[{id:"nr", asc: true}]}
          getTrProps={(state, rowInfo, column) => {
            if (rowInfo && rowInfo.row.nr === 1) {
              return {
                style: {
                  background: "green",
                  color: "white"
                }
              };
            }
            if (rowInfo && rowInfo.row.nr < 11) {
              return {
                style: {
                  background: "#8bc34a",
                  color: "white"
                }
              };
            }

            return {
              style: {
                background: "none"
              }
            };
          }}
          className="-striped"
          filterable
          data={this.state.data}
          columns={this.columns}
        />
      )
    );
  }
}

export default Table;

let emojilist = "👑 🐮 🐷 🐑 🐔 🦔 🐭 🐸 🐛 🥦".split(" ");
