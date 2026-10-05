import { getAdminResources } from '@/lib/actions/resources';
import ResourceManager from '@/components/ResourceManager';
export default async function ReviewPage() { return <ResourceManager resources={await getAdminResources()} review/>; }
