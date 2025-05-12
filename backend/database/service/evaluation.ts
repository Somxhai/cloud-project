import { safeQuery } from '../../lib/utils.ts';
import { ActivityEvaluation } from '../../type/app.ts';

export const getAllEvaluations = (): Promise<ActivityEvaluation[]> => {
  return safeQuery((_client) => {
    // TODO: เขียน query ดึง evaluation ทั้งหมด
    return Promise.resolve([]);
  }, 'Failed to get all evaluations');
};
