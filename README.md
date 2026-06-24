# Product Browser API

## Overview

Backend API for browsing 200,000 products with:

- Cursor-based pagination
- Category filtering
- Adjustable page size
- PostgreSQL database hosted on Supabase

---

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Supabase
- Render

---

## Database Design

Products table:

- id
- name
- category
- price
- created_at
- updated_at

Indexes:

- (updated_at DESC, id DESC)
- (category, updated_at DESC, id DESC)

---

## Pagination Strategy

I used cursor (keyset) pagination instead of OFFSET pagination.

Reason:
- Faster on large datasets
- Stable while data changes
- Prevents duplicate or skipped products when new products are inserted during browsing

Cursor fields:
- updated_at
- id

Ordering:

```sql
ORDER BY updated_at DESC, id DESC