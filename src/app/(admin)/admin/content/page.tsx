import { getAdminResources } from '@/lib/actions/resources';
import ResourceManager from '@/components/ResourceManager';
export default async function ContentPage() { return <ResourceManager resources={await getAdminResources()}/>; }
