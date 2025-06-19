const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

const getSeverityForStatusCerere = (obj) => {
  switch (obj) {
    case 'acceptata':
      return 'success'

    case 'in asteptare':
      return 'warn'

    case 'respinsa':
      return 'danger'

    default:
      return null
  }
}

const updateToastProps = (severity, summary, detail) => {
  return {
    severity,
    summary,
    detail
  }
}

export { sleep, getSeverityForStatusCerere, updateToastProps }
