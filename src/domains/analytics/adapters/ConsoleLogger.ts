import { AnalyticsAdapter, AnalyticsEvent } from './AnalyticsAdapter'

export class ConsoleLogger implements AnalyticsAdapter {
  private userId: string | null = null
  private userContext: Record<string, any> = {}

  track(event: AnalyticsEvent): void {
    const logEvent = {
      ...event,
      userId: event.userId || this.userId,
      userContext: this.userContext,
      level: 'info'
    }
    
    console.log('[Analytics Event]', logEvent)
  }

  identify(userId: string, traits?: Record<string, any>): void {
    this.userId = userId
    if (traits) {
      this.userContext = { ...this.userContext, ...traits }
    }
    
    console.log('[Analytics Identify]', { userId, traits })
  }

  pageView(pageName: string, properties?: Record<string, any>): void {
    const event: AnalyticsEvent = {
      eventName: 'page_view',
      userId: this.userId || undefined,
      properties: {
        pageName,
        ...properties,
        ...this.userContext
      },
      timestamp: new Date()
    }
    
    console.log('[Analytics Page View]', event)
  }

  captureException(error: Error, context?: Record<string, any>): void {
    console.error('[Analytics Exception]', {
      error: error.message,
      stack: error.stack,
      userId: this.userId,
      context: { ...context, ...this.userContext },
      timestamp: new Date()
    })
  }

  setUserContext(userId: string, context: Record<string, any>): void {
    if (this.userId === userId) {
      this.userContext = { ...this.userContext, ...context }
    }
  }

  flush(): void {
    console.log('[Analytics Flush]')
  }

  close(): void {
    console.log('[Analytics Close]')
    this.userId = null
    this.userContext = {}
  }
}