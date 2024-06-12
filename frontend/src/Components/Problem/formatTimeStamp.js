import moment from "moment";


const formatTimestamp = (timestamp) => {
  const now = moment();
  const time = moment(timestamp);

  if (now.diff(time, "minutes") < 1) {
    return `${now.diff(time, "seconds")} seconds ago`;
  } else if (now.diff(time, "hours") < 1) {
    return `${now.diff(time, "minutes")} minutes ago`;
  } else if (now.diff(time, "hours") < 24) {
    return `${now.diff(time, "hours")} hours ago`;
  } else {
    return time.format("MMM D, YYYY");
  }
};

export default formatTimestamp;
