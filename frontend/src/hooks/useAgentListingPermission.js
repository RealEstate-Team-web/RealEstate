import { useAuth } from './useAuth';

export const useAgentListingPermission = () => {
  const { user } = useAuth();
  const agentStatus = user?.agentProfileStatus || 'incomplete';
  const canListProperties = agentStatus === 'approved';

  return { canListProperties, agentStatus };
};

export default useAgentListingPermission;