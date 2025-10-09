import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('App ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4">
          <div className="mx-auto max-w-3xl rounded border border-red-200 bg-red-50 p-4 text-red-700">
            <div className="mb-1 font-semibold">Something went wrong.</div>
            <div className="text-sm whitespace-pre-wrap break-words">{String(this.state.error?.message || this.state.error)}</div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}


