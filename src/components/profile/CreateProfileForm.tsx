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
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-text cursor-pointer"
          >
            <ArrowLeft size={15} /> Back
          </button>
        )}

        <h2 className="text-lg font-semibold text-text">Create a profile</h2>
        <p className="mt-1 text-sm text-muted">Your progress is saved on this device only.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-faint">
              Display name
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              placeholder="e.g. Ada"
              className="w-full rounded-lg border border-border bg-bg-raised px-3.5 py-2.5 text-sm text-text placeholder:text-faint outline-none transition-colors focus:border-accent/60"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-faint">Avatar</label>
            <div className="flex flex-wrap gap-2">
              {AVATARS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setAvatar(emoji)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-lg transition-all cursor-pointer ${
                    avatar === emoji
                      ? "bg-accent-soft ring-2 ring-accent scale-105"
                      : "bg-bg-raised ring-1 ring-border hover:ring-border-strong"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-faint">
              Accent color
            </label>
            <div className="flex flex-wrap gap-2">
              {HUES.map((h) => (
                <button
                  type="button"
                  key={h}
                  onClick={() => setHue(h)}
                  aria-label={`Hue ${h}`}
                  className="h-8 w-8 rounded-full transition-transform cursor-pointer"
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
