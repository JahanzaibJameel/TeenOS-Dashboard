import { useState, useCallback, useEffect, useRef } from 'react';
import { TimeSliceOptions, timeSlicer } from '../utils/TimeSlicer';

export interface UseTimeSliceReturn<T, R> {
  result: R | null;
  isProcessing: boolean;
  progress: number;
  error: Error | null;
  processArray: (items: T[], processor: (item: T, index: number) => R, options?: TimeSliceOptions) => Promise<R[]>;
  processTask: (task: () => R, options?: TimeSliceOptions) => Promise<R>;
  cancel: () => void;
}

export function useTimeSlice<T, R>(): UseTimeSliceReturn<T, R> {
  const [result, setResult] = useState<R[] | R | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);
  
  const progressRef = useRef({ processed: 0, total: 0 });
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleProgress = useCallback((processed: number, total: number) => {
    if (mountedRef.current) {
      progressRef.current = { processed, total };
      const progressPercent = total > 0 ? Math.round((processed / total) * 100) : 0;
      setProgress(progressPercent);
    }
  }, []);

  const handleComplete = useCallback(() => {
    if (mountedRef.current) {
      setIsProcessing(false);
    }
  }, []);

  const handleError = useCallback((err: Error) => {
    if (mountedRef.current) {
      setError(err);
      setIsProcessing(false);
    }
  }, []);

  const processArray = useCallback(async (
    items: T[],
    processor: (item: T, index: number) => R,
    options: TimeSliceOptions = {}
  ): Promise<R[]> => {
    setIsProcessing(true);
    setError(null);
    setProgress(0);
    progressRef.current = { processed: 0, total: items.length };

    try {
      const result = await timeSlicer.processArray(
        items,
        processor,
        {
          ...options,
          onProgress: handleProgress,
          onComplete: handleComplete,
          onCancel: () => {
            if (mountedRef.current) {
              setIsProcessing(false);
            }
          }
        }
      );

      if (mountedRef.current) {
        setResult(result);
        setProgress(100);
      }

      return result;
    } catch (err) {
      handleError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  }, [handleProgress, handleComplete, handleError]);

  const processTask = useCallback(async (
    task: () => R,
    options: TimeSliceOptions = {}
  ): Promise<R> => {
    setIsProcessing(true);
    setError(null);
    setProgress(0);

    try {
      const result = await timeSlicer.processTask(
        task,
        {
          ...options,
          onComplete: handleComplete,
          onCancel: () => {
            if (mountedRef.current) {
              setIsProcessing(false);
            }
          }
        }
      );

      if (mountedRef.current) {
        setResult(result);
        setProgress(100);
      }

      return result;
    } catch (err) {
      handleError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  }, [handleComplete, handleError]);

  const cancel = useCallback(() => {
    timeSlicer.cancel();
    setIsProcessing(false);
    setProgress(0);
  }, []);

  return {
    result: result as R | null,
    isProcessing,
    progress,
    error,
    processArray,
    processTask,
    cancel,
  };
}

export default useTimeSlice;