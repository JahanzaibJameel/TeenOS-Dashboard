import React, { useState } from 'react';
import { useTimeSlice } from '../../../shared/hooks/useTimeSlice';
import { Goal, GoalStatus } from '../types';

interface BulkGoalProcessorProps {
  goals: Goal[];
  onProcessComplete: (results: Goal[]) => void;
}

export const BulkGoalProcessor: React.FC<BulkGoalProcessorProps> = ({ goals, onProcessComplete }) => {
  const [operation, setOperation] = useState<'complete' | 'archive' | 'reset'>('complete');
  const {
    result,
    isProcessing,
    progress,
    error,
    processArray,
    cancel
  } = useTimeSlice<Goal, Goal>();

  const handleProcessGoals = async () => {
    if (goals.length === 0) return;

    try {
      const processedGoals = await processArray(
        goals,
        (goal) => {
          // Simulate processing time for each goal
          const startTime = performance.now();
          // Perform some CPU-intensive work
          while (performance.now() - startTime < 2) {
            // Busy wait simulation
          }

          // Apply the selected operation to the goal
          switch (operation) {
            case 'complete':
              return { 
                ...goal, 
                status: GoalStatus.COMPLETED, 
                completedDate: new Date(),
                progressPercentage: 100
              };
            case 'archive':
              return { 
                ...goal, 
                status: GoalStatus.CANCELLED, 
                completedDate: new Date(),
                progressPercentage: goal.progressPercentage // preserve progress
              };
            case 'reset':
              return { 
                ...goal, 
                status: GoalStatus.NOT_STARTED,
                completedDate: undefined,
                progressPercentage: 0
              };
            default:
              return goal;
          }
        },
        {
          timeSliceMs: 5, // 5ms per time slice
          onProgress: (processed, total) => {
            console.log(`Processed ${processed} of ${total} goals`);
          }
        }
      );

      onProcessComplete(processedGoals);
    } catch (err) {
      console.error('Error processing goals:', err);
    }
  };

  const handleOperationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOperation(e.target.value as 'complete' | 'archive' | 'reset');
  };

  return (
    <div className="bulk-goal-processor">
      <div className="processor-controls">
        <select value={operation} onChange={handleOperationChange}>
          <option value="complete">Mark as Complete</option>
          <option value="archive">Archive Goals</option>
          <option value="reset">Reset Goals</option>
        </select>
        
        <button 
          onClick={handleProcessGoals} 
          disabled={isProcessing || goals.length === 0}
        >
          {isProcessing ? 'Processing...' : `Process ${goals.length} Goals`}
        </button>
        
        {isProcessing && (
          <button onClick={cancel} className="cancel-btn">
            Cancel
          </button>
        )}
      </div>

      {isProcessing && (
        <div className="processing-indicator">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="progress-text">{progress}% complete</span>
        </div>
      )}

      {error && (
        <div className="error-message">
          Error: {error.message}
        </div>
      )}

      {result && !isProcessing && (
        <div className="success-message">
          Successfully processed {goals.length} goals!
        </div>
      )}
    </div>
  );
};

export default BulkGoalProcessor;