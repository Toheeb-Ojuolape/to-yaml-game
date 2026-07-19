import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Braces, Flame, Repeat, Sparkles } from "lucide-react";
import { useProfile } from "../../context/ProfileContext";

export function Header() {
  const { activeProfile, switchProfile } = useProfile();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <NavLink to="/play" className="flex items-center gap-2 text-text no-underline">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <Braces size={18} strokeWidth={2.25} />
            </span>
            <span className="font-mono text-[15px] font-semibold tracking-tight">
              to<span className="text-accent">-yaml</span>
            </span>
          </NavLink>

          <nav className="hidden items-center gap-1 sm:flex">
            <HeaderLink to="/play">Play</HeaderLink>
            <HeaderLink to="/converter">Converter</HeaderLink>
          </nav>
        </div>

        {activeProfile && (
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 sm:flex">
              <Stat icon={<Sparkles size={14} />} value={activeProfile.xp} label="XP" />
              <Stat icon={<Flame size={14} />} value={activeProfile.streak} label="streak" />
            </div>
            <button
              onClick={() => switchProfile("")}
              className="flex items-center gap-2 rounded-full border border-border bg-surface py-1 pl-1 pr-3 text-sm text-text transition-colors hover:border-border-strong cursor-pointer"
              title="Switch profile"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft text-base">
                {activeProfile.avatarEmoji}
              </span>
              <span className="hidden max-w-[8rem] truncate font-medium sm:inline">{activeProfile.name}</span>
              <Repeat size={13} className="text-faint" />
            </button>
          </div>
        )}
      </div>

      <nav className="flex items-center gap-1 border-t border-border px-4 py-1.5 sm:hidden">
        <HeaderLink to="/play">Play</HeaderLink>
        <HeaderLink to="/converter">Converter</HeaderLink>
      </nav>
    </header>
  );
}

function HeaderLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative rounded-md px-3 py-1.5 text-sm font-medium no-underline transition-colors ${
          isActive ? "text-text" : "text-muted hover:text-text"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {children}
          {isActive && (
            <motion.span
              layoutId="nav-underline"
              className="absolute inset-x-2 -bottom-[7px] h-[2px] rounded-full bg-accent sm:-bottom-2"
            />
          )}
        </>
      )}
    </NavLink>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
      <span className="text-accent">{icon}</span>
      <span className="font-mono-num font-semibold text-text">{value}</span>
      <span>{label}</span>
    </div>
  );
}
