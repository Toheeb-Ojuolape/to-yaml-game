import { useProfile } from "../context/ProfileContext";
import { ProfilePicker } from "../components/profile/ProfilePicker";
import { LevelMap } from "../components/game/LevelMap";

export function HomePage() {
  const { activeProfile } = useProfile();
  return activeProfile ? <LevelMap /> : <ProfilePicker />;
}
