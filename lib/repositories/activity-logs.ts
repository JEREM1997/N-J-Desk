import { supabaseInsert, supabaseSelect } from './base';

interface ActivityLogRow {
  id: string;
  action_type: string;
  message: string;
  client_id: string | null;
  project_id: string | null;
  created_at: string;
}

export interface ActivityLogItem {
  id: string;
  message: string;
  createdAt: string;
}

function toActivity(row: ActivityLogRow): ActivityLogItem {
  return {
    id: row.id,
    message: row.message,
    createdAt: row.created_at
  };
}

export async function listActivityLogs(limit = 30) {
  const rows = await supabaseSelect<ActivityLogRow>(
    'activity_logs',
    `select=id,action_type,message,client_id,project_id,created_at&order=created_at.desc&limit=${limit}`
  );

  return rows.map(toActivity);
}

export async function createActivityLog(input: {
  actionType: string;
  message: string;
  projectId?: string;
  clientId?: string;
}) {
  await supabaseInsert<ActivityLogRow>('activity_logs', {
    action_type: input.actionType,
    message: input.message,
    project_id: input.projectId ?? null,
    client_id: input.clientId ?? null
  });
}
