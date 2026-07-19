import type { Profile } from "../../types";

export function ProfileAvatar({ profile, size = 44 }: { profile: Profile; size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.5,
        background: `hsl(${profile.accentHue} 70% 14%)`,
        boxShadow: `0 0 0 1.5px hsl(${profile.accentHue} 70% 45% / 0.5)`,
      }}
    >
      {profile.avatarEmoji}
    </span>
  );
}
