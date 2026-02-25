import React, { useState } from 'react';
import { GoalPriority, GoalCategory, CreateGoalData } from '../types';

interface GoalFormProps {
  onSubmit: (goal: CreateGoalData) => void;
  onCancel: () => void;
}

export const GoalForm: React.FC<GoalFormProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GoalCategory>(GoalCategory.PERSONAL);
  const [priority, setPriority] = useState<GoalPriority>(GoalPriority.MEDIUM);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [targetValue, setTargetValue] = useState<number | undefined>(undefined);
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      title,
      description: description || undefined,
      category,
      priority,
      startDate: new Date(startDate),
      dueDate: dueDate ? new Date(dueDate) : undefined,
      targetValue: targetValue || undefined,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    });
  };

  return (
    <form className="goal-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as GoalCategory)}
          >
            {Object.values(GoalCategory).map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as GoalPriority)}
          >
            {Object.values(GoalPriority).map((prio) => (
              <option key={prio} value={prio}>
                {prio.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="targetValue">Target Value</label>
        <input
          type="number"
          id="targetValue"
          value={targetValue ?? ''}
          onChange={(e) => setTargetValue(e.target.value ? Number(e.target.value) : undefined)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="tags">Tags (comma separated)</label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="work, urgent, important"
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit">Save Goal</button>
      </div>
    </form>
  );
};

export default GoalForm;