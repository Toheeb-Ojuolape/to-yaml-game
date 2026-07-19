import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Braces, Flame, Moon, Repeat, Sparkles, Sun } from "lucide-react";
import { useProfile } from "../../context/ProfileContext";
import { useTheme } from "../../hooks/useTheme";
import { IconButton } from "../ui/IconButton";

export function Header() {
  const { activeProfile, switchProfile } = useProfile();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-border bg-bg/85 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <NavLink to="/play" className="text-text flex items-center gap-2 no-underline">
            <span className="bg-accent-soft text-accent flex h-8 w-8 items-center justify-center rounded-lg">
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

        <div className="flex items-center gap-3">
          {activeProfile && (
            <div className="hidden items-center gap-3 sm:flex">
              <Stat icon={<Sparkles size={14} />} value={activeProfile.xp} label="XP" />
              <Stat icon={<Flame size={14} />} value={activeProfile.streak} label="streak" />
            </div>
          )}

          <IconButton
            label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggleTheme}
            className="overflow-hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ opacity: 0, rotate: -60, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 60, scale: 0.6 }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              </motion.span>
            </AnimatePresence>
          </IconButton>

          {activeProfile && (
            <button
              onClick={() => switchProfile("")}
              className="border-border bg-surface text-text hover:border-border-strong flex cursor-pointer items-center gap-2 rounded-full border py-1 pr-3 pl-1 text-sm transition-colors"
              title="Switch profile"
            >
              <span className="bg-accent-soft flex h-7 w-7 items-center justify-center rounded-full text-base">
                {activeProfile.avatarEmoji}
              </span>
              <span className="hidden max-w-[8rem] truncate font-medium sm:inline">{activeProfile.name}</span>
              <Repeat size={13} className="text-faint" />
            </button>
          )}
        </div>
      </div>

      <nav className="border-border flex items-center gap-1 border-t px-4 py-1.5 sm:hidden">
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
              className="bg-accent absolute inset-x-2 -bottom-[7px] h-[2px] rounded-full sm:-bottom-2"
            />
          )}
        </>
      )}
    </NavLink>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="border-border bg-surface text-muted flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs">
      <span className="text-accent">{icon}</span>
      <span className="font-mono-num text-text font-semibold">{value}</span>
      <span>{label}</span>
    </div>
  );
}
