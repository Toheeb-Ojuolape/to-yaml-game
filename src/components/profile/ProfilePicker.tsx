import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2, Braces } from "lucide-react";
import { useProfile } from "../../context/ProfileContext";
import { ProfileAvatar } from "./ProfileAvatar";
import { CreateProfileForm } from "./CreateProfileForm";
import { Card } from "../ui/Card";

export function ProfilePicker() {
  const { profiles, switchProfile, deleteProfile } = useProfile();
  const [creating, setCreating] = useState(profiles.length === 0);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
    <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-8 flex flex-col items-center text-center">
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
          <Braces size={24} strokeWidth={2.25} />
        </span>
        <h1 className="font-mono text-2xl font-semibold tracking-tight text-text">
          to<span className="text-accent">-yaml</span>
        </h1>
        <p className="mt-2 text-sm text-muted">Learn YAML by translating real JSON, level by level.</p>
      </div>

      <AnimatePresence mode="wait">
        {creating ? (
          <CreateProfileForm key="create" onCancel={() => setCreating(false)} showCancel={profiles.length > 0} />
        ) : (
          <motion.div key="pick" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
            <Card className="divide-y divide-border p-2">
              {profiles.map((p) => {
                const levelsCleared = Object.keys(p.progress).length;
                return (
                  <div
                    key={p.id}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface-hover"
                  >
                    <button
                      onClick={() => switchProfile(p.id)}
                      className="flex flex-1 items-center gap-3 text-left cursor-pointer"
                    >
                      <ProfileAvatar profile={p} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-text">{p.name}</span>
                        <span className="block text-xs text-muted">
                          {levelsCleared}/20 levels &middot; {p.xp} XP
                        </span>
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirmId === p.id) {
                          deleteProfile(p.id);
                          setConfirmId(null);
                        } else {
                          setConfirmId(p.id);
                        }
                      }}
                      onBlur={() => setConfirmId(null)}
                      className={`shrink-0 rounded-lg p-2 text-xs transition-colors cursor-pointer ${
                        confirmId === p.id
                          ? "bg-error-soft text-error"
                          : "text-faint opacity-0 hover:bg-surface hover:text-error group-hover:opacity-100"
                      }`}
                      title="Delete profile"
                    >
                      {confirmId === p.id ? "Confirm?" : <Trash2 size={15} />}
                    </button>
                  </div>
                );
              })}
              <button
                onClick={() => setCreating(true)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-muted transition-colors hover:bg-surface-hover hover:text-text cursor-pointer"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-dashed border-border-strong">
                  <Plus size={16} />
                </span>
                New profile
              </button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
