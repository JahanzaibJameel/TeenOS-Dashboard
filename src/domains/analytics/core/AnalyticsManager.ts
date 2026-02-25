import { AnalyticsAdapter, AnalyticsEvent } from '../adapters/AnalyticsAdapter'
import { ConsoleLogger } from '../adapters/ConsoleLogger'
import { SentryAdapter } from '../adapters/SentryAdapter'

export class AnalyticsManager {
  private static instance: AnalyticsManager
  private adapters: AnalyticsAdapter[] = []
  private userId: string | null = null
  private userContext: Record<string, any> = {}

  private constructor() {
    // Add default console logger
    this.adapters.push(new ConsoleLogger())
  }

  public static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager()
    }
    return AnalyticsManager.instance
  }

  /**
   * Add an analytics adapter
   */
  addAdapter(adapter: AnalyticsAdapter): void {
    this.adapters.push(adapter)
  }

  /**
   * Remove an analytics adapter
   */
  removeAdapter(adapter: AnalyticsAdapter): void {
    this.adapters = this.adapters.filter(a => a !== adapter)
  }

  /**
   * Initialize Sentry adapter with DSN
   */
  initializeSentry(dsn: string): void {
    const sentryAdapter = new SentryAdapter(dsn)
    this.addAdapter(sentryAdapter)
  }

  /**
   * Track a custom event across all adapters
   */
  track(eventName: string, properties?: Record<string, any>): void {
    const event: AnalyticsEvent = {
      eventName,
      userId: this.userId || undefined,
      properties,
      timestamp: new Date()
    }

    this.adapters.forEach(adapter => {
      try {
        adapter.track(event)
      } catch (error) {
        console.error('Error tracking event in adapter:', error)
      }
    })
  }

  /**
   * Identify a user across all adapters
   */
  identify(userId: string, traits?: Record<string, any>): void {
    this.userId = userId
    
    this.adapters.forEach(adapter => {
      try {
        adapter.identify(userId, traits)
      } catch (error) {
        console.error('Error identifying user in adapter:', error)
      }
    })
  }

  /**
   * Track page views across all adapters
   */
  pageView(pageName: string, properties?: Record<string, any>): void {
    this.adapters.forEach(adapter => {
      try {
        adapter.pageView(pageName, properties)
      } catch (error) {
        console.error('Error tracking page view in adapter:', error)
      }
    })
  }

  /**
   * Capture exceptions across all adapters
   */
  captureException(error: Error, context?: Record<string, any>): void {
    this.adapters.forEach(adapter => {
      try {
        adapter.captureException(error, context)
      } catch (error) {
        console.error('Error capturing exception in adapter:', error)
      }
    })
  }

  /**
   * Set user context for all adapters
   */
  setUserContext(context: Record<string, any>): void {
    this.userContext = { ...this.userContext, ...context }
    
    if (this.userId) {
      this.adapters.forEach(adapter => {
        try {
          adapter.setUserContext(this.userId!, context)
        } catch (error) {
          console.error('Error setting user context in adapter:', error)
        }
      })
    }
  }

  /**
   * Flush all adapters
   */
  flush(): void {
    this.adapters.forEach(adapter => {
      try {
        adapter.flush()
      } catch (error) {
        console.error('Error flushing adapter:', error)
      }
    })
  }

  /**
   * Close all adapters
   */
  close(): void {
    this.adapters.forEach(adapter => {
      try {
        adapter.close()
      } catch (error) {
        console.error('Error closing adapter:', error)
      }
    })
  }
}