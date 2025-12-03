---
sidebar_position: 4
---

# Versioning Guide

Learn how to manage different versions of your project documentation.

## Why Versioning?

Documentation versioning allows you to:
- Maintain docs for multiple versions of your project simultaneously
- Provide users with version-specific information
- Keep historical documentation accessible
- Support users on older versions

## How Versioning Works

Docusaurus uses a simple versioning system:

- **Current version** (`docs/`): The "Next" or unreleased version, actively being developed
- **Versioned docs** (`versioned_docs/`): Snapshots of documentation at specific releases
- **Version dropdown**: Users can switch between versions in the UI

## Directory Structure

```
projects/your-project/
  ├── docs/                    # Current/Next version
  ├── versioned_docs/          # Versioned snapshots
  │   ├── version-2.0.0/       # Version 2.0.0 snapshot
  │   └── version-1.0.0/       # Version 1.0.0 snapshot
  ├── versioned_sidebars/      # Sidebar configs for each version
  ├── versions.json            # List of all versions
  └── sidebars.ts              # Current sidebar config
```

## Creating a New Version

### Step 1: Prepare Your Documentation

Before creating a version, ensure your current documentation in `projects/your-project/docs/` is complete and accurate for the release.

### Step 2: Run the Version Command

Create a new version using the Docusaurus CLI:

```bash
npm run docusaurus docs:version:your-project 1.0.0
```

Replace `your-project` with your project's plugin ID and `1.0.0` with your version number.

### Step 3: What Happens

The command will:
1. Copy `projects/your-project/docs/` to `projects/your-project/versioned_docs/version-1.0.0/`
2. Create a sidebar snapshot in `projects/your-project/versioned_sidebars/`
3. Update `projects/your-project/versions.json`

### Step 4: Configure Version Settings

In `docusaurus.config.ts`, configure version behavior:

```typescript
{
  id: 'your-project',
  path: 'projects/your-project/docs',
  routeBasePath: 'your-project',
  sidebarPath: './projects/your-project/sidebars.ts',
  versions: {
    current: {
      label: 'Next',
      path: 'next',
    },
  },
  includeCurrentVersion: true,
  lastVersion: '1.0.0',
  versionsFilePath: 'versioned_docs/your-project/versions.json',
  versioned_docs: 'versioned_docs/your-project',
  versioned_sidebars: 'versioned_docs/your-project/versioned_sidebars',
}
```

## Managing Versions

### Listing Versions

Check `projects/your-project/versions.json` to see all available versions:

```json
[
  "2.0.0",
  "1.0.0"
]
```

Versions are listed from newest to oldest.

### Setting the Default Version

The first version in `versions.json` is the default. To change it:

1. Edit `versions.json` and reorder the array
2. Or set `lastVersion` in your plugin configuration

### Deleting a Version

To remove a version:

1. Delete the version folder from `projects/your-project/versioned_docs/`
2. Delete the corresponding sidebar from `projects/your-project/versioned_sidebars/`
3. Remove the version from `projects/your-project/versions.json`

### Updating a Versioned Doc

Versioned docs are snapshots and should generally not be modified. However, for critical fixes:

1. Navigate to `projects/your-project/versioned_docs/version-X.X.X/`
2. Edit the necessary files
3. Commit the changes

## Version Labels

Customize how versions appear in the dropdown:

```typescript
versions: {
  current: {
    label: 'Next 🚧',
    path: 'next',
    banner: 'unreleased',
  },
  '2.0.0': {
    label: '2.0.0 (Latest)',
    banner: 'none',
  },
  '1.0.0': {
    label: '1.0.0',
    banner: 'unmaintained',
  },
}
```

## Best Practices

- **Version on releases**: Create a new version when you release a major or minor version
- **Don't over-version**: Avoid creating versions for every small change
- **Keep current docs updated**: Always maintain the "Next" version with latest changes
- **Document breaking changes**: Clearly mark breaking changes between versions
- **Archive old versions**: Consider removing very old, unsupported versions

## Version Banners

Add banners to inform users about version status:

- `unreleased`: For the current/next version
- `unmaintained`: For old versions no longer supported
- `none`: For stable, maintained versions

## URL Structure

Versioned docs follow this URL pattern:

- Current version: `/your-project/next/page`
- Latest stable: `/your-project/page` (no version in URL)
- Specific version: `/your-project/version-1.0.0/page`

## Next Steps

- [Add a new project](./projects/adding-projects.md)
- [Explore the documentation hub](./intro.md)
- [View example: FortiHub](/fortihub/intro)
