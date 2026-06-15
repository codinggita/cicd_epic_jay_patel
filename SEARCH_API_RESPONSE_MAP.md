# Search API Response Map
## DevOps & CI/CD Knowledge Platform

This document describes the exact JSON structures returned by the backend search API endpoints. The frontend uses these models to correctly map search results, categories, auto-completions, and query suggestions.

---

## 1. Full-Text Search
* **Endpoint**: `GET /api/v1/search`
* **Query Parameters**:
  - `q`: Search terms query string (optional)
  - `topic`: Topic category filter (e.g. `kubernetes`, `docker`) (optional)
  - `difficulty`: Difficulty grade filter (`beginner`, `intermediate`, `advanced`, `expert`) (optional)
  - `page`: Page index (default: `1`)
  - `limit`: Records per page limit (default: `20`)
  - `sort`: Ordering strategy (`latest` or `popular`)
* **Response Payload Shape**:
  ```json
  {
    "status": "success",
    "message": "Full text search executed successfully",
    "data": {
      "records": [
        {
          "_id": "60d21b4667d0d8992e610c85",
          "instruction": "Deploy NGINX Ingress controller using Helm with TLS encryption",
          "output": "apiVersion: apps/v1\nkind: Deployment\n...",
          "topic": "kubernetes",
          "difficulty": "advanced",
          "views": 42,
          "likes": 12,
          "createdAt": "2026-06-01T08:38:33.000Z",
          "updatedAt": "2026-06-02T16:59:25.000Z"
        }
      ],
      "pagination": {
        "total": 1,
        "page": 1,
        "limit": 8,
        "pages": 1
      }
    }
  }
  ```

---

## 2. Topic Tags Counts
* **Endpoint**: `GET /api/v1/search/tags`
* **Response Payload Shape**:
  ```json
  {
    "status": "success",
    "message": "Unique topic tags fetched successfully",
    "data": {
      "tags": [
        {
          "name": "kubernetes",
          "count": 14
        },
        {
          "name": "docker",
          "count": 8
        },
        {
          "name": "terraform",
          "count": 5
        }
      ]
    }
  }
  ```

---

## 3. Autocomplete Prefix Matching
* **Endpoint**: `GET /api/v1/search/autocomplete`
* **Query Parameters**:
  - `q`: Prefix input text (e.g. `depl`)
* **Response Payload Shape**:
  ```json
  {
    "status": "success",
    "message": "Autocomplete prefix matching complete",
    "data": {
      "results": [
        {
          "_id": "60d21b4667d0d8992e610c85",
          "instruction": "Deploy NGINX Ingress controller using Helm with TLS encryption",
          "topic": "kubernetes"
        }
      ]
    }
  }
  ```

---

## 4. Fuzzy Search
* **Endpoint**: `GET /api/v1/search/fuzzy`
* **Query Parameters**:
  - `q`: Partial query terms split by spaces
* **Response Payload Shape**:
  ```json
  {
    "status": "success",
    "message": "Fuzzy search executed successfully",
    "data": {
      "results": [
        {
          "_id": "60d21b4667d0d8992e610c85",
          "instruction": "Deploy NGINX Ingress controller using Helm with TLS encryption",
          "output": "apiVersion: apps/v1\nkind: Deployment\n...",
          "topic": "kubernetes",
          "difficulty": "advanced"
        }
      ]
    }
  }
  ```

---

## 5. Exact Matches Search
* **Endpoint**: `GET /api/v1/search/exact`
* **Query Parameters**:
  - `q`: Exact query target value
* **Response Payload Shape**:
  ```json
  {
    "status": "success",
    "message": "Exact match search executed successfully",
    "data": {
      "results": [
        {
          "_id": "60d21b4667d0d8992e610c85",
          "instruction": "Deploy NGINX Ingress controller using Helm with TLS encryption",
          "output": "...",
          "topic": "kubernetes",
          "difficulty": "advanced"
        }
      ]
    }
  }
  ```

---

## 6. Query Suggestions
* **Endpoint**: `GET /api/v1/search/suggestions`
* **Query Parameters**:
  - `q`: Partial query text
* **Response Payload Shape**:
  ```json
  {
    "status": "success",
    "message": "Query suggestions compiled successfully",
    "data": {
      "suggestions": [
        "Deploy NGINX Ingress controller",
        "Deploy Kubernetes Secrets"
      ]
    }
  }
  ```
