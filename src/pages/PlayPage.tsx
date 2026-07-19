import { useProfile } from "../context/ProfileContext";
import { ProfilePicker } from "../components/profile/ProfilePicker";
import { PlayScreen } from "../components/game/PlayScreen";

export function PlayPage() {
  const { activeProfile } = useProfile();
  return activeProfile ? <PlayScreen /> : <ProfilePicker />;
}
