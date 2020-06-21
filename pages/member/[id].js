import Header from "components/header";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import EditMember from "components/editMember";

import { Container } from "react-bootstrap";

import { useStoreContext } from "components/Store";

export default function Member() {
  const {
    setActive,
    getMemberData,
    currentUser,
    updateMember,
  } = useStoreContext();
  useEffect(() => {
    setActive("member");
    if (currentUser) {
      const fetchData = async () => {
        const member = await getMemberData(parseInt(id));
        // fix reminders
        if (!member.reminders || typeof member.reminders === "string") {
          if (!member.reminders) member.reminders = [];
          else
            member.reminders = member.reminders
              .split(",")
              .map((r) => parseInt(r));
        }

        setMember(member);
      };
      fetchData();
    }
  }, [currentUser]);

  const [member, setMember] = useState(null);

  const router = useRouter();
  const { id } = router.query;
  console.log("member id", id);

  const onSubmit = async (data, form) => {
    console.log("data", data);
    // upsert: false don't allow adding new member!
    let theData = { memberId: member.memberId, upsert: false, ...data };
    // delete properties we don't want
    delete theData.email;
    delete theData.active;
    delete theData.guest;
    delete theData._id;

    await updateMember(theData);
    setMember(data);
    form.resetForm({ values: data });

    console.log("good submit ", theData);
  };
  const doChangePW = () => {
    console.log("doChangePW");
    setShowChangePW(true);
  };


  return (
    <>
      <Header />
      <Container>
        <h2 className="text-center">Stuff for you {id}</h2>
        {member ? <EditMember member={member} setMember={setMember}/> : <div>Loading</div>}
      </Container>
    </>
  );
}