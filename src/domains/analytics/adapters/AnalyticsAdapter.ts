export interface AnalyticsEvent {
  eventName: string
  userId?: string
  properties?: Record<string, any>
  timestamp: Date
}

export interface AnalyticsAdapter {
  /**
   * Track a custom event
   */
  track(event: AnalyticsEvent): void

  /**
   * Identify a user
   */
  identify(userId: string, traits?: Record<string, any>): void

  /**
   * Page view tracking
   */
  pageView(pageName: string, properties?: Record<string, any>): void

  /**
   * Capture an exception/error
   */
  captureException(error: Error, context?: Record<string, any>): void

  /**
   * Set user context for all subsequent events
   */
  setUserContext(userId: string, context: Record<string, any>): void

  /**
   * Flush all pending events
   */
  flush(): void

  /**
   * Close and clean up the adapter
   */
  close(): void
}