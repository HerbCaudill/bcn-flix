import * as React from 'react'
const ErrorMessage = ({ message }: { message: string }) => (
  <div className="ui message">
    <div className="header">GraphQL error</div>
    <pre>{message}</pre>
    <p>
      {message == 'Network error: Failed to fetch' &&
        'Is the API server running?'}
    </p>
  </div>
)

export default ErrorMessage
