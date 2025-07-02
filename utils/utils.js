const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const getSeverityForStatusCerere = (obj) => {
  switch (obj) {
    case "acceptata":
      return "success";

    case "in asteptare":
      return "warn";

    case "respinsa":
      return "danger";

    default:
      return null;
  }
};

const updateToastProps = (severity, summary, detail) => {
  return {
    severity,
    summary,
    detail,
  };
};

const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();

  const isSameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isSameDay) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    return `${date.toLocaleDateString("en-GB")} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }
};

export {
  sleep,
  getSeverityForStatusCerere,
  updateToastProps,
  formatMessageTime,
};
