/**
 * TimeSlicer - Implements cooperative multitasking using requestIdleCallback
 * to prevent blocking the main thread during long-running operations.
 */

export interface TimeSliceOptions {
  /** Time slice duration in milliseconds (default: 5ms) */
  timeSliceMs?: number;
  /** Callback for progress updates */
  onProgress?: (progress: number, total: number, completed: number) => void;
  /** Callback when work is completed */
  onComplete?: () => void;
  /** Callback when work is cancelled */
  onCancel?: () => void;
}

export interface TimeSliceTask<T> {
  (): T;
}

export interface TimeSliceWorker {
  /**
   * Process an array of items with time slicing
   */
  processArray<T, R>(
    items: T[],
    processor: (item: T, index: number) => R,
    options?: TimeSliceOptions
  ): Promise<R[]>;
  
  /**
   * Process a single task with time slicing
   */
  processTask<T>(task: TimeSliceTask<T>, options?: TimeSliceOptions): Promise<T>;
  
  /**
   * Cancel ongoing work
   */
  cancel(): void;
  
  /**
   * Check if work is currently in progress
   */
  isWorking(): boolean;
}

export class TimeSlicer implements TimeSliceWorker {
  private isCancelled: boolean = false;
  private isWorkingFlag: boolean = false;

  /**
   * Process an array of items with time slicing
   */
  async processArray<T, R>(
    items: T[],
    processor: (item: T, index: number) => R,
    options: TimeSliceOptions = {}
  ): Promise<R[]> {
    const {
      timeSliceMs = 5,
      onProgress,
      onComplete,
      onCancel
    } = options;

    this.isCancelled = false;
    this.isWorkingFlag = true;
    
    const results: R[] = new Array(items.length);
    let processedCount = 0;

    // Process items in batches during idle periods
    const processBatch = (): Promise<void> => {
      return new Promise((resolve) => {
        const batchStartTime = performance.now();
        
        // Process items while we have time and aren't cancelled
        while (
          processedCount < items.length && 
          !this.isCancelled && 
          (performance.now() - batchStartTime) < timeSliceMs
        ) {
          try {
            results[processedCount] = processor(items[processedCount], processedCount);
            processedCount++;
            
            // Call progress callback if provided
            if (onProgress) {
              onProgress(processedCount, items.length, processedCount);
            }
          } catch (error) {
            console.error('Error processing item:', error);
            // Continue processing other items despite this error
            results[processedCount] = undefined as any;
            processedCount++;
          }
        }

        // If we're done or cancelled, finish up
        if (processedCount >= items.length || this.isCancelled) {
          if (this.isCancelled && onCancel) {
            onCancel();
          } else if (!this.isCancelled && onComplete) {
            onComplete();
          }
          this.isWorkingFlag = false;
          resolve();
          return;
        }

        // Yield control back to the browser
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => {
            processBatch().then(resolve);
          }, { timeout: 1000 }); // Max 1 second timeout
        } else {
          // Fallback to setTimeout for browsers that don't support requestIdleCallback
          setTimeout(() => {
            processBatch().then(resolve);
          }, 0);
        }
      });
    };

    try {
      await processBatch();
      return results;
    } finally {
      this.isWorkingFlag = false;
    }
  }

  /**
   * Process a single task with time slicing
   */
  async processTask<T>(task: TimeSliceTask<T>, options: TimeSliceOptions = {}): Promise<T> {
    const { timeSliceMs = 5 } = options;
    this.isCancelled = false;
    this.isWorkingFlag = true;

    return new Promise<T>((resolve, reject) => {
      const executeTask = () => {
        if (this.isCancelled) {
          this.isWorkingFlag = false;
          return;
        }

        try {
          const result = task();
          this.isWorkingFlag = false;
          resolve(result);
        } catch (error) {
          this.isWorkingFlag = false;
          reject(error);
        }
      };

      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(executeTask, { timeout: timeSliceMs * 10 });
      } else {
        // Fallback to setTimeout
        setTimeout(executeTask, 0);
      }
    });
  }

  /**
   * Cancel ongoing work
   */
  cancel(): void {
    this.isCancelled = true;
  }

  /**
   * Check if work is currently in progress
   */
  isWorking(): boolean {
    return this.isWorkingFlag;
  }
}

// Singleton instance
export const timeSlicer = new TimeSlicer();

export default timeSlicer;