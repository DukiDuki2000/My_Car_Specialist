# Strona główna

## Nawiguj do:

<div style="display: flex; gap: 10px; flex-wrap: wrap;">

<a href="frontend/" class="md-button md-button--primary">Frontend</a>

<a href="backend/" class="md-button md-button--primary">Backend</a>

<a href="tests/" class="md-button md-button--primary">Testy</a>

</div>

## Skład zespołu

<div style="display: flex; flex-wrap: wrap;">
  <div style="flex: 33.33%; padding-right: 20px;">
    <ul>
      <li>Aleksandra Bigda</li>
      <li>Grzegorz Kochański</li>
      <li>Wojciech Makurat</li>
    </ul>
  </div>
  <div style="flex: 33.33%; padding-right: 20px;">
    <ul>
      <li>Paweł Skowron</li>
      <li>Jakub Tokarski</li>
    </ul>
  </div>
  <div style="flex: 33.33%; padding-left: 20px;">
    <ul>
      <li>Kamil Wójcik</li>
      <li>Kamil Zych</li>
    </ul>
  </div>
</div>

## Schemat projektu

<div style="display: flex; gap: 10px;">

<div style="width: 40%;">

Frontend

```bash

├── 404.tsx
├── 500.tsx
├── about
│   └── page.tsx
├── auth
│   ├── login
│   │   └── page.tsx
│   └── register
│       └── page.tsx
├── _document.tsx
├── form
│   └── page.tsx
└── [name]
├── client-dashboard
│   ├── add-request
│   │   └── page.tsx
│   ├── client-info
│   │   └── page.tsx
│   ├── page.tsx
│   ├── requests-list
│   │   ├── page.tsx
│   │   ├── request-actual
│   │   │   └── page.tsx
│   │   └── request-history
│   │       └── page.tsx
│   └── vehicles
│       ├── add-car
│       │   └── page.tsx
│       ├── page.tsx
│       └── show-vehicles
│           └── page.tsx
├── garage-dashboard
│   ├── actual
│   │   ├── [id]
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── garage-info
│   │   └── page.tsx
│   ├── history
│   │   └── page.tsx
│   ├── page.tsx
│   └── pending-ticket-list
│       └── page.tsx
├── moderator-dashboard
│   ├── check-car
│   │   └── page.tsx
│   ├── check-requests
│   │   └── page.tsx
│   └── page.tsx
└── page.tsx
```

</div> <div style="width: 60%;">

Backend

```bash

├───.idea
│   ├───httpRequests
│   └───modules
├───docs
│   ├───assets
│   ├───backend-md
│   ├───frontend-md
│   └───main-md
└───spring_apps
    ├───api-gateway
    │   ├───.gradle
    │   │   ├───8.11.1
    │   │   │   ├───checksums
    │   │   │   ├───executionHistory
    │   │   │   ├───expanded
    │   │   │   ├───fileChanges
    │   │   │   ├───fileHashes
    │   │   │   └───vcsMetadata
    │   │   ├───buildOutputCleanup
    │   │   └───vcs-1
    │   ├───build
    │   │   ├───classes
    │   │   │   └───java
    │   │   │       └───main
    │   │   │           └───com
    │   │   │               └───apsi_projekt
    │   │   │                   └───api_gateway
    │   │   │                       └───security
    │   │   ├───generated
    │   │   │   └───sources
    │   │   │       ├───annotationProcessor
    │   │   │       │   └───java
    │   │   │       │       └───main
    │   │   │       └───headers
    │   │   │           └───java
    │   │   │               └───main
    │   │   ├───reports
    │   │   │   └───problems
    │   │   ├───resources
    │   │   │   └───main
    │   │   └───tmp
    │   │       └───compileJava
    │   │           └───compileTransaction
    │   │               ├───backup-dir
    │   │               └───stash-dir
    │   ├───gradle
    │   │   └───wrapper
    │   └───src
    │       ├───main
    │       │   ├───java
    │       │   │   └───com
    │       │   │       └───apsi_projekt
    │       │   │           └───api_gateway
    │       │   │               └───security
    │       │   └───resources
    │       └───test
    │           └───java
    │               └───com
    │                   └───apsi_projekt
    │                       └───api_gateway
    ├───garage-service
    │   ├───.gradle
    │   │   ├───8.11.1
    │   │   │   ├───checksums
    │   │   │   ├───executionHistory
    │   │   │   ├───expanded
    │   │   │   ├───fileChanges
    │   │   │   ├───fileHashes
    │   │   │   └───vcsMetadata
    │   │   ├───buildOutputCleanup
    │   │   └───vcs-1
    │   ├───build
    │   │   ├───classes
    │   │   │   └───java
    │   │   │       └───main
    │   │   │           └───com
    │   │   │               └───apsi_projekt
    │   │   │                   └───garage_service
    │   │   │                       ├───dto
    │   │   │                       ├───model
    │   │   │                       ├───repositories
    │   │   │                       ├───rest
    │   │   │                       ├───security
    │   │   │                       └───service
    │   │   ├───generated
    │   │   │   └───sources
    │   │   │       ├───annotationProcessor
    │   │   │       │   └───java
    │   │   │       │       └───main
    │   │   │       └───headers
    │   │   │           └───java
    │   │   │               └───main
    │   │   ├───reports
    │   │   │   └───problems
    │   │   ├───resources
    │   │   │   └───main
    │   │   └───tmp
    │   │       └───compileJava
    │   │           └───compileTransaction
    │   │               ├───backup-dir
    │   │               └───stash-dir
    │   ├───gradle
    │   │   └───wrapper
    │   └───src
    │       ├───main
    │       │   ├───java
    │       │   │   └───com
    │       │   │       └───apsi_projekt
    │       │   │           └───garage_service
    │       │   │               ├───dto
    │       │   │               ├───model
    │       │   │               ├───repositories
    │       │   │               ├───rest
    │       │   │               ├───security
    │       │   │               └───service
    │       │   └───resources
    │       └───test
    │           └───java
    │               └───com
    │                   └───apsi_projekt
    │                       └───garage-service
    ├───notification-service
    │   ├───.gradle
    │   │   ├───8.11.1
    │   │   │   ├───checksums
    │   │   │   ├───executionHistory
    │   │   │   ├───expanded
    │   │   │   ├───fileChanges
    │   │   │   ├───fileHashes
    │   │   │   └───vcsMetadata
    │   │   ├───buildOutputCleanup
    │   │   └───vcs-1
    │   ├───build
    │   │   ├───classes
    │   │   │   └───java
    │   │   │       └───main
    │   │   │           └───com
    │   │   │               └───apsi_projekt
    │   │   │                   └───notification_service
    │   │   │                       ├───rest
    │   │   │                       └───security
    │   │   ├───generated
    │   │   │   └───sources
    │   │   │       ├───annotationProcessor
    │   │   │       │   └───java
    │   │   │       │       └───main
    │   │   │       └───headers
    │   │   │           └───java
    │   │   │               └───main
    │   │   ├───reports
    │   │   │   └───problems
    │   │   ├───resources
    │   │   │   └───main
    │   │   └───tmp
    │   │       └───compileJava
    │   │           └───compileTransaction
    │   │               ├───backup-dir
    │   │               └───stash-dir
    │   ├───gradle
    │   │   └───wrapper
    │   └───src
    │       ├───main
    │       │   ├───java
    │       │   │   └───com
    │       │   │       └───apsi_projekt
    │       │   │           └───notification_service
    │       │   │               ├───rest
    │       │   │               └───security
    │       │   └───resources
    │       └───test
    │           └───java
    │               └───com
    │                   └───apsi_projekt
    │                       └───notification-service
    ├───recommendation-service
    │   ├───.gradle
    │   │   ├───8.11.1
    │   │   │   ├───checksums
    │   │   │   ├───executionHistory
    │   │   │   ├───expanded
    │   │   │   ├───fileChanges
    │   │   │   ├───fileHashes
    │   │   │   └───vcsMetadata
    │   │   ├───buildOutputCleanup
    │   │   └───vcs-1
    │   ├───build
    │   │   └───reports
    │   │       └───problems
    │   ├───gradle
    │   │   └───wrapper
    │   └───src
    │       ├───main
    │       │   ├───java
    │       │   │   └───com
    │       │   │       └───apsi_projekt
    │       │   │           └───recommendation_service
    │       │   │               └───rest
    │       │   └───resources
    │       └───test
    │           └───java
    │               └───com
    │                   └───apsi_projekt
    │                       └───recommendation-service
    ├───user-service
    │   ├───.gradle
    │   │   ├───8.11.1
    │   │   │   ├───checksums
    │   │   │   ├───executionHistory
    │   │   │   ├───expanded
    │   │   │   ├───fileChanges
    │   │   │   ├───fileHashes
    │   │   │   └───vcsMetadata
    │   │   ├───buildOutputCleanup
    │   │   └───vcs-1
    │   ├───build
    │   │   ├───classes
    │   │   │   └───java
    │   │   │       └───main
    │   │   │           └───com
    │   │   │               └───apsi_projekt
    │   │   │                   └───user_service
    │   │   │                       ├───controllers
    │   │   │                       ├───models
    │   │   │                       ├───payload
    │   │   │                       │   ├───request
    │   │   │                       │   └───response
    │   │   │                       ├───repositories
    │   │   │                       ├───rest
    │   │   │                       └───security
    │   │   │                           ├───jwt
    │   │   │                           └───services
    │   │   ├───generated
    │   │   │   └───sources
    │   │   │       ├───annotationProcessor
    │   │   │       │   └───java
    │   │   │       │       └───main
    │   │   │       └───headers
    │   │   │           └───java
    │   │   │               └───main
    │   │   ├───reports
    │   │   │   └───problems
    │   │   ├───resources
    │   │   │   └───main
    │   │   └───tmp
    │   │       └───compileJava
    │   │           └───compileTransaction
    │   │               ├───backup-dir
    │   │               └───stash-dir
    │   ├───gradle
    │   │   └───wrapper
    │   └───src
    │       ├───main
    │       │   ├───java
    │       │   │   └───com
    │       │   │       └───apsi_projekt
    │       │   │           └───user_service
    │       │   │               ├───controllers
    │       │   │               ├───models
    │       │   │               ├───payload
    │       │   │               │   ├───request
    │       │   │               │   └───response
    │       │   │               ├───repositories
    │       │   │               ├───rest
    │       │   │               └───security
    │       │   │                   ├───jwt
    │       │   │                   └───services
    │       │   └───resources
    │       └───test
    │           └───java
    │               └───com
    │                   └───apsi_projekt
    │                       └───user_service
    └───vehicle-service
        ├───.gradle
        │   ├───8.11.1
        │   │   ├───checksums
        │   │   ├───executionHistory
        │   │   ├───expanded
        │   │   ├───fileChanges
        │   │   ├───fileHashes
        │   │   └───vcsMetadata
        │   ├───buildOutputCleanup
        │   └───vcs-1
        ├───build
        │   └───reports
        │       └───problems
        ├───gradle
        │   └───wrapper
        └───src
            ├───main
            │   ├───java
            │   │   └───com
            │   │       └───apsi_projekt
            │   │           └───vehicle_service
            │   │               ├───config
            │   │               ├───model
            │   │               ├───repository
            │   │               ├───rest
            │   │               ├───security
            │   │               └───service
            │   └───resources
            └───test
                └───java
                    └───com
                        └───apsi_projekt
                            └───vehicle_service
```