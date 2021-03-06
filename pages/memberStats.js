import Header from "../components/header";
import React, { useContext, useState, useEffect } from "react";
import { Table, Form, Row, Container } from "react-bootstrap";
import { useStoreContext } from "../components/Store";
import moment from "moment";

function MemberStats() {
  const { setActive, getMatchStats, matchStats } = useStoreContext();
  const [where, setWhere] = useState("all");
  const [memberId, setMemberId] = useState(null);
  useEffect(() => {
    setActive("memberStats");
    getMatchStats();
  }, []);
  const getBowlers = () => {
    // taken from https://stackoverflow.com/questions/36032179/remove-duplicates-in-an-object-array-javascript
    let thedates = matchStats[0].filter(
      (elem, index, self) =>
        self.findIndex((m) => {
          return m.alias === elem.alias;
        }) === index
    );

    return thedates.map((d) => {
      return { alias: d.alias, dateId: d.dateId, memberId: d.memberId };
    });
  };

  const handleChange = (event) => {
    setMemberId(parseInt(event.target.value));
  };
  const onRadio = (event) => {
    console.log("where", event.target.value);
    setWhere(event.target.value);
  };

  if (matchStats) {
    const theData = matchStats[0].filter((s) => {
      if (s.memberId === memberId) {
        if (where === "all") return true;
        if (where === "local" && s.match.match(/^Continental/i)) return true;
        if (where === "away" && s.match.match(/-Continental/)) return true;
      }
      return false;
    });

    // make the dates for the input selector
    const bowlers = getBowlers(matchStats.results);
    // add the initial value
    bowlers.unshift({
      alias: "Please Select a Member",
      dateId: 0,
      memberId: 0,
    });
    return (
      <>
        <Header />
        <Container>
          <h2 className="text-center">Member Stats</h2>
          <Form>
            <Form.Group controlId="exampleForm.SelectCustom">
              <Form.Label>Select the Bowler: </Form.Label>
              <Row>
                <Form.Control
                  as="select"
                  custom
                  onChange={handleChange}
                  style={{ width: "20%" }}
                >
                  {bowlers.map((d, i) => {
                    return (
                      <option key={i} value={d.memberId}>
                        {d.alias}
                      </option>
                    );
                  })}
                </Form.Control>
                <div key={"inline-1"} className="mb-3">
                  <Form.Check
                    onChange={onRadio}
                    inline
                    value="all"
                    label="all"
                    type="radio"
                    id="all"
                    checked={where === "all"}
                  />
                  <Form.Check
                    onChange={onRadio}
                    inline
                    value="local"
                    label="local"
                    type="radio"
                    id="local"
                    checked={where === "local"}
                  />
                  <Form.Check
                    onChange={onRadio}
                    inline
                    value="away"
                    label="away"
                    type="radio"
                    id="away"
                    checked={where === "away"}
                  />
                </div>
              </Row>
            </Form.Group>
          </Form>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <td>Match (Host - Guest)</td>
                <td>Date</td>
                <td>Average</td>
                <td>Series</td>
                <td>Hi&nbsp;Game</td>
                <td>Game&nbsp;1</td>
                <td>Game&nbsp;2</td>
                <td>Game&nbsp;3</td>
                <td>Handi</td>
              </tr>
            </thead>
            <tbody>
              {theData.map((r, i) => {
                return (
                  <tr key={i}>
                    <td key={1}>{r.match}</td>
                    <td key={2}>{moment(r.date).format("MM/DD/YY")}</td>
                    <td key={3}>{r.average}</td>
                    <td key={4}>{r.series}</td>
                    <td key={5}>{r.hiGame}</td>

                    <td key={6}>{r.game1}</td>
                    <td key={7}>{r.games[1]}</td>
                    <td key={8}>{r.games[2]}</td>

                    <td key={9}>{r.handi}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Container>
      </>
    );
  } else return <div>Waiting add Progress indicator here!</div>;
}

export default MemberStats;
