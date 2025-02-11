/* eslint-disable import/prefer-default-export */
import { getCollectedPaidAndPending } from '@/server/utils';

export async function GET() {
  const collectedPaidAndPending = await getCollectedPaidAndPending();

  return collectedPaidAndPending;
}
