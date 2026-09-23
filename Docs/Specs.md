Title: Sportus – Personal Training Tracker (Single‑User MVP → Multi‑User Future)

Prompt:

You are an AI code architect. I need you to analyze the following product description and produce a complete technical breakdown of the project, including architecture, database schema, modules, and a phased development plan.

## Product Overview

Sportus is a personal training application (initially single‑user, no authentication) that allows the user to:

1. Create and manage a catalog of exercises.
2. Track metrics for each exercise over time.
3. Record training sessions (workout diary).
4. Visualize progress through charts and history.
5. Later evolve into a multi‑user platform with authentication and social features.

The MVP is strictly single‑user, offline‑friendly, and uses:

- React (web frontend, claymorphism UI style)
- Node.js (backend)
- SQLite (database)

## Exercise Catalog Requirements

### Exercise fields:

- Name
- One or more photos
- Description
- Sport (e.g., Gym, Basketball, etc.)
- Subclassifications (multiple) depending on the sport
  - Gym examples: biceps, triceps, chest, back, shoulders, cardio, abs, glutes, quads, calves
  - Basketball examples: ball handling, shooting mechanics, defense, conditioning, off‑ball movement

### Sport & Subclassification Rules

- User can add and edit sports.
- User can add and edit subclassifications.
- Deleting sports or subclassifications is not allowed to avoid relational issues.
- Each exercise belongs to one sport.
- Each exercise can have multiple subclassifications.
- Each subclassification belongs to one sport.

## Metrics System (Core of the App)

The app must support a flexible, user‑extendable metric catalog, including:

### Examples of metrics:

- Time
- Weight
- Distance / Length
- Calories
- Repetitions
- Speed
- Heart rate
- Height (e.g., jump height)
- Ball control score
- Shooting accuracy percentage
- Any custom metric defined by the user

### Units of measurement

Each metric can have multiple units (e.g., weight → kilograms, pounds).

### Exercise-specific common metrics

Each exercise can have a set of common metrics configured for faster data entry, but the user must be able to log any metric for any exercise.

### Difficulty metric

Every logged entry must include a difficulty score from 1 to 5, where:

- 1 = very difficult
- 5 = very easy

## Training Diary (Workout Log)

A training session consists of multiple entries.

Example:

- Exercise: Concentration Curl
- Metrics logged:
  - Weight: 20 lb
  - Repetitions: 12
  - Difficulty: 3
  - Notes (optional)

If the user logs this 4 times, it means they performed 4 sets.

The system must allow:

- Viewing previous performance for the same exercise
- Line charts showing progress over time
- A “GitHub‑style commits heatmap” showing training frequency
- Exercise‑specific progress charts
- Global training activity charts

## Technical Requirements

### Frontend

- React
- Claymorphism UI
- Components for:
  - Exercise catalog
  - Metric configuration
  - Training diary
  - Charts
  - Sport/subclassification management

### Backend

- Node.js
- REST API
- Modular architecture
- SQLite database
- Prepared to evolve into multi‑user with authentication later

### Database (SQLite)

You must design tables for:

- Sports
- Subclassifications
- Exercises
- Exercise photos
- Metrics catalog
- Units of measurement
- Exercise → common metrics
- Training sessions
- Training entries (sets)
- Logged metrics per entry
- Difficulty score
- Future-proofing for multi-user mode

## Your Tasks

1. Design the full database schema (tables, relationships, constraints).
2. Define backend modules and API endpoints for the MVP.
3. Define frontend components and UI structure.
4. Identify potential pitfalls and propose solutions (e.g., relational integrity, extensible metrics).
5. Propose a scalable architecture that can later support multi-user mode.
6. Break the project into development phases, including:
  - MVP (single user)
  - Enhanced metrics & charts
  - Multi-user upgrade
  - Social features
  - Optional AI features

Your output must be structured, detailed, and actionable for a development team.