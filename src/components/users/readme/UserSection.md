# UserSection Component Documentation

## File
`src/components/users/UserSection.jsx`

## Purpose
`UserSection` is a reusable layout component for configurable user-management sections.

## Inputs
It accepts configuration for:
```text
title
description
badge
badgeColor
buttonColor
buttonText
searchPlaceholder
icon
users
onAdd
```

It also supports translation-key variants for the displayed text.

## Search
The component maintains:
```text
searchTerm
```

and filters the supplied `users` array client-side.

Searchable user values are combined into a normalized searchable representation.

## Add Action
The Add button calls:
```text
onAdd
```

so the parent owns the actual creation flow.

## Table
Filtered users are passed to:
```jsx
<UserTable />
```

## Summary
`UserSection.jsx` provides the shared header, badge, search, add-button, and table layout for user sections while leaving data/action ownership to the parent.
