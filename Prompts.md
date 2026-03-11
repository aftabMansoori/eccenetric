Act as a Senior Backend Engineer. I'm building a File Management API for a tech assignment. 
Help me scaffold dedicated a Node.js (TypeScript) backend to handle logic, security, and metadata.

### 1. Architecture & Patterns:
- Use **Layered Architecture**: Controller -> Service -> Repository -> Provider.
- Implement a **Strategy Pattern** for Storage. Create an `IStorageProvider` interface that can be implemented for`GCSStorageProvider` (Google Cloud Storage).
- Use **Client-Side Direct Upload** logic: The backend should generate a GCS Signed URL (V4) for the frontend to upload directly.

### 2. Tech Stack:
- Framework: **Express.js** with **TypeScript**.
- Database: **PostgreSQL** with **Sequelize ORM**.
- Validation: **Zod** for request body/query validation.
- File Handling: **@google-cloud/storage** for GCP.

### 3. Requirements:
- **Database Schema**: An `Asset` table with fields for `id (UUID)`, `originalName`, `storageKey`, `mimeType`, `sizeBytes`, `checksum`, and `status` (PENDING, ACTIVE).
- **Endpoints**:
    - `POST /assets/upload-intent`: Validates metadata and returns a Signed URL + DB record.
    - `PATCH /assets/:id/confirm`: Marks an asset as ACTIVE after frontend upload success.
    - `GET /assets`: List assets with filtering (type, size range) and pagination.
    - `GET /assets/:id`: Retrieve single asset metadata.

### 4. Implementation Details:
- Implement a **Global Error Handler** middleware.
- Use **Dependency Injection** (pass providers into services).
- Include a `docker-compose.yml` for a PostgreSQL instance.
- Ensure the code follows Clean Code principles (DRY, SOLID).

Start by scaffolding the folder structure and the `IStorageProvider` interface.

----------------------------------------

SupaBase.util.ts
AssetService.ts
- use supabase util for db services for CRUD operations in asset services

----------------------------------------