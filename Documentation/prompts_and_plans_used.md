Prompt:   
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

SupaBase.util.ts
AssetService.ts
- use supabase util for db services for CRUD operations in asset services

Changes Made:
Created Type Definitions: Created a new file 

backend/src/types/asset.ts
 to define the AssetStatus enum and 

Asset
 interface. This ensures type safety across the service and makes the code cleaner.
Integrated Supabase in 

AssetService
:

prepareUpload
: Now inserts a new record into the assets table with a PENDING status before generating the storage upload URL.

confirmUpload
: Updates the asset status to ACTIVE in the database.

listAssets
: Implemented complex querying with filters (mimeType, size range) and pagination (limit, offset) using the Supabase client.

getAsset
: Retrieves a single asset by its ID.

----------------------------------------


App.tsx
asset.routes.ts#L14
AssetController.ts#L8-16
 
- create constant file, add api url localhost:3000 as dam api url
- use axios for api calling
- update the handlers, no local storing of images is required

Summary of Changes:
API Constants: Created a new file 

frontend/src/constants/api.ts
 with the base API URL: http://localhost:3000/api/v1.
Frontend Updates (

App.tsx
):
Axios Integration: Replaced dummy logic with axios for all API calls.
Asset Persistence: Removed localStorage usage. Assets are now fetched from the backend on component mount.
Real Upload Flow: Implemented a 3-step upload handler:
Submit intent to backend (POST /assets/upload-intent).
Upload file directly to Google Cloud Storage using the signed URL.
Confirm upload with backend (POST /assets/confirm/:id).
Cloud-based Assets: Removed the use of FileReader.readAsDataURL. Images are now loaded via a view proxy URL provided by the backend: /assets/:id/view.
Backend Enhancements:
Synced Routes: Updated 

asset.routes.ts
 to match the frontend expectations, including POST /confirm/:id and DELETE /:id.
View Proxy: Implemented GET /assets/:id/view in the controller, which generates a signed GCS URL and performs a 302 redirect for the browser to display images directly.
Service Methods: Added 

deleteAsset
 and 

generateViewUrl
 to the 

AssetService
 and integrated them with the 

GCSStorageProvider

----------------------------------------

- i want to make app.tsx lightweight by moving most of the indiviual handlers and major components like each tab contents to individual components files
- instead of adding all the components in app.tsx, create page folder and add DAM page in which add all the DAM components, add react routing for /dam or / load dam page
- also for start management implement Redux toolkit
- for list fetching api, implement RTQ

Refer Implemenation plan

----------------------------------------

- after login the session returned should be used to sent in request headers to backend in every request, write interceptor for it
- also if any api returns 401, they should be redirected to signin page