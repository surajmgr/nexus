---
sidebar_position: 2
---

# Projects API

Manage projects and their configuration.

## Get Project by Public Key

Retrieve project configuration using public key.

**Endpoint:** `GET /api/embed/project/:publicKey`

**Authentication:** Not required

**Response:**
```json
{
  "project": {
    "id": "proj_xxx",
    "name": "My Feedback Board",
    "slug": "my-feedback",
    "publicKey": "pk_xxx",
    "authMode": "HYBRID",
    "allowAnonymous": true,
    "categories": [
      {
        "id": "cat_xxx",
        "name": "General",
        "description": "General feedback"
      }
    ],
    "tags": [
      {
        "id": "tag_xxx",
        "name": "Bug",
        "color": "#ff0000"
      }
    ]
  }
}
```

## Get Project by Slug

Retrieve project configuration using slug.

**Endpoint:** `GET /api/embed/project/slug/:slug`

**Authentication:** Not required

**Response:** Same as above

## Create Project

Create a new project (admin only).

**Endpoint:** `POST /api/admin/projects`

**Authentication:** Platform session required

**Request:**
```json
{
  "workspaceId": "workspace_xxx",
  "name": "My Feedback Board",
  "slug": "my-feedback",
  "authMode": "HYBRID",
  "allowAnonymous": true
}
```

**Response:**
```json
{
  "project": {
    "id": "proj_xxx",
    "workspaceId": "workspace_xxx",
    "name": "My Feedback Board",
    "slug": "my-feedback",
    "publicKey": "pk_abc123...",
    "secretKey": "sk_def456...",
    "authMode": "HYBRID",
    "allowAnonymous": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Auth Modes:**
- `HOST_SSO`: Require host JWT
- `PLATFORM_AUTH`: Require platform session
- `HYBRID`: Accept either
- `ANONYMOUS`: Allow anonymous

## List Projects

List all projects in a workspace (admin only).

**Endpoint:** `GET /api/admin/projects?workspaceId=xxx`

**Authentication:** Platform session required

**Response:**
```json
{
  "projects": [
    {
      "id": "proj_xxx",
      "name": "Project 1",
      "slug": "project-1",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```
