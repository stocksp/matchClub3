import React, { useContext, useState } from "react";
import moment from "moment";
import { useStoreContext } from "components/Store";
import { Formik, Field } from "formik";
import { getSeason } from "libs/utils";
import Alert from "components/alert";
import DatePicker from "react-datepicker";
import {
  Form,
  Button,
  Row,
  Col,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

const EditDate = (props) => {
  const [openAlert, setOpenAlert] = useState(false);

  const { updateDate } = useStoreContext();
  const teamSizeMaxArr = [16, 20];

  const { clubs, locations } = props.clubsLocations;

  // check that the edited (or not) date does not fall on an existing date
  // ignore the case where the date is compared to itself
  const dateIsUsed = (date) => {
    return props.dates.some((d) => {
      const same = moment(d.date).isSame(date, "day");
      return same && d.dateId !== props.date.dateId;
    });
  };
  const nextDateId = () => {
    return (
      props.dates.reduce((max, d) => {
        return d.dateId > max ? d.dateId : max;
      }, 0) + 1
    );
  };

  const onSubmit = (data, form) => {
    const theDate = moment(data.date);

    const conflict = dateIsUsed(theDate);
    console.log("conflict with existing date", conflict);
    if (conflict) setOpenAlert(true);
    else {
      let theData = {};

      theData = {
        dateId: props.date.dateId ? props.date.dateId : nextDateId(),
        guest: data.guest,
        host: data.host,
        location: data.location,
        teamsizemax: data.teamsizemax,
        date: theDate.toJSON(),
        hasmeeting: data.hasmeeting,
        season: getSeason(data.date),
      };

      updateDate(theData);
      form.resetForm({ values: data });
      console.log("done with submit TODO", theData);
      //props.onClose();
    }
  };

  return (
    <Formik initialValues={props.date} onSubmit={onSubmit}>
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        errors,
        touched,
        dirty,
        isValid,
        setFieldValue,
      }) => {
        console.log("date values", values);
        return (
          <Form>
            <Button variant="link" onClick={() => props.doClose()}>
              Back to Dates List
            </Button>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <br />
              <DatePicker
                value={values.date}
                name="date"
                onChange={(date) => {
                  console.log("theDate", date);
                  //setSelectedDate(date.toDate());
                  setFieldValue("date", date);
                }}
                showTimeSelect
                selected={values.date}
                dateFormat="MMM d, yyyy h:mm aa"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Host</Form.Label>
              <Form.Control
                as="select"
                name="host"
                custom
                onChange={handleChange}
                value={values.host}
              >
                {clubs.map((c, i) => {
                  return (
                    <option key={i} value={c.name}>
                      {c.name}
                    </option>
                  );
                })}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Guest</Form.Label>
              <Form.Control
                as="select"
                name="guest"
                custom
                onChange={handleChange}
                value={values.guest}
              >
                {clubs.map((c, i) => {
                  return (
                    <option key={i} value={c.name}>
                      {c.name}
                    </option>
                  );
                })}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Location</Form.Label>
              <Form.Control
                as="select"
                name="location"
                custom
                onChange={handleChange}
                value={values.location}
              >
                {[{ name: "Select House" }, ...locations].map((c, i) => {
                  return (
                    <option key={i} value={c.name}>
                      {c.name}
                    </option>
                  );
                })}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Squad Size</Form.Label>
              <Form.Control
                as="select"
                name="teamsizemax"
                custom
                onChange={handleChange}
                value={values.teamsizemax}
              >
                {teamSizeMaxArr.map((c, i) => {
                  return (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  );
                })}
              </Form.Control>
            </Form.Group>

            <Form.Check
              id="hasmeeting"
              type="switch"
              name="hasmeeting"
              label="Has Meeting"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.hasmeeting}
              checked={values.hasmeeting}
            />

            <Button
              type="submit"
              variant="primary"
              onClick={handleSubmit}
              disabled={!dirty}
            >
              Submit
            </Button>
            <Alert
              open={openAlert}
              toggle={setOpenAlert}
              title="Date Selected is already used"
              msg="You selected a date of an existing match"
            />
          </Form>
        );
      }}
      {/* */}
    </Formik>
  );
};
export default EditDate;
