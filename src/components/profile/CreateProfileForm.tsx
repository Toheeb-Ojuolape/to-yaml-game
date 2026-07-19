import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useProfile } from "../../context/ProfileContext";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

const AVATARS = ["🦊", "🐙", "🦉", "🐢", "🐧", "🦁", "🐳", "🐼", "🦄", "🐝", "🤖", "👾"];
const HUES = [32, 200, 260, 150, 340, 10, 190, 280];

export function CreateProfileForm({ onCancel, showCancel }: { onCancel: () => void; showCancel: boolean }) {
  const { createProfile } = useProfile();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [hue, setHue] = useState(HUES[0]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    createProfile(name, avatar, hue);
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="p-6 sm:p-8">
        {showCancel && (
          <button
            onClick={onCancel}
            className="text-muted hover:text-text mb-4 inline-flex cursor-pointer items-center gap-1.5 text-sm"
          >
            <ArrowLeft size={15} /> Back
          </button>
        )}

        <h2 className="text-text text-lg font-semibold">Create a profile</h2>
        <p className="text-muted mt-1 text-sm">Your progress is saved on this device only.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label className="text-faint mb-2 block text-xs font-medium tracking-wide uppercase">
              Display name
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              placeholder="e.g. Tobi"
              className="border-border bg-bg-raised text-text placeholder:text-faint focus:border-accent/60 w-full rounded-lg border px-3.5 py-2.5 text-sm transition-colors outline-none"
            />
          </div>

          <div>
            <label className="text-faint mb-2 block text-xs font-medium tracking-wide uppercase">
              Avatar
            </label>
            <div className="flex flex-wrap gap-2">
              {AVATARS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setAvatar(emoji)}
                  className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-lg transition-all ${
                    avatar === emoji
                      ? "bg-accent-soft ring-accent scale-105 ring-2"
                      : "bg-bg-raised ring-border hover:ring-border-strong ring-1"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-faint mb-2 block text-xs font-medium tracking-wide uppercase">
              Accent color
            </label>
            <div className="flex flex-wrap gap-2">
              {HUES.map((h) => (
                <button
                  type="button"
                  key={h}
                  onClick={() => setHue(h)}
                  aria-label={`Hue ${h}`}
                  className="h-8 w-8 cursor-pointer rounded-full transition-transform"
                  style={{
                    background: `hsl(${h} 70% 45%)`,
                    outline: hue === h ? `2px solid hsl(${h} 70% 65%)` : "none",
                    outlineOffset: 2,
                    transform: hue === h ? "scale(1.1)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          </div>

          <Button type="submit" fullWidth disabled={!name.trim()}>
            Start playing
          </Button>
        </form>
      </Card>
    </motion.div>
  );
}
