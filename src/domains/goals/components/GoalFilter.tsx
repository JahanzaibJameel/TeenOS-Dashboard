import React, { useState } from 'react'
import { GoalStatus, GoalCategory, GoalPriority, GoalFilterOptions } from '../types'

interface GoalFilterProps {
  onFilterChange: (filters: GoalFilterOptions) => void
  className?: string
}

const GoalFilter: React.FC<GoalFilterProps> = ({ onFilterChange, className = '' }) => {
  const [statusFilters, setStatusFilters] = useState<GoalStatus[]>([])
  const [categoryFilters, setCategoryFilters] = useState<GoalCategory[]>([])
  const [priorityFilters, setPriorityFilters] = useState<GoalPriority[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'progress' | 'createdAt'>('dueDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const handleStatusChange = (status: GoalStatus) => {
    setStatusFilters(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    )
  }

  const handleCategoryChange = (category: GoalCategory) => {
    setCategoryFilters(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const handlePriorityChange = (priority: GoalPriority) => {
    setPriorityFilters(prev =>
      prev.includes(priority)
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    )
  }

  const applyFilters = () => {
    onFilterChange({
      status: statusFilters.length > 0 ? statusFilters : undefined,
      category: categoryFilters.length > 0 ? categoryFilters : undefined,
      priority: priorityFilters.length > 0 ? priorityFilters : undefined,
      searchQuery: searchQuery || undefined,
      sortBy,
      sortOrder
    })
  }

  const clearFilters = () => {
    setStatusFilters([])
    setCategoryFilters([])
    setPriorityFilters([])
    setSearchQuery('')
    setSortBy('dueDate')
    setSortOrder('asc')
    
    onFilterChange({})
  }

  return (
    <div className={`goal-filter ${className}`}>
      <div className="filter-section">
        <h3>Status</h3>
        {Object.values(GoalStatus).map(status => (
          <label key={status} className="filter-option">
            <input
              type="checkbox"
              checked={statusFilters.includes(status)}
              onChange={() => handleStatusChange(status)}
            />
            {status.replace(/_/g, ' ').toLowerCase()}
          </label>
        ))}
      </div>

      <div className="filter-section">
        <h3>Category</h3>
        {Object.values(GoalCategory).map(category => (
          <label key={category} className="filter-option">
            <input
              type="checkbox"
              checked={categoryFilters.includes(category)}
              onChange={() => handleCategoryChange(category)}
            />
            {category.toLowerCase()}
          </label>
        ))}
      </div>

      <div className="filter-section">
        <h3>Priority</h3>
        {Object.values(GoalPriority).map(priority => (
          <label key={priority} className="filter-option">
            <input
              type="checkbox"
              checked={priorityFilters.includes(priority)}
              onChange={() => handlePriorityChange(priority)}
            />
            {priority.toLowerCase()}
          </label>
        ))}
      </div>

      <div className="filter-section">
        <h3>Search</h3>
        <input
          type="text"
          placeholder="Search goals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="filter-section">
        <h3>Sort By</h3>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value as any)}
        >
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="progress">Progress</option>
          <option value="createdAt">Created At</option>
        </select>
        
        <select 
          value={sortOrder} 
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div className="filter-actions">
        <button onClick={applyFilters}>Apply Filters</button>
        <button onClick={clearFilters}>Clear All</button>
      </div>
    </div>
  )
}

export default GoalFilter