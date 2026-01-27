# Project Timeline Tracker

A dynamic, browser-based project management tool for planning and tracking project activities with dependencies, constraints, and automatic date calculations.

## Overview

The Project Timeline Tracker is a standalone HTML application that helps project managers and teams plan project timelines with sophisticated dependency management, business day calculations, and constraint handling. It provides an intuitive interface for creating activities, defining their relationships, and visualizing how changes cascade through dependent tasks.

## Features

### 1. **Activity Management**

- Create unlimited project activities with custom names
- Set duration for each activity (in days)
- Auto-incrementing display IDs (#1, #2, #3, etc.) for easy reference
- Delete activities with automatic recalculation of dependent tasks
- Editable activity details directly in the table

### 2. **Dependency Management**

- Define which activities must complete before others can start
- Support for multiple dependencies per activity (e.g., Activity 4 depends on Activities 2 and 3)
- Automatic cascade updates when dependency dates change
- Dependent activities start immediately after their latest dependency completes
- Circular dependency detection and prevention
- Self-reference validation
- Editable dependencies directly in the table

### 3. **Business Days & Weekend Handling**

- **Weekend exclusion by default**: Calculations automatically skip Saturdays and Sundays
- **Optional weekend inclusion**: Toggle checkbox to include weekends in all calculations
- Automatic adjustment of start dates to weekdays when weekend exclusion is enabled
- Validation prevents setting dates on weekends when exclusion is active
- Business day calculations for accurate project timeline estimation

### 4. **Day-of-Week Constraints**

- Specify allowed start days for activities (e.g., "Mon, Thu" for activities that can only start on Mondays or Thursdays)
- Automatic date adjustment to next valid day based on constraints
- Flexible format: accepts both full names (Monday) and abbreviations (Mon)
- Combines with business day calculations for complex scheduling

### 5. **Editable Dates**

- **Editable start dates**: Manually adjust when activities begin
- **Editable end dates**: Change end dates to automatically recalculate duration
- Real-time validation of date changes
- Automatic recalculation of dependent activities when dates change
- Duration automatically updates based on date changes

### 6. **Smart Date Calculations**

- Project start date sets the baseline for all activities
- Activities without dependencies can start any time after project start
- Activities with dependencies automatically calculate start dates based on latest dependency completion
- End dates calculated based on start date + duration
- Respects weekend exclusion and day-of-week constraints in all calculations

### 7. **Cascade Updates**

- Changing a dependency's end date automatically updates all dependent activities
- Works bidirectionally: moving dates earlier or later triggers proper cascading
- Multiple levels of dependencies cascade correctly
- Maintains consistency across the entire project timeline

### 8. **User-Friendly Interface**

- Clean, modern design with intuitive controls
- Color-coded constraint badges
- Editable date inputs with calendar pickers
- Clear visual distinction between editable and read-only fields
- Responsive layout optimized for desktop use
- Fixed-width table prevents column jumping during edits

### 9. **Validation & Error Prevention**

- Prevents end dates before start dates
- Prevents start dates before dependency completion
- Prevents weekend dates when weekend exclusion is enabled
- Detects and blocks circular dependencies
- Clear error messages guide users to correct issues

## How to Use

### Getting Started

1. **Open the Application**: Open `timeline-tracker.html` in any modern web browser
2. **Set Project Start Date**: The current date is set by default, or choose your project start date
3. **Configure Weekend Handling**: Check "Include Weekends in Calculations" if your project works on weekends

### Creating Activities

1. **Fill in Activity Details**:
   - **Activity Name**: Descriptive name for the task
   - **Duration**: Number of days the activity will take
   - **Dependencies** (optional): Comma-separated IDs of activities that must complete first (e.g., "1, 2")
   - **Allowed Start Days** (optional): Days of the week when this activity can start (e.g., "Mon, Thu")

2. **Click "Add Activity"**: The activity appears in the table with calculated dates

### Managing Activities

- **Edit Start Date**: Click on the start date to change when an activity begins
- **Edit End Date**: Click on the end date to change when an activity ends (duration auto-updates)
- **Edit Dependencies**: Type comma-separated IDs in the Dependencies field to change relationships
- **Delete Activity**: Click "Remove" to delete an activity

### Understanding the Table

| Column           | Description                                                               |
| ---------------- | ------------------------------------------------------------------------- |
| **ID**           | Auto-incrementing number for easy reference                               |
| **Activity**     | Name of the activity                                                      |
| **Dependencies** | Which activities must complete first (editable except for first activity) |
| **Constraints**  | Day-of-week restrictions, if any                                          |
| **Est. Start**   | Calculated or manually set start date (editable)                          |
| **Duration**     | Number of days the activity takes (auto-calculated from date changes)     |
| **Est. End**     | Calculated or manually set end date (editable)                            |
| **Action**       | Delete button                                                             |

## Technical Details

### Date Calculation Logic

1. **For activities without dependencies**:
   - Can start any time on or after the project start date
   - Start date only updates if not set or if manually changed

2. **For activities with dependencies**:
   - Always start the day after the latest dependency ends
   - Automatically recalculate when any dependency changes
   - Skip weekends if weekend exclusion is enabled

3. **Day-of-week constraints** are applied after dependency calculations
4. **Weekend skipping** is applied throughout all calculations when enabled

### Duration Calculations

- **With weekends included**: End Date = Start Date + (Duration - 1)
- **With weekends excluded**: Only count business days (Mon-Fri)
- Duration automatically recalculates when end date is manually changed

### Dependency Behavior Examples

**Example 1: Simple Dependency**

- Activity 1: Jan 1 - Jan 3
- Activity 2 (depends on 1): Starts Jan 4 (day after Activity 1 ends)

**Example 2: Multiple Dependencies**

- Activity 2 ends Monday
- Activity 3 ends Wednesday
- Activity 4 (depends on 2, 3): Starts Thursday (day after latest dependency)

**Example 3: Cascade Update**

- Activity 3 depends on Activity 2
- If Activity 2's end date moves from Monday to Wednesday
- Activity 3 automatically shifts from Tuesday to Thursday

## Browser Compatibility

Works in all modern browsers:

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## File Structure

- **timeline-tracker.html**: Standalone HTML file containing all code (HTML, CSS, JavaScript)
- **TIMELINE_TRACKER_DOCS.md**: This documentation file

## Data Persistence

Currently, all data is stored in browser memory and will be lost when the page is refreshed. To save your timeline:

- Keep the browser tab open while working
- Take screenshots for documentation
- Future enhancement: Consider adding export/import functionality

## Future Enhancement Ideas

- Export to CSV/Excel
- Import existing project plans
- Save/load functionality using localStorage or files
- Print-friendly view
- Gantt chart visualization
- Critical path highlighting
- Resource allocation tracking
- Milestone markers
- Progress tracking (% complete)

## License

This is a utility tool for internal project management use.
