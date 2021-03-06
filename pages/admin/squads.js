import React, { useState, useEffect } from "react";
import Header from "components/header";
import AdminHeader from "components/adminHeader";
import { useStoreContext } from "components/Store";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import moment from "moment";
function Squads() {
  const [dateId, setDateId] = useState(null);
  const {
    squads,
    getSquads,
    setSquads,
    hasSquads,
    allMembers,
    getAllMembers,
    hasAllMembers,
    updateSquad,
    setActive,
  } = useStoreContext();
  useEffect(() => {
    getAllMembers();
    getSquads();
    setActive("admin.squads");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  let dates;
  const butStyleM = {
    backgroundColor: "#a5a5a5d9",
    boxShadow: "3px 3px 4px 1px rgba(100, 100, 100, 240)",
    border: "3px solid",
    borderRadius: "6px",
    borderStyle: "outset",
    borderColor: "rgb(220, 220, 220)",
    textTransform: "none",
    minWidth: "100px",
    minHeight: "60px",

    fontSize: "smaller",
    padding: "5px",
  };

  const squadButtom = {
    backgroundColor: "#fd9133",
    boxShadow: "3px 3px 4px 1px rgb(100, 100, 100, 240)",
    border: "3px solid",
    borderRadius: "6px",
    borderStyle: "outset",
    borderColor: "rgb(220, 220, 220)",
    textTransform: "none",
    minWidth: "100px",
    minHeight: "60px",
    maxHeight: "60px",
    fontSize: "smaller",
    padding: "5px",
  };

  const handleChange = (event) => {
    setDateId(parseInt(event.target.value));
  };
  const add = (member) => {
    console.log("adding", member.alias);

    const theSquad = squads.find(
      (s) => s.dateId === (dateId ? dateId : dates[0].dateId)
    ).squad;
    // get the position for the new bowler
    const pos =
      theSquad.length === 0 ? 1 : theSquad[theSquad.length - 1].pos + 1;
    console.log(pos);
    const data = { name: member.alias, pos, id: member.memberId };
    theSquad.push(data);
    // update the local data in our store
    setSquads([...squads]);
    // update the remote store
    updateSquad({ dateId: dateId ? dateId : dates[0].dateId, squad: theSquad });
  };

  const remove = (member) => {
    console.log("removing", member.name);
    let theSquad = squads.find(
      (s) => s.dateId === (dateId ? dateId : dates[0].dateId)
    ).squad;
    // get the index of the element to remove
    const pos = theSquad.findIndex((m) => m.id === member.id);
    console.log(pos);
    theSquad.splice(pos, 1);
    // remap pos
    theSquad = theSquad.map((s, i) => ({ ...s, pos: i + 1 }));

    // update the remote store
    updateSquad({ dateId: dateId ? dateId : dates[0].dateId, squad: theSquad });
  };
  if (hasSquads && hasAllMembers) {
    dates = squads.map((d) => {
      return { date: d.date, match: `${d.host}-${d.guest}`, dateId: d.dateId };
    });
    const theSquad = squads.find(
      (s) => s.dateId === (dateId ? dateId : dates[0].dateId)
    ).squad;
    const members = allMembers
      .sort((a, b) => {
        const a1 = a.alias.split(" ").slice(-1)[0];
        const b1 = b.alias.split(" ").slice(-1)[0];
        if (a1 < b1) return -1;
        if (a1 > b1) return 1;
        return 0;
      })
      .filter((m) => {
        const val =
          !theSquad.find((s) => s.id === m.memberId) && m.active ? true : false;
        return val;
      })
      .map((m) => {
        return {
          alias: m.alias.replace("Guest - ", ""),
          memberId: m.memberId,
          guest: m.guest,
          pos: m.pos,
        };
      });
    console.log("first member", members[0]);

    return (
      <>
        <Header />
        <Container
          style={{
            marginTop: "-5px",
          }}
        >
          <AdminHeader />
          <h2 className="text-center">Squads</h2>
          <Form>
            <Form.Group>
              <Form.Label>Select the Match Date</Form.Label>
              <Row>
                <Form.Control
                  as="select"
                  custom
                  onChange={handleChange}
                  style={{ width: "33%" }}
                >
                  {dates.map((d, i) => {
                    const title = `${moment(d.date).format(
                      "MMM. D, YYYY"
                    )} ${d.match.replace("-", " hosting ")} `;
                    return (
                      <option key={i} value={d.dateId}>
                        {title}
                      </option>
                    );
                  })}
                </Form.Control>
              </Row>
            </Form.Group>
          </Form>

          <Row>
            <Col>
              {members.map((m, i) => {
                return (
                  <button key={i} style={butStyleM} onClick={() => add(m)}>
                    {m.alias}
                  </button>
                );
              })}
            </Col>

            <Col>
              {theSquad.map((m, i) => {
                return (
                  <Button key={i} style={squadButtom} onClick={() => remove(m)}>
                    {m.name}{" "}
                  </Button>
                );
              })}
            </Col>
          </Row>
        </Container>
      </>
    );
  }
  return <div>Waiting add Progress indicator here!</div>;
}
export default Squads;
