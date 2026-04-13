import { ProjectDocument, ProjectPhoto } from '@/lib/types';
import { supabaseInsert, supabaseSelect, supabaseUploadObject } from './base';

interface DocumentRow {
  id: string;
  project_id: string;
  file_name: string;
  category: ProjectDocument['category'] | null;
  file_path: string;
  created_at: string;
}

interface PhotoRow {
  id: string;
  project_id: string;
  phase: ProjectPhoto['phase'] | null;
  caption: string | null;
  file_path: string;
  created_at: string;
}

function toDocument(row: DocumentRow): ProjectDocument {
  return {
    id: row.id,
    projectId: row.project_id,
    fileName: row.file_name,
    category: row.category ?? 'autre',
    uploadedAt: row.created_at.slice(0, 10)
  };
}

function toPhoto(row: PhotoRow): ProjectPhoto {
  return {
    id: row.id,
    projectId: row.project_id,
    phase: row.phase ?? 'avant',
    caption: row.caption ?? '',
    uploadedAt: row.created_at.slice(0, 10)
  };
}

function buildObjectPath(projectId: string, filename: string) {
  const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${projectId}/${Date.now()}_${safeFilename}`;
}

export async function listDocuments() {
  const rows = await supabaseSelect<DocumentRow>('documents', 'select=id,project_id,file_name,category,file_path,created_at&order=created_at.desc');
  return rows.map(toDocument);
}

export async function listPhotos() {
  const rows = await supabaseSelect<PhotoRow>('photos', 'select=id,project_id,phase,caption,file_path,created_at&order=created_at.desc');
  return rows.map(toPhoto);
}

export async function createDocumentWithFile(input: {
  file: File;
  projectId: string;
  category: ProjectDocument['category'];
  bucket?: string;
}) {
  const bucket = input.bucket ?? 'project-files';
  const objectPath = buildObjectPath(input.projectId, input.file.name);

  await supabaseUploadObject(bucket, objectPath, input.file);

  const row = await supabaseInsert<DocumentRow>('documents', {
    project_id: input.projectId,
    file_name: input.file.name,
    category: input.category,
    file_path: objectPath,
    mime_type: input.file.type || null,
    size_bytes: input.file.size
  });

  return toDocument(row);
}

export async function createPhotoWithFile(input: {
  file: File;
  projectId: string;
  phase: ProjectPhoto['phase'];
  caption: string;
  bucket?: string;
}) {
  const bucket = input.bucket ?? 'project-files';
  const objectPath = buildObjectPath(input.projectId, input.file.name);

  await supabaseUploadObject(bucket, objectPath, input.file);

  const row = await supabaseInsert<PhotoRow>('photos', {
    project_id: input.projectId,
    phase: input.phase,
    caption: input.caption || null,
    file_path: objectPath
  });

  return toPhoto(row);
}
