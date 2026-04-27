import React, { useState, useEffect, useRef } from "react";
import {
  Home, FileText, Bell, ChevronRight, ChevronLeft, ChevronDown,
  Search, Plus, Check, X, Shield, Wallet, Stethoscope, FileSignature,
  Download, Share2, Eye, AlertTriangle, Clock, Send, Calendar as CalendarIcon,
  Building2, Users, LayoutGrid, Inbox, Edit3, FolderPlus,
  BellRing, FileCheck2, Save, ScanLine, Newspaper, CalendarDays,
  UserCircle2, Smartphone, Monitor, Tablet, Info, CheckCircle2,
  Image as ImageIcon, MessageSquare, MoreHorizontal, Layers,
  Archive, EyeOff, Filter
} from "lucide-react";

// ─── MODE CONTEXT ─────────────────────────────────────────────────────────────
const ModeContext = React.createContext("mobile");

// ─── DESIGN TOKENS — 100 % charte DomusVi ────────────────────────────────────
// Sources : 231018_notre_identité_domusvi_fr — page 46
const C = {
  bg:       "#FCF1EE",  // rose pâle web officiel
  card:     "#FFFFFF",
  pill:     "#FDDDD9",  // rose pâle pilule
  pill2:    "#FBDCD9",
  ink:      "#360A06",  // brun foncé profond
  ink2:     "#6B5B58",  // brun grisé secondaire
  ink3:     "#A8908C",  // brun très clair (derived, warm)
  accent:   "#C2185B",  // badge / accent fort
  urgent:   "#FF9EA1",  // "à faire / urgent" — charte
  ok:       "#E3ECC2",  // vert tendre "validé" — charte
  okDeep:   "#EEF4E2",  // vert légèrement plus soutenu — charte
  blue:     "#6BC5DD",  // bleu doux "info" — charte
  blueSoft: "#C4E6F9",  // bleu très clair — charte
  info:     "#FFF1C2",  // jaune pâle "nouveau" — charte
  infoDeep: "#FFF8E6",  // jaune très pâle — charte
  neutral:  "#F5F5F0",  // gris neutre chaud — charte
  neutral2: "#EBEAE3",  // gris légèrement plus foncé — charte
  border:   "#EDE0DC",  // contour, dérivé rose pâle
};
// Gradient CTA — uniquement sur boutons d'action primaires
const GRAD = "linear-gradient(135deg, #E91E63 0%, #FF5722 100%)";

// ─── ATOMS ───────────────────────────────────────────────────────────────────
const Btn = ({ children, icon: I, full, sm, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled}
    style={{ background: GRAD, opacity: disabled ? 0.55 : 1 }}
    className={`${full ? "w-full" : ""} ${sm ? "h-11 px-5 text-[13px]" : "h-14 px-6 text-[15px]"}
      rounded-2xl text-white font-bold flex items-center justify-center gap-2
      shadow-[0_8px_20px_-8px_rgba(233,30,99,0.4)]
      hover:shadow-[0_10px_24px_-6px_rgba(233,30,99,0.52)]
      active:scale-[0.98] transition-all duration-200`}>
    {I && <I size={sm ? 16 : 18} strokeWidth={2} />}{children}
  </button>
);

const BtnOutline = ({ children, icon: I, full, sm, onClick }) => (
  <button onClick={onClick}
    style={{ borderColor: C.border, color: C.ink }}
    className={`${full ? "w-full" : ""} ${sm ? "h-11 px-5 text-[13px]" : "h-14 px-6 text-[15px]"}
      rounded-2xl font-semibold flex items-center justify-center gap-2
      border-[1.5px] bg-white hover:bg-[#FAF5F3]
      active:scale-[0.98] transition-all duration-200`}>
    {I && <I size={sm ? 16 : 18} strokeWidth={2} />}{children}
  </button>
);

// Bouton pour action destructive (refus) — sans rouge, 100% charte
const BtnWarn = ({ children, icon: I, full, sm, onClick }) => (
  <button onClick={onClick}
    style={{ backgroundColor: C.urgent, color: C.ink, borderColor: C.accent }}
    className={`${full ? "w-full" : ""} ${sm ? "h-11 px-5 text-[13px]" : "h-14 px-6 text-[15px]"}
      rounded-2xl font-bold flex items-center justify-center gap-2
      border-[1.5px] hover:opacity-90
      active:scale-[0.98] transition-all duration-200`}>
    {I && <I size={sm ? 16 : 18} strokeWidth={2} />}{children}
  </button>
);

const Card = ({ children, className = "", onClick, p = "p-5" }) => (
  <div onClick={onClick}
    style={{ backgroundColor: C.card }}
    className={`rounded-3xl ${p} shadow-[0_2px_12px_-6px_rgba(54,10,6,0.09)]
      ${onClick ? "cursor-pointer hover:shadow-[0_6px_20px_-8px_rgba(54,10,6,0.15)] hover:-translate-y-0.5" : ""}
      transition-all duration-200 ${className}`}>
    {children}
  </div>
);

const IconCircle = ({ icon: I, size = 48 }) => (
  <div style={{ width: size, height: size, backgroundColor: C.pill }}
    className="rounded-full flex items-center justify-center shrink-0">
    <I size={Math.round(size * 0.4)} strokeWidth={1.8} style={{ color: C.accent }} />
  </div>
);

const Av = ({ init, size = 36, solid }) => (
  <div style={{
    width: size, height: size,
    backgroundColor: solid ? C.accent : C.pill,
    color: solid ? "white" : C.accent,
    fontSize: Math.round(size * 0.38),
  }} className="rounded-full flex items-center justify-center font-bold shrink-0">{init}</div>
);

const Tag = ({ label, tone = "info" }) => {
  const palette = {
    new:     { bg: C.accent,   fg: "white" },
    info:    { bg: C.info,     fg: C.ink2 },
    urgent:  { bg: C.urgent,   fg: C.ink },
    ok:      { bg: C.ok,       fg: C.ink },
    okBlue:  { bg: C.blueSoft, fg: C.ink2 },
    pending: { bg: C.infoDeep, fg: C.ink2 },
    soft:    { bg: C.pill,     fg: C.accent },
    neutral: { bg: C.neutral,  fg: C.ink2 },
  };
  const s = palette[tone] || palette.info;
  return (
    <span style={{ backgroundColor: s.bg, color: s.fg }}
      className="inline-flex items-center px-2.5 py-[3px] rounded-full text-[11px] font-bold whitespace-nowrap">
      {label}
    </span>
  );
};

const Notif = ({ n = 0, onClick }) => (
  <button onClick={onClick} style={{ backgroundColor: "white" }}
    className="w-11 h-11 rounded-full flex items-center justify-center relative
      shadow-[0_2px_8px_-4px_rgba(54,10,6,0.12)] shrink-0">
    <Bell size={18} strokeWidth={1.8} style={{ color: C.ink }} />
    {n > 0 && (
      <span style={{ backgroundColor: C.accent }}
        className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1
          rounded-full text-[10px] font-black text-white flex items-center justify-center
          border-2 border-white">{n}</span>
    )}
  </button>
);

const LotBanner = () => null;

const ModuleNotice = () => (
  <div className="absolute inset-0 flex items-end justify-center pb-36 px-5 z-50 pointer-events-none">
    <div style={{ backgroundColor: C.ink, color: "white" }}
      className="rounded-2xl px-4 py-3 text-[13px] font-semibold shadow-xl">
      Ce module est prototypé séparément
    </div>
  </div>
);

// ─── NOTIFICATION PANEL ───────────────────────────────────────────────────────
const NotifPanel = ({ open, onClose }) => {
  const items = [
    { icon: FileSignature, title: "Contrat de séjour 2026 à signer", sub: "Avant le 15/05/2026 · Les Cyclamens", tone: "urgent" },
    { icon: FileText,      title: "Facture novembre 2026 disponible", sub: "Il y a 2 heures",                    tone: "new" },
    { icon: AlertTriangle, title: "Attestation mutuelle à renouveler", sub: "Échéance dans 12 jours",            tone: "urgent" },
    { icon: FileCheck2,    title: "Justificatif d'assurance demandé", sub: "Hier · Les Cyclamens — Challex",    tone: "urgent" },
  ];
  return (
    <BottomSheet open={open} onClose={onClose} title="Notifications">
      <div className="space-y-2">
        {items.map((n, i) => (
          <button key={i} onClick={onClose}
            className="w-full flex items-start gap-3 rounded-2xl p-3 text-left active:opacity-80 transition-opacity"
            style={{ backgroundColor: C.bg }}>
            <div style={{ backgroundColor: C.pill }}
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
              <n.icon size={17} style={{ color: C.accent }} strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <div style={{ color: C.ink }} className="text-[13px] font-bold leading-tight">{n.title}</div>
              <div style={{ color: C.ink2 }} className="text-[11px] mt-0.5">{n.sub}</div>
            </div>
            <span style={{ backgroundColor: n.tone === "new" ? C.accent : C.urgent }}
              className="w-2 h-2 rounded-full mt-1.5 shrink-0" />
          </button>
        ))}
        <div style={{ color: C.ink3 }} className="text-[12px] text-center py-3 font-medium">
          Fin des notifications
        </div>
      </div>
    </BottomSheet>
  );
};

// ─── PROFILE SWITCHER ─────────────────────────────────────────────────────────
const ProfilePanel = ({ open, onClose }) => (
  <BottomSheet open={open} onClose={onClose} title="Choisir un profil">
    <div className="space-y-3">
      <p style={{ color: C.ink2 }} className="text-[13px] mb-1 leading-relaxed">
        Gérez les documents de vos proches depuis un seul compte.
      </p>
      {/* Active profile */}
      <button onClick={onClose}
        className="w-full flex items-center gap-3 rounded-2xl p-4 text-left"
        style={{ backgroundColor: C.pill, border: `1.5px solid ${C.accent}` }}>
        <Av init="JL" size={44} />
        <div className="flex-1 min-w-0">
          <div style={{ color: C.ink }} className="text-[14px] font-bold">Jean Lefebvre</div>
          <div style={{ color: C.ink2 }} className="text-[11px]">Les Cyclamens — Challex · Chambre 24</div>
        </div>
        <Check size={18} style={{ color: C.accent }} strokeWidth={2.5} />
      </button>
      {/* Add */}
      <button onClick={onClose}
        className="w-full flex items-center gap-3 rounded-2xl p-4 text-left"
        style={{ backgroundColor: C.bg, border: `1.5px dashed ${C.border}` }}>
        <div style={{ backgroundColor: "white", border: `1.5px dashed ${C.border}` }}
          className="w-11 h-11 rounded-full flex items-center justify-center shrink-0">
          <Plus size={18} style={{ color: C.ink2 }} />
        </div>
        <span style={{ color: C.ink2 }} className="text-[14px] font-semibold">Ajouter un proche</span>
      </button>
      <div style={{ backgroundColor: C.info }} className="rounded-2xl p-3 flex gap-2.5 mt-1">
        <Info size={13} style={{ color: C.ink2 }} className="shrink-0 mt-0.5" />
        <span style={{ color: C.ink2 }} className="text-[11px] leading-relaxed">
          La gestion multi-résidents est disponible dans la version complète de FamilyVi.
        </span>
      </div>
    </div>
  </BottomSheet>
);

// ─── RESIDENT PICKER ─────────────────────────────────────────────────────────
const RESIDENTS_LIST = [
  { init: "JL", name: "Jean Lefebvre",   room: "Ch. 24", refs: "Marie & Paul Lefebvre" },
  { init: "YR", name: "Yvonne Roux",     room: "Ch. 18", refs: "Christophe Roux" },
  { init: "HD", name: "Henri Dubreuil",  room: "Ch. 31", refs: "Julie Dubreuil" },
  { init: "SB", name: "Suzanne Bernard", room: "Ch. 09", refs: "Pierre Bernard" },
  { init: "RS", name: "Robert Soulier",  room: "Ch. 12", refs: "Alice Soulier" },
];

const ResidentPicker = ({ open, current, onSelect, onClose }) => (
  <BottomSheet open={open} onClose={onClose} title="Choisir un résident">
    <div className="space-y-2">
      {RESIDENTS_LIST.map((r, i) => (
        <button key={i} onClick={() => onSelect(r)}
          className="w-full flex items-center gap-3 rounded-2xl p-3.5 text-left transition-opacity active:opacity-80"
          style={{
            backgroundColor: current?.name === r.name ? C.pill : C.bg,
            border: current?.name === r.name ? `1.5px solid ${C.accent}` : "1.5px solid transparent",
          }}>
          <Av init={r.init} size={40} />
          <div className="flex-1 min-w-0">
            <div style={{ color: C.ink }} className="text-[13px] font-bold">{r.name}</div>
            <div style={{ color: C.ink2 }} className="text-[11px]">{r.room} · Référents : {r.refs}</div>
          </div>
          {current?.name === r.name && <Check size={16} style={{ color: C.accent }} strokeWidth={2.5} />}
        </button>
      ))}
    </div>
  </BottomSheet>
);

// ─── ROLE PANEL ───────────────────────────────────────────────────────────────
const STAFF_ROLES = [
  { id: "manager",        label: "Manager",        sub: "Directeur · accès complet",               note: "Onglets : À traiter · Bibliothèque · Demandes · Administration" },
  { id: "staff_premium",  label: "Staff premium",  sub: "ASD / IDE · droits étendus",              note: "Onglets : À traiter · Bibliothèque · Demandes (pas d'Administration)" },
  { id: "staff_standard", label: "Staff standard", sub: "AS / Agent hôtelier · droits restreints", note: "Onglet : À traiter uniquement" },
];

const RolePanel = ({ open, staffRole, onSelect, onClose }) => (
  <BottomSheet open={open} onClose={onClose} title="Simuler un profil staff">
    <div className="space-y-3">
      <p style={{ color: C.ink2 }} className="text-[13px] mb-1 leading-relaxed">
        Changez de profil pour voir comment les onglets et droits s'adaptent.
      </p>
      {STAFF_ROLES.map(r => (
        <button key={r.id} onClick={() => onSelect(r.id)}
          className="w-full flex items-center gap-3 rounded-2xl p-4 text-left transition-opacity active:opacity-80"
          style={{
            backgroundColor: staffRole === r.id ? C.pill : C.bg,
            border: staffRole === r.id ? `1.5px solid ${C.accent}` : "1.5px solid transparent",
          }}>
          <Av init={r.id === "manager" ? "M" : r.id === "staff_premium" ? "SP" : "SS"}
            size={40} solid={staffRole === r.id} />
          <div className="flex-1 min-w-0">
            <div style={{ color: C.ink }} className="text-[14px] font-bold">{r.label}</div>
            <div style={{ color: C.ink2 }} className="text-[11px]">{r.sub}</div>
            <div style={{ color: C.accent }} className="text-[11px] font-semibold mt-0.5">{r.note}</div>
          </div>
          {staffRole === r.id && <Check size={18} style={{ color: C.accent }} strokeWidth={2.5} />}
        </button>
      ))}
      <div style={{ backgroundColor: C.info }} className="rounded-2xl p-3 flex gap-2.5 mt-1">
        <Info size={13} style={{ color: C.ink2 }} className="shrink-0 mt-0.5" />
        <span style={{ color: C.ink2 }} className="text-[11px] leading-relaxed">
          En production, le profil est lié au compte utilisateur et géré par le Manager.
        </span>
      </div>
    </div>
  </BottomSheet>
);

// ─── BOTTOM SHEET ─────────────────────────────────────────────────────────────
const BottomSheet = ({ open, onClose, title, children, tall = false }) => {
  const appMode = React.useContext(ModeContext);
  const isModal = appMode === "desktop"; // desktop → centered modal; mobile/tablet → bottom sheet

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() =>
        requestAnimationFrame(() => setVisible(true))
      );
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 350);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!mounted) return null;

  /* ── Desktop : centered dialog ── */
  if (isModal) {
    return (
      <>
        <div onClick={onClose} className="absolute inset-0 z-40"
          style={{
            backgroundColor: "rgba(54,10,6,0.42)",
            opacity: visible ? 1 : 0,
            backdropFilter: visible ? "blur(3px)" : "none",
            transition: "opacity 200ms ease",
            pointerEvents: visible ? "auto" : "none",
          }} />
        <div style={{
            backgroundColor: "white",
            position: "absolute",
            top: "50%", left: "50%",
            transform: visible ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -48%) scale(0.97)",
            opacity: visible ? 1 : 0,
            transition: visible
              ? "transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 180ms ease"
              : "transform 160ms ease, opacity 140ms ease",
            width: "min(520px, 90%)",
            maxHeight: "82vh",
          }}
          className="z-50 rounded-[20px] shadow-[0_24px_60px_-16px_rgba(54,10,6,0.30)] flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 flex items-start justify-between shrink-0"
            style={{ borderBottom: `1px solid ${C.border}` }}>
            <h3 style={{ color: C.ink }} className="text-[20px] font-extrabold leading-tight pr-4">{title}</h3>
            <button onClick={onClose}
              style={{ backgroundColor: C.bg }}
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <X size={16} style={{ color: C.ink2 }} strokeWidth={2.5} />
            </button>
          </div>
          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {children}
          </div>
        </div>
      </>
    );
  }

  /* ── Mobile / Tablet : bottom sheet ── */
  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 z-40"
        style={{
          backgroundColor: "rgba(54,10,6,0.38)",
          opacity: visible ? 1 : 0,
          backdropFilter: visible ? "blur(2px)" : "none",
          transition: "opacity 250ms ease",
          pointerEvents: visible ? "auto" : "none",
        }} />
      {/* Sheet */}
      <div style={{
          backgroundColor: "white",
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: visible
            ? "transform 380ms cubic-bezier(0.32, 0.72, 0, 1)"
            : "transform 280ms cubic-bezier(0.4, 0, 1, 1)",
        }}
        className={`absolute bottom-0 left-0 right-0 z-50 rounded-t-[28px]
          shadow-[0_-8px_40px_-12px_rgba(54,10,6,0.22)] flex flex-col
          ${tall ? "max-h-[88%]" : "max-h-[80%]"}`}>
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: C.border }} />
        </div>
        {/* Header */}
        <div className="px-5 pt-2 pb-4 flex items-start justify-between shrink-0"
          style={{ borderBottom: `1px solid ${C.border}` }}>
          <h3 style={{ color: C.ink }} className="text-[18px] font-extrabold leading-tight pr-4">{title}</h3>
          <button onClick={onClose}
            style={{ backgroundColor: C.bg }}
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <X size={16} style={{ color: C.ink2 }} strokeWidth={2.5} />
          </button>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {children}
        </div>
      </div>
    </>
  );
};

// ─── FRAMES ──────────────────────────────────────────────────────────────────
const PhoneFrame = ({ children }) => (
  <div className="flex justify-center py-8 px-4">
    <div
      style={{
        borderColor: "#222",
        boxShadow: "0 20px 60px -16px rgba(54,10,6,0.2)",
        height: "844px",
      }}
      className="w-[390px] rounded-[48px] border-[10px] bg-black overflow-hidden"
    >
      <div style={{ backgroundColor: C.bg, width: "100%", height: "100%" }}
        className="mobile-view rounded-[38px] overflow-hidden relative flex flex-col">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[34px] bg-black rounded-b-[20px] z-50 shrink-0" />
        {children}
      </div>
    </div>
  </div>
);

const DesktopFrame = ({ children }) => (
  <div className="w-full">
    {/* Browser chrome — full width */}
    <div style={{ backgroundColor: "#F8F1EF", borderBottom: `1px solid ${C.border}` }}
      className="h-9 px-6 flex items-center gap-2 shrink-0">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-[#FF6058]" />
        <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
        <div className="w-3 h-3 rounded-full bg-[#27CA40]" />
      </div>
      <div style={{ backgroundColor: "white", color: C.ink2, border: `1px solid ${C.border}` }}
        className="ml-4 px-3 py-1 rounded text-[11px] font-medium flex items-center gap-1.5">
        <Shield size={10} />staff.familyvi.domusvi.fr
      </div>
    </div>
    {/* Content — hauteur = 100vh moins topbar (76px) moins chrome (36px) */}
    <div style={{ backgroundColor: C.bg, height: "calc(100vh - 112px)" }}
      className="flex overflow-hidden w-full relative">
      {children}
    </div>
  </div>
);

const TabletFrame = ({ children }) => (
  <div className="w-full">
    {/* Barre de statut tablette simulée */}
    <div style={{ backgroundColor: "#F8F1EF", borderBottom: `1px solid ${C.border}` }}
      className="h-9 px-6 flex items-center justify-between shrink-0">
      <div style={{ color: C.ink2 }} className="text-[11px] font-medium">FamilyVi Staff · Tablette</div>
      <div className="flex items-center gap-3">
        <div className="flex gap-1 items-center">
          {[1,2,3,4].map(i => (
            <div
              key={i}
              style={{
                width: 4,
                height: 4 + i * 2,
                backgroundColor: C.ink2,
                borderRadius: 2,
              }}
              className={`rounded-sm ${i <= 3 ? "w-1" : "w-1 opacity-30"}`}
            />
          ))}
        </div>
        <div style={{ color: C.ink2 }} className="text-[11px] font-medium">10:41</div>
      </div>
    </div>
    {/* Content — hauteur = 100vh moins topbar (76px) moins barre statut (36px) */}
    <div style={{ backgroundColor: C.bg, height: "calc(100vh - 112px)" }}
      className="flex overflow-hidden w-full relative">
      {children}
    </div>
  </div>
);

// ─── FAMILLE LAYOUT ──────────────────────────────────────────────────────────
const FHeader = ({ onBell, onProfile }) => (
  <header className="pt-10 pb-3 px-5 flex items-center justify-between shrink-0">
    <button onClick={onProfile} style={{ backgroundColor: C.pill }}
      className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full active:opacity-80 transition-opacity">
      <Av init="ML" size={30} />
      <span style={{ color: C.ink }} className="text-sm font-semibold">Marie</span>
      <ChevronDown size={14} style={{ color: C.ink2 }} strokeWidth={2} />
    </button>
    <Notif n={4} onClick={onBell} />
  </header>
);

const FNav = ({ active = "compte", onNav }) => {
  const items = [
    { id: "accueil",   label: "Accueil",   icon: Home },
    { id: "gazette",   label: "Gazette",   icon: Newspaper },
    { id: "residence", label: "Résidence", icon: Building2 },
    { id: "compte",    label: "Compte",    icon: UserCircle2 },
  ];
  return (
    <nav style={{ backgroundColor: "white", borderTop: `1px solid ${C.border}` }}
      className="px-2 pt-2 pb-6 flex items-center justify-around shrink-0">
      {items.map(({ id, label, icon: Icon }) => {
        const on = id === active;
        return (
          <button key={id} onClick={() => onNav(id)}
            className="flex flex-col items-center gap-0.5">
            <div style={on ? { backgroundColor: C.pill } : {}} className="px-3 py-1.5 rounded-full">
              <Icon size={21} strokeWidth={on ? 2.2 : 1.7}
                style={{ color: on ? C.accent : C.ink2 }} />
            </div>
            <span className="text-[10px] font-semibold"
              style={{ color: on ? C.ink : C.ink2 }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
};

// ─── STAFF LAYOUT ────────────────────────────────────────────────────────────
const Sidebar = ({ active = "documents", compact }) => {
  const items = [
    { id: "accueil",    label: "Accueil",    icon: Home },
    { id: "messagerie", label: "Messagerie", icon: MessageSquare, badge: 4 },
    { id: "gazette",    label: "Gazette",    icon: Newspaper },
    { id: "agenda",     label: "Agenda",     icon: CalendarDays },
    { id: "documents",  label: "Documents",  icon: FileText, badge: 5 },
    { id: "residents",  label: "Résidents",  icon: Users },
    { id: "kpis",       label: "KPIs",       icon: LayoutGrid },
  ];
  return (
    <aside style={{ backgroundColor: "white", borderRight: `1px solid ${C.border}`, height: "100%" }}
      className={`${compact ? "w-[72px]" : "w-[240px]"} shrink-0 flex flex-col`}>
      <div className={`${compact ? "px-3 pt-6 pb-8 justify-center" : "px-5 pt-6 pb-8"} flex items-center gap-2.5 shrink-0`}>
        <div style={{ backgroundColor: C.accent }}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-base shrink-0">D</div>
        {!compact && (
          <div>
            <div style={{ color: C.ink }} className="text-[14px] font-extrabold leading-tight">DomusVi</div>
            <div style={{ color: C.ink2 }} className="text-[10px] font-medium leading-tight">FamilyVi · Staff</div>
          </div>
        )}
      </div>
      <div className={`${compact ? "px-2" : "px-2"} space-y-0.5 flex-1 overflow-y-auto`}>
        {items.map(({ id, label, icon: Icon, badge }) => {
          const on = id === active;
          return (
            <div key={id}
              style={on ? { backgroundColor: C.pill, color: C.ink } : { color: C.ink2 }}
              className={`relative h-10 rounded-xl flex items-center
                ${compact ? "justify-center" : "gap-2.5 px-3"}
                cursor-pointer hover:bg-[#FDF5F3] transition-colors`}>
              {on && <span style={{ backgroundColor: C.accent }}
                className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full" />}
              <Icon size={18} strokeWidth={on ? 2.2 : 1.8} />
              {!compact && (
                <>
                  <span className={`text-[13px] ${on ? "font-bold" : "font-medium"} flex-1`}>{label}</span>
                  {badge && (
                    <span style={{ backgroundColor: C.accent }}
                      className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                      {badge}
                    </span>
                  )}
                </>
              )}
              {compact && badge && (
                <span style={{ backgroundColor: C.accent }}
                  className="absolute top-1 right-1 text-[9px] font-black text-white w-4 h-4
                    rounded-full flex items-center justify-center">{badge}</span>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ borderTop: `1px solid ${C.border}` }}
        className={`${compact ? "px-3 py-4 justify-center" : "px-4 py-4"} flex items-center gap-3 shrink-0`}>
        <Av init="PC" size={34} solid />
        {!compact && (
          <div className="flex-1 min-w-0">
            <div style={{ color: C.ink }} className="text-[13px] font-bold">Pascal Citron</div>
            <div style={{ color: C.ink2 }} className="text-[10px] font-medium">Directeur</div>
          </div>
        )}
      </div>
    </aside>
  );
};

const TopBar = ({ compact, staffRole, onRole }) => {
  const roleLabel = staffRole === "staff_premium" ? "Staff premium" : staffRole === "staff_standard" ? "Staff standard" : "Manager";
  return (
    <header style={{ backgroundColor: "white", borderBottom: `1px solid ${C.border}` }}
      className={`h-14 ${compact ? "px-4" : "px-7"} flex items-center justify-between shrink-0`}>
      <div className="flex items-center gap-3">
        <div style={{ backgroundColor: C.pill, color: C.accent }}
          className="w-8 h-8 rounded-xl flex items-center justify-center">
          <Building2 size={16} strokeWidth={2} />
        </div>
        <div>
          <div style={{ color: C.ink2 }} className="text-[10px] font-medium leading-tight">Résidence</div>
          <div style={{ color: C.ink }} className="text-[13px] font-bold leading-tight flex items-center gap-1">
            Les Cyclamens — Challex <ChevronDown size={13} strokeWidth={2.2} />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div style={{ backgroundColor: C.bg, border: `1px solid ${C.border}` }}
          className={`${compact ? "w-36" : "w-56"} h-9 rounded-xl flex items-center gap-2 px-3`}>
          <Search size={14} style={{ color: C.ink2 }} strokeWidth={2} />
          <input placeholder="Rechercher…" className="bg-transparent text-[13px] outline-none flex-1"
            style={{ color: C.ink }} />
        </div>
        {/* Role badge — cliquable pour simuler un changement de profil */}
        <button onClick={onRole}
          style={{ backgroundColor: C.pill, color: C.accent }}
          className="h-9 px-3 rounded-xl flex items-center gap-1.5 text-[12px] font-bold shrink-0
            hover:opacity-80 transition-opacity">
          <Users size={13} strokeWidth={2} />{roleLabel}<ChevronDown size={11} strokeWidth={2.5} />
        </button>
        <Notif n={5} />
      </div>
    </header>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// FAMILLE SCREENS — chaque écran = div w-full h-full flex flex-col
// ═════════════════════════════════════════════════════════════════════════════
const UPLOAD_CATS = [
  { id: "identite",  icon: UserCircle2,   label: "Identité" },
  { id: "finance",   icon: Wallet,        label: "Finance & administration" },
  { id: "contrats",  icon: FileSignature, label: "Contrats & assurances" },
  { id: "medical",   icon: Stethoscope,   label: "Médical" },
];

const ScreenF1 = ({ navigate, onNav, showNotice, onNotif, onProfile }) => {
  const [tab, setTab] = useState("coffre");
  // ─ Upload bottom sheet ─
  const [sheet, setSheet] = useState(null); // null | 'category' | 'choose' | 'preview' | 'success'
  const [sheetCtx, setSheetCtx] = useState(null);
  const [selectedCat, setSelectedCat] = useState(null);

  const [kiosqueFilter, setKiosqueFilter] = useState("Tous");

  const openUpload = (ctx = null) => {
    setSheetCtx(ctx);
    setSelectedCat(null);
    setSheet(ctx ? "choose" : "category"); // contextual → skip category
  };
  const closeSheet = () => { setSheet(null); setSheetCtx(null); setSelectedCat(null); };

  const resDocs = [
    { t: "Journal de la résidence",       d: "15/04/2026", isNew: true },
    { t: "Menu semaine 28 avr.",           d: "28/04/2026", auto: true },
    { t: "CR CVS T1 2026",                d: "15/03/2026" },
    { t: "Résultats enquête satisfaction", d: "30/01/2026" },
    { t: "Règlement de fonctionnement",    d: "01/01/2024" },
  ];

  // Contenu du sheet selon l'étape
  const sheetContent = () => {
    if (sheet === "category") return (
      <>
        <p style={{ color: C.ink2 }} className="text-[13px] mb-4 leading-relaxed">
          Dans quelle rubrique souhaitez-vous classer ce document ?
        </p>
        <div className="space-y-2">
          {UPLOAD_CATS.map(cat => (
            <button key={cat.id}
              onClick={() => { setSelectedCat(cat); setSheet("choose"); }}
              className="w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left active:opacity-80 transition-opacity"
              style={{ backgroundColor: C.bg }}>
              <div style={{ backgroundColor: C.pill }}
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                <cat.icon size={18} style={{ color: C.accent }} strokeWidth={1.8} />
              </div>
              <span style={{ color: C.ink }} className="flex-1 text-[14px] font-bold">{cat.label}</span>
              <ChevronRight size={16} style={{ color: C.ink2 }} strokeWidth={2} />
            </button>
          ))}
        </div>
      </>
    );

    if (sheet === "choose") return (
      <>
        {sheetCtx && (
          <div style={{ backgroundColor: C.bg, borderLeft: `3px solid ${C.accent}` }}
            className="rounded-r-2xl p-4 mb-5">
            <div style={{ color: C.ink2 }} className="text-[10px] font-bold uppercase tracking-wide mb-1">
              En réponse à la demande de
            </div>
            <div style={{ color: C.ink }} className="text-[14px] font-bold">{sheetCtx.residence}</div>
            <div style={{ color: C.ink }} className="text-[13px] font-semibold mt-1">
              {sheetCtx.docTitle}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <Clock size={11} style={{ color: C.accent }} />
              <span style={{ color: C.ink2 }} className="text-[11px] font-semibold">
                Demandé le {sheetCtx.date}
              </span>
            </div>
          </div>
        )}
        <div className="space-y-3">
          <Btn full icon={ScanLine} onClick={() => setSheet("preview")}>
            Scanner avec mon téléphone
          </Btn>
          <BtnOutline full icon={ImageIcon} onClick={() => setSheet("preview")}>
            Choisir depuis ma galerie
          </BtnOutline>
        </div>
        <div style={{ backgroundColor: C.info }} className="rounded-2xl p-3 mt-4 flex gap-2.5">
          <Info size={13} style={{ color: C.ink2 }} className="shrink-0 mt-0.5" />
          <span style={{ color: C.ink2 }} className="text-[11px] leading-relaxed">
            Le document sera chiffré et visible uniquement par la résidence.
          </span>
        </div>
      </>
    );

    if (sheet === "preview") return (
      <>
        <p style={{ color: C.ink2 }} className="text-[13px] mb-4">
          Vérifiez que le document est correct avant de l'envoyer.
        </p>
        <Card p="p-0" className="overflow-hidden mb-5">
          <div style={{ backgroundColor: C.bg }} className="h-48 flex items-center justify-center">
            <div style={{ backgroundColor: "white", border: `2px solid ${C.border}` }}
              className="w-32 h-40 rounded-xl shadow-md flex flex-col items-start p-3 gap-1.5">
              <div className="text-[9px] font-black" style={{ color: "#1E5BA8" }}>AssurEvolution</div>
              <div className="w-full h-px" style={{ backgroundColor: C.border }} />
              <div style={{ color: C.ink }} className="text-[7px] font-bold mt-1">ATTESTATION D'ASSURANCE</div>
              <div style={{ color: C.ink }} className="text-[7px]">Jean Lefebvre · 2026</div>
              <div className="mt-auto w-9 h-6 border-2 border-dashed rounded flex items-center justify-center"
                style={{ borderColor: "#1E5BA8" }}>
                <span className="text-[6px] font-bold" style={{ color: "#1E5BA8" }}>CACHET</span>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 border-t flex items-center gap-2" style={{ borderColor: C.border }}>
            <Check size={14} style={{ color: C.ink }} strokeWidth={2.5} />
            <span style={{ color: C.ink }} className="text-[12px] font-semibold">Document lisible · 412 Ko · PDF</span>
          </div>
        </Card>
        <Btn full onClick={() => setSheet("success")}>Confirmer l'envoi</Btn>
        <button onClick={() => setSheet("choose")} style={{ color: C.ink2 }}
          className="w-full h-10 mt-2 text-[13px] font-semibold">
          Changer de document
        </button>
      </>
    );

    if (sheet === "success") return (
      <div className="flex flex-col items-center py-4 text-center">
        <div style={{ backgroundColor: C.ok }}
          className="w-20 h-20 rounded-full flex items-center justify-center mb-5">
          <Check size={38} style={{ color: C.ink }} strokeWidth={2.5} />
        </div>
        <h3 style={{ color: C.ink }} className="text-[22px] font-extrabold">Document envoyé</h3>
        <p style={{ color: C.ink2 }} className="text-[13px] mt-2 mb-5 leading-relaxed max-w-xs">
          Votre{" "}
          <strong style={{ color: C.ink }}>
            {sheetCtx?.docTitle || "document"}
          </strong>{" "}
          a été transmis. Vous serez notifié dès validation.
        </p>
        <div style={{ backgroundColor: C.info, color: C.ink2 }}
          className="rounded-2xl px-4 py-3 mb-5 text-[12px] font-semibold flex items-center gap-2 w-full">
          <Clock size={14} />En cours de validation · sous 48h ouvrées
        </div>
        <BtnOutline full onClick={closeSheet}>Fermer</BtnOutline>
      </div>
    );
  };

  const sheetTitle = sheet === "category"
    ? "Déposer un document"
    : sheet === "choose"
    ? (sheetCtx ? "Déposer un justificatif" : selectedCat ? `Déposer — ${selectedCat.label}` : "Choisir un document")
    : sheet === "preview"
    ? "Vérifier avant envoi"
    : "Document envoyé ✓";

  return (
    <div className="w-full flex flex-col relative" style={{ height: "100%", backgroundColor: C.bg }}>
      <FHeader onBell={onNotif} onProfile={onProfile} />

      {/* ── Tab switcher au sommet ── */}
      <div className="px-5 pt-4 pb-0 shrink-0">
        <div style={{ backgroundColor: "white", border: `1px solid ${C.border}`, position: "relative" }}
          className="flex p-1 rounded-2xl">
          <div style={{
            position: "absolute", top: 4, bottom: 4,
            left: tab === "coffre" ? 4 : "50%",
            width: "calc(50% - 4px)",
            backgroundColor: C.accent, borderRadius: 10,
            transition: "left 260ms cubic-bezier(0.4, 0, 0.2, 1)", zIndex: 0,
          }} />
          {[["coffre", "Coffre-fort"], ["kiosque", "Kiosque"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ color: tab === id ? "white" : C.ink2, position: "relative", zIndex: 1, transition: "color 180ms ease" }}
              className="flex-1 h-10 text-[13px] font-bold">
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28">
        {tab === "coffre" ? (
          <>
            <h1 style={{ color: C.ink }} className="text-[28px] font-extrabold tracking-tight leading-tight mt-4">
              Mes documents
            </h1>
            <p style={{ color: C.ink2 }} className="text-[13px] font-medium mt-0.5 mb-4">
              Coffre-fort sécurisé · Jean Lefebvre
            </p>

            {/* Bandeau attention */}
            <div style={{ backgroundColor: C.pill }} className="rounded-3xl p-4 mb-4">
              <p style={{ color: C.ink }} className="text-[13px] font-bold mb-3">
                4 documents demandent votre attention
              </p>
              <div className="space-y-2">
                <button onClick={() => navigate("FS")}
                  className="w-full bg-white rounded-2xl px-3 py-2.5 flex items-center gap-3
                    hover:scale-[0.99] active:scale-[0.97] transition-transform text-left">
                  <FileSignature size={16} style={{ color: C.accent }} strokeWidth={1.8} />
                  <div className="flex-1 min-w-0">
                    <div style={{ color: C.ink }} className="text-[13px] font-bold">Contrat de séjour 2026</div>
                    <div style={{ color: C.ink2 }} className="text-[11px]">À signer avant le 15/05/2026</div>
                  </div>
                  <Tag label="À signer" tone="urgent" />
                </button>
                <button onClick={() => navigate("F3", { from: "F1", doc: { type: "facture", title: "Facture novembre 2026", date: "26/11/2026" } })}
                  className="w-full bg-white rounded-2xl px-3 py-2.5 flex items-center gap-3
                    hover:scale-[0.99] active:scale-[0.97] transition-transform text-left">
                  <FileText size={16} style={{ color: C.accent }} strokeWidth={1.8} />
                  <div className="flex-1 min-w-0">
                    <div style={{ color: C.ink }} className="text-[13px] font-bold">Facture novembre 2026</div>
                    <div style={{ color: C.ink2 }} className="text-[11px]">À consulter</div>
                  </div>
                  <Tag label="Nouveau" tone="new" />
                </button>
                <button onClick={() => openUpload({ docTitle: "Attestation mutuelle 2026", residence: "Les Cyclamens", date: "12/04/2026" })}
                  className="w-full bg-white rounded-2xl px-3 py-2.5 flex items-center gap-3
                    hover:scale-[0.99] active:scale-[0.97] transition-transform text-left">
                  <Shield size={16} style={{ color: C.accent }} strokeWidth={1.8} />
                  <div className="flex-1 min-w-0">
                    <div style={{ color: C.ink }} className="text-[13px] font-bold">Attestation mutuelle 2026</div>
                    <div style={{ color: C.ink2 }} className="text-[11px]">Échéance dans 12 jours</div>
                  </div>
                  <Tag label="À renouveler" tone="pending" />
                </button>
                <button onClick={() => openUpload({ docTitle: "Attestation d'assurance habitation 2026", residence: "Les Cyclamens — Challex", date: "24/04/2026" })}
                  className="w-full bg-white rounded-2xl px-3 py-2.5 flex items-center gap-3
                    hover:scale-[0.99] active:scale-[0.97] transition-transform text-left">
                  <FileText size={16} style={{ color: C.accent }} strokeWidth={1.8} />
                  <div className="flex-1 min-w-0">
                    <div style={{ color: C.ink }} className="text-[13px] font-bold">Justificatif d'assurance</div>
                    <div style={{ color: C.ink2 }} className="text-[11px]">Demandé par la résidence</div>
                  </div>
                  <Tag label="À fournir" tone="urgent" />
                </button>
              </div>
            </div>

            {/* Catégories coffre-fort */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: UserCircle2,   label: "Identité",                 count: 3,  badge: "1 nouveau",      tone: "new" },
                { icon: Wallet,        label: "Finance & administration",  count: 12, badge: null },
                { icon: FileSignature, label: "Contrats & assurances",     count: 5,  badge: "1 à renouveler", tone: "pending" },
                { icon: Stethoscope,   label: "Médical",                   count: 8,  badge: null },
              ].map((c, i) => (
                <Card key={i} p="p-4" onClick={() => navigate("F2")} className="flex flex-col gap-3">
                  <IconCircle icon={c.icon} size={48} />
                  <div>
                    <div style={{ color: C.ink }} className="text-[13px] font-extrabold leading-tight">{c.label}</div>
                    <div style={{ color: C.ink2 }} className="text-[11px] font-semibold mt-0.5">
                      {c.count} document{c.count > 1 ? "s" : ""}
                    </div>
                  </div>
                  {c.badge && <Tag label={c.badge} tone={c.tone} />}
                </Card>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* ── Kiosque ── */}
            <div className="mt-4 mb-3">
              <h1 style={{ color: C.ink }} className="text-[28px] font-extrabold tracking-tight leading-tight">
                Kiosque
              </h1>
              <p style={{ color: C.ink2 }} className="text-[13px] font-medium mt-0.5">
                Documents de la résidence · Les Cyclamens
              </p>
            </div>

            {/* Dropdown filtre catégorie */}
            <div style={{ backgroundColor: "white", border: `1px solid ${C.border}` }}
              className="relative h-10 rounded-2xl px-3 flex items-center gap-2 mb-4">
              <Filter size={13} style={{ color: C.ink2 }} />
              <select value={kiosqueFilter} onChange={e => setKiosqueFilter(e.target.value)}
                className="flex-1 bg-transparent text-[13px] font-semibold outline-none appearance-none"
                style={{ color: kiosqueFilter === "Tous" ? C.ink2 : C.ink }}>
                {["Tous", "CVS", "Vie résidence", "Qualité", "Institutionnel"].map(opt => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown size={13} style={{ color: C.ink2 }} className="pointer-events-none shrink-0" />
            </div>

            {/* Sections filtrées */}
            {[
              { tag: "CVS",           docs: [{ t: "CR CVS T1 2026",                d: "15/03/2026" }] },
              { tag: "Vie résidence", docs: [{ t: "Journal de la résidence",        d: "15/04/2026", isNew: true },
                                             { t: "Menu semaine 28 avr.",           d: "28/04/2026", auto: true  }] },
              { tag: "Qualité",       docs: [{ t: "Résultats enquête satisfaction", d: "30/01/2026" }] },
              { tag: "Institutionnel",docs: [{ t: "Projet d'établissement 2024–28", d: "02/01/2024" },
                                             { t: "Règlement de fonctionnement",    d: "01/01/2024" }] },
            ].filter(s => kiosqueFilter === "Tous" || s.tag === kiosqueFilter)
             .map((section, si) => (
              <div key={si} className="mb-4">
                <div style={{ color: C.ink2 }}
                  className="text-[11px] font-bold uppercase tracking-wider mb-2 px-1">
                  {section.tag}
                </div>
                <div className="space-y-2">
                  {section.docs.map((d, i) => (
                    <button key={i}
                      onClick={() => navigate("F3", { from: "F1", doc: { type: "residence", title: d.t, date: d.d } })}
                      className="w-full bg-white rounded-2xl px-4 py-3 flex items-center gap-3
                        hover:scale-[0.995] transition-transform text-left">
                      <div style={{ backgroundColor: C.pill }}
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0">
                        <FileText size={20} style={{ color: C.accent }} strokeWidth={1.8} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span style={{ color: C.ink }} className="text-[13px] font-bold">{d.t}</span>
                          {d.isNew && <Tag label="Nouveau" tone="new" />}
                          {d.auto && <Tag label="Auto Smart H" tone="info" />}
                        </div>
                        <div style={{ color: C.ink2 }} className="text-[11px]">{d.d} · PDF</div>
                      </div>
                      <ChevronRight size={16} style={{ color: C.ink2 }} strokeWidth={2} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* FAB — coffre-fort uniquement */}
      {tab === "coffre" && (
        <div className="relative shrink-0" style={{ height: 0 }}>
          <button onClick={() => openUpload(null)}
            style={{ background: GRAD, bottom: 8, right: 16 }}
            className="absolute h-12 px-4 rounded-2xl text-white text-[13px] font-bold
              shadow-[0_8px_20px_-6px_rgba(233,30,99,0.5)]
              flex items-center gap-2 z-30 hover:scale-[1.02] transition-transform">
            <Plus size={18} strokeWidth={2.5} />Déposer un document
          </button>
        </div>
      )}

      <LotBanner lot="MVP" profiles="Famille / Résident" />

      {/* Upload bottom sheet */}
      {sheet && (
        <BottomSheet open={!!sheet} onClose={closeSheet} title={sheetTitle} tall={sheet === "preview"}>
          {sheetContent()}
        </BottomSheet>
      )}
    </div>
  );
};

// ─── F2 ───────────────────────────────────────────────────────────────────────
const ALL_DOCS = [
  { id: 1,  t: "Facture novembre 2026",        d: "26/11/2026", y: "2026", type: "Factures",          s: "284 Ko", isNew: true },
  { id: 2,  t: "Facture octobre 2026",         d: "26/10/2026", y: "2026", type: "Factures",          s: "281 Ko" },
  { id: 3,  t: "Facture septembre 2026",       d: "26/09/2026", y: "2026", type: "Factures",          s: "279 Ko" },
  { id: 4,  t: "Avis d'imposition 2025",       d: "12/08/2025", y: "2025", type: "Avis d'imposition", s: "1.2 Mo" },
  { id: 5,  t: "Facture juillet 2025",         d: "26/07/2025", y: "2025", type: "Factures",          s: "277 Ko" },
  { id: 6,  t: "Facture juin 2025",            d: "26/06/2025", y: "2025", type: "Factures",          s: "275 Ko" },
  { id: 7,  t: "Avis d'imposition 2024",       d: "15/08/2024", y: "2024", type: "Avis d'imposition", s: "1.1 Mo" },
  { id: 8,  t: "Facture décembre 2024",        d: "26/12/2024", y: "2024", type: "Factures",          s: "273 Ko" },
  { id: 9,  t: "Facture novembre 2024",        d: "26/11/2024", y: "2024", type: "Factures",          s: "272 Ko" },
  { id: 10, t: "Régularisation annuelle 2024", d: "15/01/2024", y: "2024", type: "Factures",          s: "156 Ko" },
];

const ScreenF2 = ({ navigate, onNav, onNotif }) => {
  const [activeYear, setActiveYear] = useState(null);   // null = toutes les années
  const [activeType, setActiveType] = useState(null);   // null = tous les types
  const [query, setQuery] = useState("");
  const YEARS = ["2026", "2025", "2024"];
  const TYPES = ["Factures", "Avis d'imposition"];

  const visible = ALL_DOCS.filter(doc =>
    (!activeYear || doc.y === activeYear) &&
    (!activeType || doc.type === activeType) &&
    doc.t.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col" style={{ height: "100%", backgroundColor: C.bg }}>
      <header className="pt-10 pb-3 px-5 flex items-center gap-3 shrink-0">
        <button onClick={() => navigate("F1")}
          style={{ backgroundColor: "white" }}
          className="w-10 h-10 rounded-full flex items-center justify-center
            shadow-[0_2px_8px_-4px_rgba(54,10,6,0.12)] shrink-0">
          <ChevronLeft size={18} style={{ color: C.ink }} strokeWidth={2} />
        </button>
        <div className="flex-1 min-w-0">
          <div style={{ color: C.ink2 }} className="text-[11px] font-semibold flex items-center gap-1">
            Mes documents <ChevronRight size={10} /> Finance
          </div>
        </div>
        <Notif n={4} onClick={onNotif} />
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <h1 style={{ color: C.ink }}
          className="text-[26px] font-extrabold tracking-tight leading-tight">Finance &<br />administration</h1>
        <p style={{ color: C.ink2 }} className="text-[12px] font-medium mt-1 mb-4">
          {visible.length} document{visible.length !== 1 ? "s" : ""} · date décroissante
        </p>
        {/* ─── Filtres — ligne unique : recherche + 2 dropdowns ─── */}
        <div className="flex items-center gap-2 mb-4">
          {/* Search */}
          <div style={{ backgroundColor: "white", border: `1px solid ${C.border}` }}
            className="flex-1 h-11 rounded-2xl flex items-center gap-2 px-3 min-w-0">
            <Search size={15} style={{ color: C.ink2 }} strokeWidth={2} className="shrink-0" />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Rechercher…" className="flex-1 bg-transparent text-[13px] outline-none min-w-0"
              style={{ color: C.ink }} />
            {query && (
              <button onClick={() => setQuery("")} className="shrink-0">
                <X size={13} style={{ color: C.ink2 }} />
              </button>
            )}
          </div>

          {/* Dropdown Année */}
          <div style={{
            backgroundColor: activeYear ? C.pill : "white",
            border: `1.5px solid ${activeYear ? C.accent : C.border}`,
          }} className="h-11 rounded-2xl flex items-center px-3 gap-1.5 relative shrink-0">
            <select
              value={activeYear || ""}
              onChange={e => setActiveYear(e.target.value || null)}
              className="appearance-none bg-transparent text-[12px] font-bold outline-none cursor-pointer pr-5"
              style={{ color: activeYear ? C.accent : C.ink2 }}>
              <option value="">Année</option>
              {YEARS.map(y => <option key={y} value={y} style={{ color: C.ink }}>{y}</option>)}
            </select>
            <ChevronDown size={12} strokeWidth={2.5}
              style={{ color: activeYear ? C.accent : C.ink2 }}
              className="absolute right-2.5 pointer-events-none" />
          </div>

          {/* Dropdown Type */}
          <div style={{
            backgroundColor: activeType ? C.pill : "white",
            border: `1.5px solid ${activeType ? C.accent : C.border}`,
          }} className="h-11 rounded-2xl flex items-center px-3 gap-1.5 relative shrink-0">
            <select
              value={activeType || ""}
              onChange={e => setActiveType(e.target.value || null)}
              className="appearance-none bg-transparent text-[12px] font-bold outline-none cursor-pointer pr-5"
              style={{ color: activeType ? C.accent : C.ink2 }}>
              <option value="">Type</option>
              {TYPES.map(t => <option key={t} value={t} style={{ color: C.ink }}>{t}</option>)}
            </select>
            <ChevronDown size={12} strokeWidth={2.5}
              style={{ color: activeType ? C.accent : C.ink2 }}
              className="absolute right-2.5 pointer-events-none" />
          </div>
        </div>
        {/* Liste */}
        {visible.length === 0 ? (
          <div className="flex flex-col items-center py-12 gap-3">
            <FileText size={32} style={{ color: C.ink3 }} strokeWidth={1.5} />
            <p style={{ color: C.ink2 }} className="text-[13px] text-center">Aucun document</p>
          </div>
        ) : (
          <div className="space-y-2">
            {visible.map((doc, idx) => (
              <button key={doc.id} onClick={() => navigate("F3", { from: "F2", doc: { type: "facture", title: doc.t, date: doc.d }, docList: visible, docIdx: idx })}
                className="w-full bg-white rounded-2xl px-4 py-3 flex items-center gap-3
                  hover:scale-[0.995] transition-transform text-left relative">
                {doc.isNew && (
                  <span style={{ backgroundColor: C.accent }}
                    className="absolute top-3 right-3 w-2 h-2 rounded-full" />
                )}
                <div style={{ backgroundColor: C.pill }}
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0">
                  <FileText size={20} style={{ color: C.accent }} strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span style={{ color: C.ink }} className="text-[13px] font-bold">{doc.t}</span>
                    {doc.isNew && <Tag label="Nouveau" tone="new" />}
                  </div>
                  <div style={{ color: C.ink2 }} className="text-[11px]">
                    {doc.d} · PDF · {doc.s}
                    {doc.isNew && <span style={{ color: C.accent }} className="ml-2 font-bold">· Non lu</span>}
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: C.ink2 }} strokeWidth={2} />
              </button>
            ))}
          </div>
        )}
      </div>
      <LotBanner lot="MVP" profiles="Famille / Résident" />
    </div>
  );
};

// ─── F3 — Layout corrigé : barre d'actions en flex child, pas absolute ────────
const ScreenF3 = ({ navigate, onNav, f3From = "F2", f3Doc = { type: "facture", title: "Facture novembre 2026" }, f3DocList = [], f3DocIdx = -1 }) => {
  const [downloaded, setDownloaded] = useState(false);
  const [localIdx, setLocalIdx] = useState(f3DocIdx);

  const hasList = f3DocList.length > 1 && localIdx >= 0;
  const canPrev = hasList && localIdx > 0;
  const canNext = hasList && localIdx < f3DocList.length - 1;

  const displayDoc = hasList
    ? { type: "facture", title: f3DocList[localIdx].t, date: f3DocList[localIdx].d }
    : f3Doc;

  const isFacture = displayDoc.type === "facture";
  const headerSub = isFacture ? "Facture" : "Document résidence";
  const headerTitle = displayDoc.title || (isFacture ? "Novembre 2026" : "Document");

  return (
    <div className="w-full flex flex-col" style={{ height: "100%", backgroundColor: C.bg }}>
      <header className="pt-10 pb-3 px-5 flex items-center gap-3 shrink-0">
        <button onClick={() => navigate(f3From)}
          style={{ backgroundColor: "white" }}
          className="w-10 h-10 rounded-full flex items-center justify-center
            shadow-[0_2px_8px_-4px_rgba(54,10,6,0.12)] shrink-0">
          <ChevronLeft size={18} style={{ color: C.ink }} strokeWidth={2} />
        </button>
        <div className="flex-1 text-center min-w-0">
          <div style={{ color: C.ink2 }} className="text-[10px] font-bold uppercase tracking-wide">{headerSub}</div>
          <div style={{ color: C.ink }} className="text-[13px] font-bold truncate">{headerTitle}</div>
        </div>
        <button style={{ backgroundColor: "white" }}
          className="w-10 h-10 rounded-full flex items-center justify-center
            shadow-[0_2px_8px_-4px_rgba(54,10,6,0.12)] shrink-0">
          <MoreHorizontal size={18} style={{ color: C.ink }} strokeWidth={2} />
        </button>
      </header>

      {/* Prev / Next — visible only when opened from a list */}
      {hasList && (
        <div className="flex items-center justify-between px-5 py-2 shrink-0"
          style={{ borderBottom: `1px solid ${C.border}` }}>
          <button onClick={() => setLocalIdx(i => i - 1)} disabled={!canPrev}
            style={{ color: canPrev ? C.accent : C.ink3 }}
            className="flex items-center gap-1 text-[12px] font-bold disabled:opacity-40 transition-opacity">
            <ChevronLeft size={14} strokeWidth={2.5} />Préc.
          </button>
          <span style={{ color: C.ink2 }} className="text-[12px] font-semibold">
            {localIdx + 1} / {f3DocList.length}
          </span>
          <button onClick={() => setLocalIdx(i => i + 1)} disabled={!canNext}
            style={{ color: canNext ? C.accent : C.ink3 }}
            className="flex items-center gap-1 text-[12px] font-bold disabled:opacity-40 transition-opacity">
            Suiv.<ChevronRight size={14} strokeWidth={2.5} />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {isFacture ? (
          /* ── Contenu facture ── */
          <>
            <Card p="p-0" className="overflow-hidden">
              <div className="p-5 border-b" style={{ borderColor: C.border }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div style={{ color: C.accent }} className="text-xl font-black">DomusVi</div>
                    <div style={{ color: C.ink2 }} className="text-[9px]">En toute confiance</div>
                  </div>
                  <div className="text-right">
                    <div style={{ color: C.ink }} className="text-[11px] font-bold">n° 2026-11-2487</div>
                    <div style={{ color: C.ink2 }} className="text-[10px]">Émise le 26/11/2026</div>
                  </div>
                </div>
                <div style={{ backgroundColor: C.bg }} className="rounded-xl p-3">
                  <div style={{ color: C.ink2 }} className="text-[10px] font-semibold">Résidence</div>
                  <div style={{ color: C.ink }} className="text-[12px] font-bold">Les Cyclamens — Challex</div>
                  <div style={{ color: C.ink2 }} className="text-[10px]">Jean Lefebvre · Chambre 24</div>
                </div>
              </div>
              <div className="p-5">
                {[["Hébergement (30j)", "2 540,00 €"], ["Restauration (30j)", "720,00 €"],
                  ["Soins quotidiens", "385,00 €"], ["Animation & ateliers", "95,00 €"],
                  ["Blanchisserie", "60,00 €"]].map(([l, v], i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-dashed"
                    style={{ borderColor: C.border }}>
                    <span style={{ color: C.ink2 }} className="text-[12px]">{l}</span>
                    <span style={{ color: C.ink }} className="text-[12px] font-bold">{v}</span>
                  </div>
                ))}
                <div style={{ backgroundColor: C.pill }}
                  className="mt-4 rounded-2xl p-4 flex justify-between items-center">
                  <span style={{ color: C.ink }} className="text-[13px] font-bold">Total à régler</span>
                  <span style={{ color: C.accent }} className="text-xl font-black">3 800,00 €</span>
                </div>
                <div style={{ color: C.ink2 }} className="text-[10px] mt-3 text-center">
                  Prélèvement automatique le 05/12/2026
                </div>
              </div>
            </Card>
            <div style={{ backgroundColor: "white", border: `1px dashed ${C.pill}` }}
              className="rounded-2xl p-3 mt-3 flex items-center gap-2.5">
              <Shield size={13} style={{ color: C.accent }} strokeWidth={2} />
              <span style={{ color: C.ink2 }} className="text-[12px]">
                Disponible dans votre coffre jusqu'au <strong style={{ color: C.ink }}>30/11/2030</strong>
              </span>
            </div>
          </>
        ) : (
          /* ── Contenu document résidence ── */
          <>
            <div style={{ backgroundColor: C.pill }}
              className="rounded-2xl px-4 py-3 mb-4 flex items-center gap-3">
              <Building2 size={16} style={{ color: C.accent }} strokeWidth={2} />
              <span style={{ color: C.ink }} className="text-[13px] font-semibold">
                Publié par Les Cyclamens — Challex
              </span>
            </div>
            <Card p="p-0" className="overflow-hidden">
              {/* En-tête doc résidence */}
              <div className="p-5 border-b" style={{ borderColor: C.border }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div style={{ color: C.accent }} className="text-xl font-black">DomusVi</div>
                    <div style={{ color: C.ink2 }} className="text-[9px]">Les Cyclamens — Challex</div>
                  </div>
                  <div className="text-right">
                    <div style={{ color: C.ink2 }} className="text-[10px]">Publié le {displayDoc.date || "15/04/2026"}</div>
                    <div style={{ color: C.ink2 }} className="text-[10px]">PDF · Espace résidence</div>
                  </div>
                </div>
                <div style={{ backgroundColor: C.bg }} className="rounded-xl p-3">
                  <div style={{ color: C.ink }} className="text-[14px] font-extrabold">{displayDoc.title}</div>
                </div>
              </div>
              {/* Corps générique résidence */}
              <div className="p-5 space-y-3">
                {[
                  "Ce document est mis à disposition de toutes les familles de la résidence.",
                  "Il est accessible depuis l'espace résidence de votre application FamilyVi.",
                  "Pour toute question, contactez directement l'équipe des Cyclamens.",
                ].map((t, i) => (
                  <div key={i} className="flex gap-2.5">
                    <div
                      style={{
                        backgroundColor: C.pill,
                        width: 3,
                        alignSelf: "stretch",
                      }}
                      className="w-1.5 rounded-full shrink-0 mt-1"
                    />
                    <p style={{ color: C.ink2 }} className="text-[12px] leading-relaxed">{t}</p>
                  </div>
                ))}
                <div style={{ backgroundColor: C.bg }} className="rounded-xl p-3 mt-2">
                  <div style={{ color: C.ink2 }} className="text-[10px] font-semibold mb-1">Résidence</div>
                  <div style={{ color: C.ink }} className="text-[13px] font-bold">Les Cyclamens — Challex</div>
                  <div style={{ color: C.ink2 }} className="text-[11px]">45 chemin du Lavoir · 01630 Challex</div>
                </div>
              </div>
            </Card>
            <div style={{ backgroundColor: "white", border: `1px dashed ${C.pill}` }}
              className="rounded-2xl p-3 mt-3 flex items-center gap-2.5">
              <Shield size={13} style={{ color: C.accent }} strokeWidth={2} />
              <span style={{ color: C.ink2 }} className="text-[12px]">
                Document public · visible par toutes les familles
              </span>
            </div>
          </>
        )}
      </div>

      {/* ─── Barre d'actions — flex child, pas de position absolute ─── */}
      <div style={{ backgroundColor: "white", borderTop: `1px solid ${C.border}` }}
        className="px-4 py-3 flex gap-2 shrink-0">
        <button
          onClick={() => { setDownloaded(true); setTimeout(() => setDownloaded(false), 1800); }}
          style={{ backgroundColor: downloaded ? C.ok : C.bg, color: C.ink,
            flex: 1, height: 44, borderRadius: 12, fontSize: 13, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.2s" }}>
          {downloaded ? <Check size={15} strokeWidth={2.5} /> : <Download size={15} strokeWidth={2} />}
          {downloaded ? "Téléchargé" : "Télécharger"}
        </button>
        <button
          style={{ backgroundColor: C.bg, color: C.ink,
            flex: 1, height: 44, borderRadius: 12, fontSize: 13, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Share2 size={15} strokeWidth={2} />Partager
        </button>
      </div>

      <LotBanner lot="MVP" profiles="Famille / Résident" />
    </div>
  );
};

// ─── F4 ───────────────────────────────────────────────────────────────────────
const ScreenF4 = ({ navigate, onNav }) => {
  const [step, setStep] = useState("choose");
  return (
    <div className="w-full flex flex-col" style={{ height: "100%", backgroundColor: C.bg }}>
      <header className="pt-10 pb-3 px-5 flex items-center gap-3 shrink-0">
        <button onClick={() => step === "preview" ? setStep("choose") : navigate("F1")}
          style={{ backgroundColor: "white" }}
          className="w-10 h-10 rounded-full flex items-center justify-center
            shadow-[0_2px_8px_-4px_rgba(54,10,6,0.12)] shrink-0">
          <ChevronLeft size={18} style={{ color: C.ink }} strokeWidth={2} />
        </button>
        <div style={{ color: C.ink }} className="text-[14px] font-bold">
          {step === "choose" ? "Déposer un justificatif" : "Vérifier avant envoi"}
        </div>
      </header>

      {step === "choose" ? (
        <div className="flex-1 overflow-y-auto px-5 pb-6">
          <Card p="p-4" className="mb-5 mt-2">
            <div style={{ color: C.ink2 }} className="text-[10px] font-bold uppercase tracking-wide mb-1">Demandé par</div>
            <div style={{ color: C.ink }} className="text-[14px] font-bold">Les Cyclamens — Challex</div>
            <div style={{ color: C.ink2 }} className="text-[11px] mb-3">Le 24/04/2026 · Sophie Martin</div>
            <div style={{ backgroundColor: C.bg, borderLeft: `3px solid ${C.accent}` }}
              className="rounded-r-xl p-3">
              <div style={{ color: C.ink2 }} className="text-[10px] font-bold uppercase mb-1">Document attendu</div>
              <div style={{ color: C.ink }} className="text-[14px] font-bold">Attestation d'assurance habitation 2026</div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <Clock size={11} style={{ color: C.accent }} />
                <span style={{ color: C.ink }} className="text-[11px] font-bold">Avant le 24/05/2026</span>
              </div>
            </div>
          </Card>
          <div style={{ color: C.ink }} className="text-[13px] font-bold mb-3">Comment fournir ce document ?</div>
          <div className="space-y-3">
            <Btn full icon={ScanLine} onClick={() => setStep("preview")}>Scanner avec mon téléphone</Btn>
            <BtnOutline full icon={ImageIcon} onClick={() => setStep("preview")}>Choisir depuis ma galerie</BtnOutline>
          </div>
          <div style={{ backgroundColor: C.info }} className="rounded-2xl p-3 mt-5 flex gap-2.5">
            <Info size={14} style={{ color: C.ink2 }} strokeWidth={2} className="shrink-0 mt-0.5" />
            <span style={{ color: C.ink2 }} className="text-[11px] leading-relaxed">
              Vérifiez que le document est lisible et complet avant envoi.
            </span>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-5 pb-6">
          <p style={{ color: C.ink2 }} className="text-[13px] mb-4 mt-2">Vérifiez avant d'envoyer.</p>
          <Card p="p-0" className="overflow-hidden mb-4">
            <div style={{ backgroundColor: C.bg }}
              className="h-56 flex items-center justify-center">
              <div style={{ backgroundColor: "white", border: `2px solid ${C.border}` }}
                className="w-36 h-48 rounded-xl shadow-md flex flex-col items-start p-3 gap-1.5">
                <div className="text-[10px] font-black" style={{ color: "#1E5BA8" }}>AssurEvolution</div>
                <div className="w-full h-px" style={{ backgroundColor: C.border }} />
                <div style={{ color: C.ink }} className="text-[8px] font-bold mt-1">ATTESTATION D'ASSURANCE</div>
                <div style={{ color: C.ink }} className="text-[8px]">Jean Lefebvre</div>
                <div style={{ color: C.ink2 }} className="text-[7px]">01/01/2026 → 31/12/2026</div>
                <div className="mt-auto w-10 h-7 border-2 border-dashed rounded flex items-center justify-center"
                  style={{ borderColor: "#1E5BA8" }}>
                  <span className="text-[6px] font-bold" style={{ color: "#1E5BA8" }}>CACHET</span>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 border-t flex items-center gap-2" style={{ borderColor: C.border }}>
              <Check size={15} style={{ color: C.ink }} strokeWidth={2.5} />
              <span style={{ color: C.ink }} className="text-[13px] font-semibold">Document lisible · 412 Ko · PDF</span>
            </div>
          </Card>
          <Btn full onClick={() => navigate("F5")}>Confirmer l'envoi</Btn>
          <button onClick={() => setStep("choose")} style={{ color: C.ink2 }}
            className="w-full h-10 mt-2 text-[13px] font-semibold">
            Changer de document
          </button>
        </div>
      )}
      <LotBanner lot="Lot 0.1" profiles="Famille / Résident" atelier />
    </div>
  );
};

// ─── F5 ───────────────────────────────────────────────────────────────────────
const ScreenF5 = ({ navigate, onNav }) => (
  <div className="w-full flex flex-col" style={{ height: "100%", backgroundColor: C.bg }}>
    <header className="pt-10 pb-3 px-5 flex justify-end shrink-0">
      <button onClick={() => navigate("F1")} style={{ backgroundColor: "white" }}
        className="w-10 h-10 rounded-full flex items-center justify-center
          shadow-[0_2px_8px_-4px_rgba(54,10,6,0.12)]">
        <X size={18} style={{ color: C.ink }} strokeWidth={2} />
      </button>
    </header>
    <div className="flex-1 flex flex-col items-center justify-center px-6 pb-16 overflow-y-auto">
      <div style={{ backgroundColor: C.ok }}
        className="w-28 h-28 rounded-full flex items-center justify-center mb-6
          shadow-[0_12px_32px_-12px_rgba(63,107,31,0.2)]">
        <Check size={52} style={{ color: C.ink }} strokeWidth={2.5} />
      </div>
      <h1 style={{ color: C.ink }} className="text-[30px] font-extrabold tracking-tight text-center">Document envoyé</h1>
      <p style={{ color: C.ink2 }} className="text-center text-[14px] mt-3 leading-relaxed max-w-xs font-medium">
        Votre <strong style={{ color: C.ink }}>attestation d'assurance</strong> a bien été transmise.
        Vous serez notifié dès validation.
      </p>
      <div style={{ backgroundColor: "white", border: `1px solid ${C.border}` }}
        className="mt-5 rounded-2xl p-4 w-full flex items-center gap-3">
        <div style={{ backgroundColor: C.info }}
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
          <Clock size={18} style={{ color: C.ink2 }} strokeWidth={2} />
        </div>
        <div>
          <div style={{ color: C.ink }} className="text-[13px] font-bold">En cours de validation</div>
          <div style={{ color: C.ink2 }} className="text-[11px]">Les Cyclamens · sous 48h ouvrées</div>
        </div>
      </div>
      <div className="w-full mt-5">
        <Btn full icon={ChevronLeft} onClick={() => navigate("F1")}>Retour à mes documents</Btn>
      </div>
    </div>
    <LotBanner lot="Lot 0.1" profiles="Famille / Résident" />
  </div>
);

// ═════════════════════════════════════════════════════════════════════════════
// STAFF SCREENS
// ═════════════════════════════════════════════════════════════════════════════
const ScreenS1 = ({ navigate, compact, staffRole = "manager", onRole }) => {
  const [tab, setTab] = useState("todo");
  const [renewToggles, setRenewToggles] = useState([true, true, true, false]);
  const toggleRenew = (i) => setRenewToggles(prev => prev.map((v, idx) => idx === i ? !v : v));

  // ─ Quick-request bottom sheet ─
  const [reqSheet, setReqSheet] = useState(false); // false | 'form' | 'sent'
  const [reqDocType, setReqDocType] = useState("Attestation d'assurance habitation");
  const [reqMsg, setReqMsg] = useState("");
  const [reqResident, setReqResident] = useState(RESIDENTS_LIST[0]);
  const [resPickerOpen, setResPickerOpen] = useState(false);

  // ─ Todo filters ─
  const [todoQuery, setTodoQuery] = useState("");
  const [todoStatut, setTodoStatut] = useState("");
  const [todoType,   setTodoType]   = useState("");

  // ─ Library moderation ─
  const [libModal, setLibModal] = useState(null); // null | libraryDoc object
  const [libDone, setLibDone]   = useState(null); // null | 'archived' | 'unpublished'

  // ─ Administration ─
  const [addCatOpen, setAddCatOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [editCat, setEditCat]       = useState(null); // null | category label

  const tabLot = { todo: "MVP", library: "MVP", sent: "Lot 0.1", admin: "Lot 1" };
  const tabProfiles = {
    todo:    "Manager, Staff standard, Staff premium",
    library: "Manager, Staff premium",
    sent:    "Manager, Staff premium",
    admin:   "Manager, Système",
  };

  // Tabs visible selon le profil
  const visibleTabs = {
    manager:        ["todo", "library", "sent", "admin"],
    staff_premium:  ["todo", "library", "sent"],
    staff_standard: ["todo"],
  }[staffRole] || ["todo", "library", "sent", "admin"];

  const todoRows = [
    { f: "Marie Lefebvre",  r: "Jean Lefebvre · ch. 24",    t: "Attestation assurance habitation", d: "26/04/2026", tone: "new",     lbl: "Nouveau" },
    { f: "Christophe Roux", r: "Yvonne Roux · ch. 18",      t: "Pièce d'identité (verso)",          d: "25/04/2026", tone: "pending", lbl: "À analyser" },
    { f: "Julie Dubreuil",  r: "Henri Dubreuil · ch. 31",   t: "Avis d'imposition 2025",            d: "24/04/2026", tone: "pending", lbl: "À analyser" },
    { f: "Pierre Bernard",  r: "Suzanne Bernard · ch. 09",  t: "Attestation mutuelle 2026",         d: "23/04/2026", tone: "info",    lbl: "Reçu" },
    { f: "Alice Soulier",   r: "Robert Soulier · ch. 12",   t: "RIB nouveau prélèvement",           d: "22/04/2026", tone: "ok",      lbl: "Validé" },
  ];
  const libraryDocs = [
    { t: "CR CVS T1 2026",                d: "15/03/2026", tag: "CVS" },
    { t: "Menu semaine 28 avr.",           d: "28/04/2026", tag: "Auto Smart H" },
    { t: "Journal de la résidence",        d: "15/04/2026", tag: "Information" },
    { t: "Résultats enquête satisfaction", d: "30/01/2026", tag: "Qualité" },
    { t: "Projet d'établissement 2024-28", d: "02/01/2024", tag: "Institutionnel" },
    { t: "Règlement de fonctionnement",    d: "01/01/2024", tag: "Institutionnel" },
  ];
  const sentRequests = [
    { f: "Marie Lefebvre",               t: "Attestation assurance habitation", sent: "24/04/2026", tone: "pending", lbl: "En attente", remaining: "13j" },
    { f: "Pierre Durand",                t: "Pièce d'identité",                 sent: "15/04/2026", tone: "pending", lbl: "En attente", remaining: "7j" },
    { f: "Yvonne Roux (fam. Claude)",    t: "Mutuelle complémentaire",          sent: "01/04/2026", tone: "urgent",  lbl: "Relance envoyée" },
  ];
  const renewRows = [
    ["Attestation d'assurance habitation", "Annuel",  "30j avant"],
    ["Avis d'imposition",                  "Annuel",  "60j avant"],
    ["Mutuelle complémentaire",            "Annuel",  "30j avant"],
    ["RIB (vérification)",                 "2 ans",   "30j avant"],
  ];

  const filteredTodo = todoRows.filter(r =>
    (todoQuery  === "" || r.f.toLowerCase().includes(todoQuery.toLowerCase())) &&
    (todoStatut === "" || r.lbl === todoStatut) &&
    (todoType   === "" || r.t.toLowerCase().includes(todoType.toLowerCase()))
  );

  return (
    <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden" style={{ height: "100%" }}>
      <TopBar compact={compact} staffRole={staffRole} onRole={onRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className={`${compact ? "px-5 py-4" : "px-8 pt-6 pb-4"} flex items-end justify-between shrink-0`}>
          <div>
            <p style={{ color: C.ink2 }} className="text-[11px] font-semibold uppercase tracking-wide mb-1">
              Espace documentaire
            </p>
            <h1 style={{ color: C.ink }}
              className={`${compact ? "text-2xl" : "text-[28px]"} font-extrabold tracking-tight`}>
              Gérer les documents
            </h1>
          </div>
          {tab !== "admin" && (
            <div className="flex gap-2">
              <BtnOutline sm icon={Send} onClick={() => setReqSheet("form")}>
                {compact ? "Demander" : "Demander un justificatif"}
              </BtnOutline>
              <Btn sm icon={Plus} onClick={() => navigate("S2")}>
                {compact ? "Nouveau" : "Nouveau document"}
              </Btn>
            </div>
          )}
        </div>

        {/* KPIs */}
        {tab !== "admin" && (
          <div className={`${compact ? "px-5" : "px-8"} grid grid-cols-3 gap-4 mb-4 shrink-0`}>
            {[
              { label: "Reçus à analyser",    value: 5,  bg: C.pill,     icon: Inbox,      clickTab: "todo" },
              { label: "Demandes en attente", value: 3,  bg: C.info,     icon: Clock,      clickTab: "sent" },
              { label: "Publiés ce mois",     value: 12, bg: C.ok,       icon: FileCheck2, clickTab: "library" },
            ].map((k, i) => (
              <button key={i} onClick={() => setTab(k.clickTab)}
                style={{ backgroundColor: C.card, textAlign: "left" }}
                className="rounded-2xl p-4 shadow-[0_2px_12px_-6px_rgba(54,10,6,0.09)]
                  hover:shadow-[0_6px_20px_-8px_rgba(54,10,6,0.14)] hover:-translate-y-0.5
                  transition-all duration-200 flex items-center gap-3">
                <div style={{ backgroundColor: k.bg, width: 44, height: 44 }}
                  className="rounded-xl flex items-center justify-center shrink-0">
                  <k.icon size={20} strokeWidth={1.8} style={{ color: C.ink2 }} />
                </div>
                <div>
                  <div style={{ color: C.ink }}
                    className={`${compact ? "text-2xl" : "text-[28px]"} font-black leading-none`}>{k.value}</div>
                  <div style={{ color: C.ink2 }} className="text-[11px] font-semibold mt-0.5 leading-tight">{k.label}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Tabs (filtrés selon le profil staff) */}
        <div className={`${compact ? "px-5" : "px-8"} flex border-b shrink-0`}
          style={{ borderColor: C.border }}>
          {[
            { id: "todo",    label: "À traiter",         n: 5 },
            { id: "library", label: "Bibliothèque",      n: null },
            { id: "sent",    label: "Demandes envoyées", n: 3 },
            { id: "admin",   label: "Administration",    lot1: true },
          ].filter(t => visibleTabs.includes(t.id)).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={tab === t.id
                ? { color: C.accent, borderColor: C.accent }
                : { color: C.ink2, borderColor: "transparent" }}
              className="px-4 py-3 text-[13px] font-bold border-b-2 -mb-[1px]
                flex items-center gap-2 transition-colors whitespace-nowrap">
              {t.label}
              {t.n != null && (
                <span style={{ backgroundColor: tab === t.id ? C.accent : C.pill, color: tab === t.id ? "white" : C.accent }}
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded min-w-[18px] text-center">{t.n}</span>
              )}
              {t.lot1 && <Tag label="Lot 1" tone="ok" />}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          {/* À traiter */}
          {tab === "todo" && (
            <div className={`${compact ? "px-5" : "px-8"} py-4 space-y-3`}>
              {/* Barre de filtres */}
              <div className="flex items-center gap-2 flex-wrap">
                <div style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
                  className="flex items-center gap-2 px-3 h-9 rounded-xl flex-1 min-w-[140px]">
                  <Search size={13} style={{ color: C.ink2 }} />
                  <input value={todoQuery} onChange={e => setTodoQuery(e.target.value)}
                    placeholder="Famille…" className="bg-transparent text-[12px] outline-none flex-1"
                    style={{ color: C.ink }} />
                </div>
                <div style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
                  className="relative h-9 rounded-xl px-3 flex items-center gap-1 min-w-[130px]">
                  <Filter size={12} style={{ color: C.ink2 }} />
                  <select value={todoStatut} onChange={e => setTodoStatut(e.target.value)}
                    className="bg-transparent text-[12px] font-semibold outline-none appearance-none pr-4"
                    style={{ color: todoStatut ? C.ink : C.ink2 }}>
                    <option value="">Tous statuts</option>
                    <option>Nouveau</option>
                    <option>À analyser</option>
                    <option>Reçu</option>
                    <option>Validé</option>
                  </select>
                  <ChevronDown size={11} style={{ color: C.ink2 }} className="absolute right-2 pointer-events-none" />
                </div>
                <div style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
                  className="relative h-9 rounded-xl px-3 flex items-center gap-1 min-w-[160px]">
                  <FileText size={12} style={{ color: C.ink2 }} />
                  <select value={todoType} onChange={e => setTodoType(e.target.value)}
                    className="bg-transparent text-[12px] font-semibold outline-none appearance-none pr-4"
                    style={{ color: todoType ? C.ink : C.ink2 }}>
                    <option value="">Tous types</option>
                    <option value="assurance">Assurance</option>
                    <option value="identité">Identité</option>
                    <option value="imposition">Imposition</option>
                    <option value="mutuelle">Mutuelle</option>
                    <option value="rib">RIB</option>
                  </select>
                  <ChevronDown size={11} style={{ color: C.ink2 }} className="absolute right-2 pointer-events-none" />
                </div>
                {(todoQuery || todoStatut || todoType) && (
                  <button onClick={() => { setTodoQuery(""); setTodoStatut(""); setTodoType(""); }}
                    style={{ color: C.ink2 }} className="text-[11px] font-semibold hover:underline shrink-0">
                    Réinitialiser
                  </button>
                )}
              </div>
              <Card p="p-0" className="overflow-hidden">
                <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b text-[11px] font-bold uppercase tracking-wide"
                  style={{ borderColor: C.border, color: C.ink2 }}>
                  <div className="col-span-3">Famille</div>
                  <div className="col-span-5">Document</div>
                  <div className="col-span-2">Reçu le</div>
                  <div className="col-span-2">Statut</div>
                </div>
                {filteredTodo.length === 0 && (
                  <div className="px-5 py-8 text-center" style={{ color: C.ink2 }}>
                    <p className="text-[13px] font-semibold">Aucun document ne correspond aux filtres.</p>
                  </div>
                )}
                {filteredTodo.map((r, i) => (
                  <button key={i} onClick={() => navigate("S4")}
                    className="w-full grid grid-cols-12 gap-3 px-5 py-3.5 items-center
                      hover:bg-[#FDF5F3] border-b last:border-0 transition-colors text-left"
                    style={{ borderColor: C.border }}>
                    <div className="col-span-3 flex items-center gap-2.5 min-w-0">
                      <Av init={r.f.split(" ").map(w => w[0]).join("").slice(0, 2)} size={32} />
                      <div className="min-w-0">
                        <div style={{ color: C.ink }} className="text-[12px] font-bold truncate">{r.f}</div>
                        <div style={{ color: C.ink2 }} className="text-[11px] truncate">{r.r}</div>
                      </div>
                    </div>
                    <div className="col-span-5 flex items-center gap-2 min-w-0">
                      <FileText size={13} style={{ color: C.accent }} strokeWidth={1.8} className="shrink-0" />
                      <span style={{ color: C.ink }} className="text-[12px] font-semibold truncate">{r.t}</span>
                    </div>
                    <div style={{ color: C.ink2 }} className="col-span-2 text-[12px]">{r.d}</div>
                    <div className="col-span-2"><Tag label={r.lbl} tone={r.tone} /></div>
                  </button>
                ))}
              </Card>
            </div>
          )}

          {/* Bibliothèque */}
          {tab === "library" && (
            <div className={`${compact ? "px-5" : "px-8"} py-4`}>
              <Card p="p-0" className="overflow-hidden">
                {libraryDocs.map((d, i) => (
                  <button key={i} onClick={() => { setLibModal(d); setLibDone(null); }}
                    className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-[#FDF5F3]
                      border-b last:border-0 transition-colors text-left"
                    style={{ borderColor: C.border }}>
                    <div style={{ backgroundColor: C.pill }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                      <FileText size={18} style={{ color: C.accent }} strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div style={{ color: C.ink }} className="text-[13px] font-bold">{d.t}</div>
                      <div style={{ color: C.ink2 }} className="text-[11px]">{d.d} · PDF</div>
                    </div>
                    <Tag label={d.tag} tone="soft" />
                    <ChevronRight size={14} style={{ color: C.ink2 }} strokeWidth={2} />
                  </button>
                ))}
              </Card>
            </div>
          )}

          {/* Demandes envoyées */}
          {tab === "sent" && (
            <div className={`${compact ? "px-5" : "px-8"} py-4 space-y-3`}>
              {sentRequests.map((r, i) => (
                <Card key={i} p="p-4" className="flex items-center gap-4">
                  <Av init={r.f.split(" ").map(w => w[0]).join("").slice(0, 2)} size={40} />
                  <div className="flex-1 min-w-0">
                    <div style={{ color: C.ink }} className="text-[13px] font-bold">{r.f}</div>
                    <div style={{ color: C.ink2 }} className="text-[12px]">{r.t}</div>
                    <div style={{ color: C.ink2 }} className="text-[11px] mt-0.5">Envoyée le {r.sent}</div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1.5">
                    <Tag label={r.lbl} tone={r.tone} />
                    {r.remaining && (
                      <span style={{ color: C.ink2 }} className="text-[11px] font-semibold">{r.remaining} restants</span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Administration */}
          {tab === "admin" && (
            <div className={`${compact ? "px-5 py-5" : "px-8 py-5"} space-y-5`}>
              {/* Catégories espace famille */}
              <Card p="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div style={{ color: C.ink }} className="text-[15px] font-extrabold">
                      Catégories de l'espace privé famille
                    </div>
                    <div style={{ color: C.ink2 }} className="text-[12px] mt-0.5 leading-snug">
                      Ce sont les dossiers dans lesquels les familles retrouvent
                      leurs documents personnels (pièces d'identité, factures, contrats…)
                    </div>
                  </div>
                  <BtnOutline sm icon={FolderPlus} onClick={() => { setNewCatName(""); setAddCatOpen(true); }}>
                    Ajouter
                  </BtnOutline>
                </div>
                <div className="mt-4 space-y-1">
                  {[
                    [UserCircle2,   "Identité",                 87],
                    [Wallet,        "Finance & administration", 312],
                    [Stethoscope,   "Médical",                  198],
                    [FileSignature, "Contrats & assurances",    145],
                  ].map(([Ic, l, n], i) => (
                    <div key={i}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#FDF5F3] transition-colors">
                      <div style={{ backgroundColor: C.pill, width: 36, height: 36 }}
                        className="rounded-xl flex items-center justify-center shrink-0">
                        <Ic size={15} strokeWidth={1.8} style={{ color: C.accent }} />
                      </div>
                      <span style={{ color: C.ink }} className="text-[13px] font-bold flex-1">{l}</span>
                      <span style={{ color: C.ink2 }} className="text-[11px]">{n} docs</span>
                      <button onClick={() => setEditCat(l)}
                        style={{ color: C.ink2 }} className="hover:text-[--accent] transition-colors p-1">
                        <Edit3 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Documents à renouveler */}
              <Card p="p-5">
                <div style={{ color: C.ink }} className="text-[15px] font-extrabold mb-1">
                  Documents à renouveler automatiquement
                </div>
                <div style={{ color: C.ink2 }} className="text-[12px] mb-4">
                  Quand la date d'expiration approche, une relance est envoyée à la famille.
                </div>
                {renewRows.map(([t, p, r], i) => (
                  <div key={i} className="flex items-center py-3 border-b last:border-0 gap-4"
                    style={{ borderColor: C.border }}>
                    <FileText size={13} style={{ color: C.accent }} className="shrink-0" />
                    <span style={{ color: C.ink }} className="text-[12px] font-semibold flex-1">{t}</span>
                    <span style={{ color: C.ink2 }} className="text-[11px] w-20">{p}</span>
                    <span style={{ color: C.ink2 }} className="text-[11px] w-20">{r}</span>
                    <button onClick={() => toggleRenew(i)}
                      style={{ backgroundColor: renewToggles[i] ? C.accent : C.neutral2,
                        width: 40, height: 24, borderRadius: 12, padding: 2,
                        display: "flex", alignItems: "center",
                        justifyContent: renewToggles[i] ? "flex-end" : "flex-start",
                        transition: "all 0.2s", shrink: 0 }}>
                      <div style={{ width: 20, height: 20, backgroundColor: "white",
                        borderRadius: "50%", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />
                    </button>
                  </div>
                ))}
              </Card>
            </div>
          )}
        </div>
      </div>
      <LotBanner lot={tabLot[tab]} profiles={tabProfiles[tab]} atelier={tab === "admin"} />

      {/* ─ Quick-request bottom sheet ─ */}
      <BottomSheet
        open={!!reqSheet}
        onClose={() => { setReqSheet(false); setReqMsg(""); }}
        title={reqSheet === "sent" ? "Demande envoyée ✓" : "Demander un justificatif"}
        tall>
        {reqSheet === "form" && (
          <>
            <div className="space-y-4">
              <div>
                <label style={{ color: C.ink }} className="text-[12px] font-bold block mb-1.5">
                  Type de document
                </label>
                <div style={{ backgroundColor: C.bg, border: `1px solid ${C.border}` }}
                  className="rounded-xl flex items-center px-3 gap-2 relative">
                  <select value={reqDocType} onChange={e => setReqDocType(e.target.value)}
                    className="w-full h-11 appearance-none bg-transparent text-[13px] font-semibold outline-none pr-6"
                    style={{ color: C.ink }}>
                    <option>Attestation d'assurance habitation</option>
                    <option>Pièce d'identité</option>
                    <option>RIB</option>
                    <option>Avis d'imposition</option>
                    <option>Mutuelle complémentaire</option>
                    <option>Autre</option>
                  </select>
                  <ChevronDown size={14} style={{ color: C.ink2 }}
                    className="absolute right-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label style={{ color: C.ink }} className="text-[12px] font-bold block mb-1.5">
                  Résident concerné
                </label>
                <div style={{ backgroundColor: C.bg, border: `1px solid ${C.border}` }}
                  className="rounded-xl px-4 py-3 flex items-center gap-3">
                  <Av init={reqResident.init} size={36} />
                  <div className="flex-1 min-w-0">
                    <div style={{ color: C.ink }} className="text-[13px] font-bold">{reqResident.name}</div>
                    <div style={{ color: C.ink2 }} className="text-[11px]">{reqResident.room} · {reqResident.refs}</div>
                  </div>
                  <button onClick={() => setResPickerOpen(true)}
                    style={{ color: C.accent }} className="text-[12px] font-bold shrink-0">Changer</button>
                </div>
                <div style={{ color: C.ink2 }} className="text-[11px] mt-1.5 flex items-center gap-1.5">
                  <Info size={11} className="shrink-0" />
                  Présélectionné depuis votre dernier document traité. Modifiable.
                </div>
              </div>

              <div>
                <label style={{ color: C.ink }} className="text-[12px] font-bold block mb-1.5">
                  Date limite <span style={{ color: C.ink2 }}>(J+30 par défaut)</span>
                </label>
                <div style={{ backgroundColor: C.bg, border: `1px solid ${C.border}` }}
                  className="h-11 rounded-xl px-4 flex items-center justify-between">
                  <span style={{ color: C.ink }} className="text-[13px] font-semibold">24 mai 2026</span>
                  <CalendarIcon size={14} style={{ color: C.ink2 }} />
                </div>
              </div>

              <div>
                <label style={{ color: C.ink }} className="text-[12px] font-bold block mb-1.5">
                  Message <span style={{ color: C.ink2 }}>(optionnel)</span>
                </label>
                <textarea value={reqMsg} onChange={e => setReqMsg(e.target.value)} rows={3}
                  placeholder="Ajoutez un message à la famille…"
                  style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, color: C.ink }}
                  className="w-full rounded-xl p-3 text-[13px] outline-none resize-none leading-relaxed" />
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <Btn full icon={Send} onClick={() => setReqSheet("sent")}>
                Envoyer la demande
              </Btn>
              <button onClick={() => { setReqSheet(false); navigate("S3"); }}
                style={{ color: C.ink2 }}
                className="w-full h-10 text-[12px] font-semibold">
                Formulaire complet avec options avancées →
              </button>
            </div>
          </>
        )}

        {reqSheet === "sent" && (
          <div className="flex flex-col items-center py-4 text-center">
            <div style={{ backgroundColor: C.ok }}
              className="w-20 h-20 rounded-full flex items-center justify-center mb-5">
              <Send size={32} style={{ color: C.ink }} strokeWidth={2} />
            </div>
            <h3 style={{ color: C.ink }} className="text-[20px] font-extrabold">Demande envoyée</h3>
            <p style={{ color: C.ink2 }} className="text-[13px] mt-2 mb-2 leading-relaxed">
              {reqResident.refs.split(" & ").join(" et ")} ont été notifiés.
            </p>
            <div style={{ backgroundColor: C.info, color: C.ink2 }}
              className="rounded-2xl px-4 py-3 mb-5 text-[12px] font-semibold flex items-center gap-2">
              <Clock size={14} />Relance automatique 7j avant l'échéance
            </div>
            <Tag label={reqDocType} tone="soft" />
            <div className="mt-6 w-full">
              <BtnOutline full onClick={() => { setReqSheet(false); setReqMsg(""); }}>Fermer</BtnOutline>
            </div>
          </div>
        )}
      </BottomSheet>

      {/* Resident picker for quick form */}
      <ResidentPicker open={resPickerOpen} current={reqResident}
        onSelect={r => { setReqResident(r); setResPickerOpen(false); }}
        onClose={() => setResPickerOpen(false)} />

      {/* ─ Library moderation modal ─ */}
      <BottomSheet open={!!libModal} onClose={() => setLibModal(null)} title="Modérer le document">
        {libModal && (
          libDone ? (
            <div className="flex flex-col items-center py-4 text-center gap-4">
              <div style={{ backgroundColor: C.ok }}
                className="w-16 h-16 rounded-full flex items-center justify-center">
                <Check size={28} style={{ color: C.ink }} strokeWidth={2.5} />
              </div>
              <h3 style={{ color: C.ink }} className="text-[18px] font-extrabold">
                {libDone === "archived" ? "Document archivé" : "Document dépublié"}
              </h3>
              <p style={{ color: C.ink2 }} className="text-[13px] leading-relaxed">
                {libDone === "archived"
                  ? `« ${libModal.t} » a été archivé. Il n'est plus visible par les familles.`
                  : `« ${libModal.t} » a été dépublié. Vous pouvez le republier à tout moment.`}
              </p>
              <BtnOutline full onClick={() => setLibModal(null)}>Fermer</BtnOutline>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Doc info */}
              <div style={{ backgroundColor: C.bg, border: `1px solid ${C.border}` }}
                className="rounded-2xl p-4 flex items-center gap-4">
                <div style={{ backgroundColor: C.pill }}
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                  <FileText size={22} style={{ color: C.accent }} strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ color: C.ink }} className="text-[14px] font-bold">{libModal.t}</div>
                  <div style={{ color: C.ink2 }} className="text-[12px]">{libModal.d} · PDF</div>
                  <Tag label={libModal.tag} tone="soft" />
                </div>
              </div>
              {/* Actions */}
              <div className="space-y-2.5">
                <button onClick={() => navigate("S2")}
                  style={{ backgroundColor: C.pill, color: C.ink }}
                  className="w-full py-3.5 rounded-2xl font-extrabold text-[14px] flex items-center
                    justify-center gap-2 hover:opacity-90 transition-all">
                  <Edit3 size={17} strokeWidth={2} />Modifier le document
                </button>
                <button onClick={() => setLibDone("unpublished")}
                  style={{ backgroundColor: C.info, color: C.ink }}
                  className="w-full py-3.5 rounded-2xl font-extrabold text-[14px] flex items-center
                    justify-center gap-2 hover:opacity-90 transition-all">
                  <EyeOff size={17} strokeWidth={2} />Dépublier temporairement
                </button>
                <button onClick={() => setLibDone("archived")}
                  style={{ backgroundColor: C.urgent, color: C.ink }}
                  className="w-full py-3.5 rounded-2xl font-extrabold text-[14px] flex items-center
                    justify-center gap-2 hover:opacity-90 transition-all">
                  <Archive size={17} strokeWidth={2} />Archiver définitivement
                </button>
              </div>
              <button onClick={() => setLibModal(null)}
                style={{ color: C.ink2 }} className="w-full h-10 text-[12px] font-semibold">
                Annuler
              </button>
            </div>
          )
        )}
      </BottomSheet>

      {/* ─ Créer une nouvelle rubrique ─ */}
      <BottomSheet open={addCatOpen} onClose={() => setAddCatOpen(false)} title="Créer une nouvelle rubrique">
        <div className="space-y-4">
          <div>
            <label style={{ color: C.ink }} className="text-[12px] font-bold block mb-1.5">Nom de la rubrique</label>
            <input value={newCatName} onChange={e => setNewCatName(e.target.value)}
              placeholder="ex. Vie sociale, Activités…"
              style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, color: C.ink }}
              className="w-full h-11 rounded-xl px-4 text-[13px] outline-none" />
          </div>
          <div>
            <label style={{ color: C.ink }} className="text-[12px] font-bold block mb-1.5">Icône</label>
            <div style={{ backgroundColor: C.bg, border: `1px solid ${C.border}` }}
              className="h-11 rounded-xl px-3 flex items-center justify-between">
              <span style={{ color: C.ink }} className="text-[13px] font-semibold">Dossier (par défaut)</span>
              <ChevronDown size={14} style={{ color: C.ink2 }} />
            </div>
          </div>
          <div>
            <label style={{ color: C.ink }} className="text-[12px] font-bold block mb-1.5">Visibilité</label>
            <div style={{ backgroundColor: C.bg }} className="rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <div style={{ color: C.ink }} className="text-[13px] font-bold">Visible aux familles</div>
                <div style={{ color: C.ink2 }} className="text-[11px]">La rubrique apparaît dans le coffre-fort</div>
              </div>
              <div style={{ backgroundColor: C.accent, width: 40, height: 24, borderRadius: 12, padding: 2,
                display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <div style={{ width: 20, height: 20, backgroundColor: "white", borderRadius: "50%",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />
              </div>
            </div>
          </div>
          <div style={{ backgroundColor: C.info }} className="rounded-xl p-3 flex gap-2 text-[11px]">
            <Info size={13} style={{ color: C.ink2 }} className="shrink-0 mt-0.5" />
            <span style={{ color: C.ink2 }}>
              La nouvelle rubrique sera disponible pour toutes les familles. Vous pourrez la modifier ou la masquer à tout moment.
            </span>
          </div>
          <div className="space-y-2 pt-2">
            <Btn full icon={FolderPlus}
              onClick={() => { setAddCatOpen(false); }}
              disabled={!newCatName.trim()}>
              Créer la rubrique
            </Btn>
            <button onClick={() => setAddCatOpen(false)}
              style={{ color: C.ink2 }} className="w-full h-10 text-[12px] font-semibold">
              Annuler
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* ─ Modifier une rubrique ─ */}
      <BottomSheet open={!!editCat} onClose={() => setEditCat(null)} title="Modifier la rubrique">
        {editCat && (
          <div className="space-y-4">
            <div>
              <label style={{ color: C.ink }} className="text-[12px] font-bold block mb-1.5">Nom de la rubrique</label>
              <input defaultValue={editCat}
                style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, color: C.ink }}
                className="w-full h-11 rounded-xl px-4 text-[13px] outline-none" />
            </div>
            <div className="space-y-2 pt-2">
              <Btn full icon={Check} onClick={() => setEditCat(null)}>Enregistrer</Btn>
              <button onClick={() => setEditCat(null)}
                style={{ color: C.ink2 }} className="w-full h-10 text-[12px] font-semibold">
                Annuler
              </button>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
};

// ─── S2 ───────────────────────────────────────────────────────────────────────
const ScreenS2 = ({ navigate, compact, staffRole = "manager", onRole }) => {
  const [allFamilies, setAllFamilies] = useState(true);
  const [published, setPublished] = useState(false);

  if (published) return (
    <div className="flex-1 flex flex-col min-w-0" style={{ height: "100%" }}>
      <TopBar compact={compact} staffRole={staffRole} onRole={onRole} />
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-5 max-w-sm text-center">
          <div style={{ backgroundColor: C.ok }}
            className="w-20 h-20 rounded-full flex items-center justify-center">
            <Check size={38} style={{ color: C.ink }} strokeWidth={2.5} />
          </div>
          <h2 style={{ color: C.ink }} className="text-2xl font-extrabold">Document publié</h2>
          <p style={{ color: C.ink2 }} className="text-[14px]">
            Le CR CVS T4 2026 est maintenant accessible à <strong style={{ color: C.ink }}>87 familles</strong>.
          </p>
          <Btn onClick={() => navigate("S1")}>Retour à l'espace documentaire</Btn>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col min-w-0" style={{ height: "100%" }}>
      <TopBar compact={compact} staffRole={staffRole} onRole={onRole} />
      <div className="flex-1 overflow-y-auto pb-10">
        <div className={`${compact ? "px-5 py-5" : "px-8 pt-6 pb-5"}`}>
          <button onClick={() => navigate("S1")} style={{ color: C.accent }}
            className="text-[12px] font-bold flex items-center gap-1 mb-2 hover:underline">
            <ChevronLeft size={13} />Retour
          </button>
          <div className="flex items-end justify-between">
            <div>
              <h1 style={{ color: C.ink }}
                className={`${compact ? "text-2xl" : "text-[28px]"} font-extrabold tracking-tight`}>
                Nouveau document à diffuser
              </h1>
              <p style={{ color: C.ink2 }} className="text-[13px] mt-1">Publier dans la bibliothèque résidence</p>
            </div>
            <div className="flex gap-2">
              <BtnOutline sm icon={Save} onClick={() => navigate("S1")}>Brouillon</BtnOutline>
              <Btn sm icon={Send} onClick={() => setPublished(true)}>Publier</Btn>
            </div>
          </div>
        </div>

        <div className={`${compact ? "px-5" : "px-8"} grid ${compact ? "grid-cols-1 gap-5" : "grid-cols-12 gap-6"}`}>
          <div className={compact ? "" : "col-span-7"}>
            <Card p="p-6" className="space-y-5">
              <div>
                <label style={{ color: C.ink }} className="text-[12px] font-bold block mb-1.5">Nom du document</label>
                <input defaultValue="Compte-rendu CVS du 4ᵉ trimestre 2026"
                  style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, color: C.ink }}
                  className="w-full h-11 rounded-xl px-4 text-[13px] outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ color: C.ink }} className="text-[12px] font-bold block mb-1.5">Catégorie</label>
                  <select style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, color: C.ink }}
                    className="w-full h-11 rounded-xl px-3 text-[13px] font-semibold outline-none">
                    <option>CVS · Comptes-rendus</option>
                    <option>Information générale</option>
                    <option>Qualité / Enquêtes</option>
                    <option>Menu de la semaine</option>
                  </select>
                </div>
                <div>
                  <label style={{ color: C.ink }} className="text-[12px] font-bold block mb-1.5">Accès</label>
                  <div style={{ backgroundColor: C.bg, border: `1px solid ${C.border}` }}
                    className="h-11 rounded-xl px-3 flex items-center justify-between">
                    <span style={{ color: C.ink }} className="text-[13px] font-semibold">Espace résidence</span>
                    <ChevronDown size={14} style={{ color: C.ink2 }} />
                  </div>
                </div>
              </div>
              <div>
                <label style={{ color: C.ink }} className="text-[12px] font-bold block mb-1.5">Fichier</label>
                <div style={{ borderColor: C.pill, backgroundColor: "#FDF5F3" }}
                  className="border-2 border-dashed rounded-2xl p-5 flex items-center gap-4">
                  <div style={{ backgroundColor: "white" }}
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0">
                    <FileText size={20} style={{ color: C.accent }} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ color: C.ink }} className="text-[13px] font-bold">CR_CVS_T4_2026_v2.pdf</div>
                    <div style={{ color: C.ink2 }} className="text-[11px]">842 Ko · 12 pages</div>
                  </div>
                  <button style={{ color: C.accent }} className="text-[12px] font-bold shrink-0">Remplacer</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[["Visible à partir du", "28/04/2026"], ["Visible jusqu'au", "Sans limite"]].map(([l, v], i) => (
                  <div key={i}>
                    <label style={{ color: C.ink }} className="text-[12px] font-bold block mb-1.5">{l}</label>
                    <div style={{ backgroundColor: C.bg, border: `1px solid ${C.border}` }}
                      className="h-11 rounded-xl px-3 flex items-center justify-between">
                      <span style={{ color: i === 1 ? C.ink2 : C.ink }} className="text-[13px] font-semibold">{v}</span>
                      <CalendarIcon size={14} style={{ color: C.ink2 }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className={compact ? "" : "col-span-5 space-y-4"}>
            <Card p="p-5">
              <div style={{ color: C.ink }} className="text-[13px] font-bold mb-4">Destinataires</div>
              <div style={{ backgroundColor: C.bg }} className="rounded-xl p-3.5 flex items-center justify-between mb-3">
                <div>
                  <div style={{ color: C.ink }} className="text-[13px] font-bold">Toutes les familles</div>
                  <div style={{ color: C.ink2 }} className="text-[11px]">
                    {allFamilies ? "87 familles · 142 référents" : "Sélection manuelle"}
                  </div>
                </div>
                <button onClick={() => setAllFamilies(v => !v)}
                  style={{ backgroundColor: allFamilies ? C.accent : C.neutral2, width: 40, height: 24,
                    borderRadius: 12, padding: 2, display: "flex", alignItems: "center",
                    justifyContent: allFamilies ? "flex-end" : "flex-start", transition: "all 0.2s" }}>
                  <div style={{ width: 20, height: 20, backgroundColor: "white",
                    borderRadius: "50%", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />
                </button>
              </div>
              {!allFamilies && (
                <div style={{ backgroundColor: C.bg, border: `1px solid ${C.border}` }}
                  className="rounded-xl p-3">
                  {["Jean Lefebvre · ch. 24", "Yvonne Roux · ch. 18", "Henri Dubreuil · ch. 31"].map((r, i) => (
                    <label key={i} className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                      <input type="checkbox" defaultChecked={i === 0} className="w-4 h-4 accent-[#C2185B]" />
                      <span style={{ color: C.ink }} className="text-[12px]">{r}</span>
                    </label>
                  ))}
                </div>
              )}
            </Card>
            <Card p="p-5">
              <div style={{ color: C.ink }} className="text-[13px] font-bold mb-3">Aperçu côté famille</div>
              <div style={{ backgroundColor: C.bg }} className="rounded-xl p-3 flex items-center gap-3">
                <div style={{ backgroundColor: C.pill }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                  <FileText size={18} style={{ color: C.accent }} strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span style={{ color: C.ink }} className="text-[13px] font-bold">CR CVS T4 2026</span>
                    <Tag label="Nouveau" tone="new" />
                  </div>
                  <div style={{ color: C.ink2 }} className="text-[11px]">28/04/2026 · PDF · 842 Ko</div>
                </div>
              </div>
              <div style={{ backgroundColor: C.info, color: C.ink2 }}
                className="rounded-xl p-3 mt-3 text-[11px] font-semibold flex items-center gap-2">
                <BellRing size={13} />Notification push envoyée aux familles
              </div>
            </Card>
          </div>
        </div>
      </div>
      <LotBanner lot="MVP" profiles="Manager, Staff premium" atelier />
    </div>
  );
};

// ─── S3 ───────────────────────────────────────────────────────────────────────
const ScreenS3 = ({ navigate, compact, staffRole = "manager", onRole }) => {
  const [docType, setDocType] = useState("Attestation d'assurance habitation");
  const [message, setMessage] = useState("Bonjour Madame Lefebvre, dans le cadre du renouvellement annuel des justificatifs, nous vous remercions de bien vouloir nous transmettre l'attestation d'assurance habitation 2026. Très cordialement, l'équipe des Cyclamens.");
  const [sent, setSent] = useState(false);
  const [resident, setResident] = useState(RESIDENTS_LIST[0]);
  const [resPickerOpen, setResPickerOpen] = useState(false);

  if (sent) return (
    <div className="flex-1 flex flex-col min-w-0" style={{ height: "100%" }}>
      <TopBar compact={compact} staffRole={staffRole} onRole={onRole} />
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-5 max-w-sm text-center">
          <div style={{ backgroundColor: C.ok }}
            className="w-20 h-20 rounded-full flex items-center justify-center">
            <Send size={32} style={{ color: C.ink }} strokeWidth={2} />
          </div>
          <h2 style={{ color: C.ink }} className="text-2xl font-extrabold">Demande envoyée</h2>
          <p style={{ color: C.ink2 }} className="text-[14px]">
            Les référents de {resident.name} ont été notifiés. Relance auto 7j avant échéance.
          </p>
          <Btn onClick={() => navigate("S1")}>Retour</Btn>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col min-w-0 relative" style={{ height: "100%" }}>
      <TopBar compact={compact} staffRole={staffRole} onRole={onRole} />
      <div className="flex-1 overflow-y-auto pb-10">
        <div className={`${compact ? "px-5 py-5" : "px-8 pt-6 pb-5"}`}>
          <button onClick={() => navigate("S1")} style={{ color: C.accent }}
            className="text-[12px] font-bold flex items-center gap-1 mb-2 hover:underline">
            <ChevronLeft size={13} />Retour
          </button>
          <h1 style={{ color: C.ink }}
            className={`${compact ? "text-2xl" : "text-[28px]"} font-extrabold tracking-tight`}>
            Demander un justificatif
          </h1>
          <p style={{ color: C.ink2 }} className="text-[13px] mt-1">
            La famille reçoit une notification et dépose depuis son coffre.
          </p>
        </div>
        <div className={`${compact ? "px-5" : "px-8"} grid ${compact ? "grid-cols-1 gap-5" : "grid-cols-12 gap-6"}`}>
          <div className={compact ? "" : "col-span-7"}>
            <Card p="p-6" className="space-y-5">
              <div>
                <label style={{ color: C.ink }} className="text-[12px] font-bold block mb-1.5">Type de document attendu</label>
                <select value={docType} onChange={e => setDocType(e.target.value)}
                  style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, color: C.ink }}
                  className="w-full h-11 rounded-xl px-3 text-[13px] font-semibold outline-none">
                  <option>Attestation d'assurance habitation</option>
                  <option>Pièce d'identité</option>
                  <option>RIB</option>
                  <option>Avis d'imposition</option>
                  <option>Mutuelle complémentaire</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label style={{ color: C.ink }} className="text-[12px] font-bold block mb-1.5">Résident concerné</label>
                <div style={{ backgroundColor: C.bg, border: `1px solid ${C.border}` }}
                  className="rounded-xl p-3 flex items-center gap-3">
                  <Av init={resident.init} size={38} />
                  <div className="flex-1 min-w-0">
                    <div style={{ color: C.ink }} className="text-[13px] font-bold">{resident.name}</div>
                    <div style={{ color: C.ink2 }} className="text-[11px]">{resident.room} · Référents : {resident.refs}</div>
                  </div>
                  <button onClick={() => setResPickerOpen(true)}
                    style={{ color: C.accent }} className="text-[12px] font-bold shrink-0">Changer</button>
                </div>
                <div style={{ color: C.ink2 }} className="text-[11px] mt-1.5 flex items-center gap-1.5">
                  <Info size={11} className="shrink-0" />
                  Présélectionné depuis le dernier document traité. Modifiable à tout moment.
                </div>
              </div>
              <div>
                <label style={{ color: C.ink }} className="text-[12px] font-bold block mb-1.5">Date de retour souhaitée</label>
                <div className="flex gap-2">
                  <div style={{ backgroundColor: C.bg, border: `1px solid ${C.border}` }}
                    className="flex-1 h-11 rounded-xl px-4 flex items-center justify-between">
                    <span style={{ color: C.ink }} className="text-[13px] font-semibold">24 mai 2026</span>
                    <CalendarIcon size={14} style={{ color: C.ink2 }} />
                  </div>
                  <div style={{ backgroundColor: C.bg, color: C.ink2, border: `1px solid ${C.border}` }}
                    className="px-3 h-11 rounded-xl flex items-center text-[11px] font-semibold">J+30</div>
                </div>
              </div>
              <div>
                <label style={{ color: C.ink }} className="text-[12px] font-bold block mb-1.5">
                  Message <span style={{ color: C.ink2 }}>(optionnel)</span>
                </label>
                <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4}
                  style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, color: C.ink }}
                  className="w-full rounded-xl p-3 text-[13px] outline-none resize-none leading-relaxed" />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t" style={{ borderColor: C.border }}>
                <BtnOutline sm onClick={() => navigate("S1")}>Annuler</BtnOutline>
                <Btn sm icon={Send} onClick={() => setSent(true)}>Envoyer la demande</Btn>
              </div>
            </Card>
          </div>
          <div className={compact ? "" : "col-span-5"}>
            <Card p="p-0" className="overflow-hidden">
              <div style={{ backgroundColor: C.pill }} className="px-5 pt-5 pb-4">
                <div style={{ color: C.ink }} className="text-[12px] font-bold mb-3">Aperçu de la notification</div>
                <div className="flex items-center gap-3">
                  <Av init="ML" size={38} />
                  <div>
                    <div style={{ color: C.ink }} className="text-[13px] font-bold">Marie Lefebvre</div>
                    <div style={{ color: C.ink2 }} className="text-[11px]">Référente de Jean Lefebvre</div>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div style={{ backgroundColor: C.pill }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0">
                    <BellRing size={16} style={{ color: C.accent }} />
                  </div>
                  <div>
                    <div style={{ color: C.ink }} className="text-[13px] font-bold">Nouvelle demande</div>
                    <div style={{ color: C.ink2 }} className="text-[11px]">Les Cyclamens · à l'instant</div>
                  </div>
                </div>
                <div style={{ backgroundColor: C.bg, borderLeft: `3px solid ${C.accent}` }}
                  className="rounded-r-xl p-3 text-[12px]">
                  <strong style={{ color: C.ink }}>Document demandé :</strong>
                  <div style={{ color: C.ink }} className="mt-1 font-semibold">{docType}</div>
                  <div style={{ color: C.ink2 }} className="text-[11px] mt-1">Pour Jean Lefebvre · avant le 24/05/2026</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <LotBanner lot="Lot 0.1" profiles="Manager, Staff premium" />
      <ResidentPicker open={resPickerOpen} current={resident}
        onSelect={r => { setResident(r); setResPickerOpen(false); }}
        onClose={() => setResPickerOpen(false)} />
    </div>
  );
};

// ─── S4 ───────────────────────────────────────────────────────────────────────
const ScreenS4 = ({ navigate, compact, staffRole = "manager", onRole }) => {
  const [decision, setDecision] = useState(null);
  const [refuseMotif, setRefuseMotif] = useState("Document illisible");
  const [refuseDetail, setRefuseDetail] = useState("");
  const [refuseDocType, setRefuseDocType] = useState("Attestation d'assurance habitation");

  if (decision === "validated") return (
    <div className="flex-1 flex flex-col min-w-0" style={{ height: "100%" }}>
      <TopBar compact={compact} staffRole={staffRole} onRole={onRole} />
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-5 max-w-sm text-center">
          <div style={{ backgroundColor: C.ok }}
            className="w-20 h-20 rounded-full flex items-center justify-center">
            <CheckCircle2 size={38} style={{ color: C.ink }} strokeWidth={2} />
          </div>
          <h2 style={{ color: C.ink }} className="text-2xl font-extrabold">Document validé et classé</h2>
          <p style={{ color: C.ink2 }} className="text-[14px]">
            L'attestation de Jean Lefebvre a été classée. Marie Lefebvre a été notifiée.
          </p>
          <Btn onClick={() => navigate("S1")}>Retour à la liste</Btn>
        </div>
      </div>
    </div>
  );

  if (decision === "refused") return (
    <div className="flex-1 flex flex-col min-w-0" style={{ height: "100%" }}>
      <TopBar compact={compact} staffRole={staffRole} onRole={onRole} />
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-5 max-w-sm text-center">
          <div style={{ backgroundColor: C.urgent }}
            className="w-20 h-20 rounded-full flex items-center justify-center">
            <X size={38} style={{ color: C.ink }} strokeWidth={2.5} />
          </div>
          <h2 style={{ color: C.ink }} className="text-2xl font-extrabold">Refus envoyé</h2>
          <p style={{ color: C.ink2 }} className="text-[14px]">
            Marie Lefebvre a été notifiée avec le motif.
            Une nouvelle demande de <strong style={{ color: C.ink }}>{refuseDocType}</strong> lui a été transmise.
          </p>
          <Btn onClick={() => navigate("S1")}>Retour à la liste</Btn>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col min-w-0" style={{ height: "100%" }}>
      <TopBar compact={compact} staffRole={staffRole} onRole={onRole} />
      <div className="flex-1 overflow-hidden flex flex-col pb-10">
        <div className={`${compact ? "px-5 py-4" : "px-8 pt-6 pb-4"} flex items-start justify-between shrink-0`}>
          <div>
            <button onClick={() => navigate("S1")} style={{ color: C.accent }}
              className="text-[12px] font-bold flex items-center gap-1 mb-2 hover:underline">
              <ChevronLeft size={13} />Retour à la liste
            </button>
            <h1 style={{ color: C.ink }}
              className={`${compact ? "text-xl" : "text-2xl"} font-extrabold tracking-tight`}>
              Attestation assurance habitation
            </h1>
            <div style={{ color: C.ink2 }} className="text-[12px] mt-1 flex items-center gap-3 flex-wrap">
              <span>Par <strong style={{ color: C.ink }}>Marie Lefebvre</strong></span>
              <span>Pour <strong style={{ color: C.ink }}>Jean Lefebvre</strong> · ch. 24</span>
              <span>26/04/2026 · 14h32</span>
            </div>
          </div>
          <Tag label="En attente" tone="pending" />
        </div>

        <div className={`flex-1 ${compact ? "px-5" : "px-8"} grid grid-cols-12 gap-5 min-h-0 overflow-hidden`}>
          {/* PDF */}
          <div className="col-span-7 min-h-0">
            <Card p="p-0" className="h-full flex flex-col overflow-hidden">
              <div style={{ borderBottom: `1px solid ${C.border}` }}
                className="px-4 py-2.5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <FileText size={13} style={{ color: C.accent }} />
                  <span style={{ color: C.ink }} className="text-[12px] font-bold">attestation_assurance_2026.pdf</span>
                </div>
                <button style={{ color: C.ink2 }} className="text-[11px] font-semibold flex items-center gap-1">
                  <Download size={13} />Télécharger
                </button>
              </div>
              <div style={{ backgroundColor: C.neutral }} className="flex-1 p-5 overflow-auto flex justify-center">
                <div style={{ backgroundColor: "white", boxShadow: "0 4px 20px -8px rgba(54,10,6,0.15)" }}
                  className="w-full max-w-xs rounded p-6">
                  <div className="flex items-start justify-between mb-4 pb-3 border-b" style={{ borderColor: C.border }}>
                    <div>
                      <div className="text-sm font-black" style={{ color: "#1E5BA8" }}>AssurEvolution</div>
                      <div style={{ color: C.ink2 }} className="text-[9px]">Compagnie d'assurances</div>
                    </div>
                    <div style={{ color: C.ink2 }} className="text-[9px] text-right">n° 2026-AH-487612<br />01/01 → 31/12/2026</div>
                  </div>
                  <div className="text-center mb-4">
                    <div style={{ color: C.ink }} className="text-[11px] font-black">ATTESTATION D'ASSURANCE HABITATION</div>
                  </div>
                  <div style={{ color: C.ink, fontSize: 10, lineHeight: 1.6 }} className="space-y-2">
                    <p>Nous, <strong>AssurEvolution</strong>, attestons que :</p>
                    <p style={{ backgroundColor: C.bg, padding: 8, borderRadius: 6 }} className="font-semibold">
                      M. Jean Lefebvre<br />Chambre 24 — Les Cyclamens, Challex
                    </p>
                    <p>est titulaire d'un contrat multirisque habitation couvrant son lieu de résidence,
                    valable du 01/01/2026 au 31/12/2026.</p>
                  </div>
                  <div className="mt-5 pt-3 border-t flex justify-between" style={{ borderColor: C.border }}>
                    <div style={{ color: C.ink2 }} className="text-[8px]">Lyon, 18 avril 2026</div>
                    <div className="w-12 h-8 border-2 border-dashed rounded flex items-center justify-center"
                      style={{ borderColor: "#1E5BA8" }}>
                      <span className="text-[7px] font-bold" style={{ color: "#1E5BA8" }}>CACHET</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Panneau validation */}
          <div className="col-span-5 flex flex-col gap-3 overflow-y-auto">
            <Card p="p-5" className="shrink-0">
              <div style={{ color: C.ink2 }} className="text-[11px] font-bold uppercase tracking-wide mb-3">Vérifications</div>
              {["Document lisible et complet", "Nom du résident présent", "Valide pour 2026"].map((c, i) => (
                <div key={i} className="flex items-center gap-2.5 py-2">
                  <div style={{ backgroundColor: C.ok }}
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                    <Check size={11} strokeWidth={3} style={{ color: C.ink }} />
                  </div>
                  <span style={{ color: C.ink }} className="text-[12px] font-semibold">{c}</span>
                </div>
              ))}
            </Card>

            {decision !== "refusing" ? (
              <div className="space-y-2.5 shrink-0">
                <button onClick={() => setDecision("validated")}
                  style={{ backgroundColor: C.ok, color: C.ink }}
                  className="w-full py-3.5 rounded-2xl font-extrabold text-[14px] flex items-center
                    justify-center gap-2 hover:opacity-90 transition-all">
                  <CheckCircle2 size={18} strokeWidth={2.2} />Valider le document
                </button>
                <BtnWarn full onClick={() => setDecision("refusing")} icon={X}>
                  Refuser avec motif
                </BtnWarn>
              </div>
            ) : (
              <Card p="p-5" className="shrink-0">
                <div style={{ color: C.accent }} className="text-[12px] font-bold uppercase tracking-wide mb-3">
                  Motif du refus
                </div>
                <div className="space-y-3">
                  <div>
                    <label style={{ color: C.ink }} className="text-[11px] font-bold block mb-1">Motif principal</label>
                    <select value={refuseMotif} onChange={e => setRefuseMotif(e.target.value)}
                      style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, color: C.ink }}
                      className="w-full h-10 rounded-xl px-3 text-[12px] font-semibold outline-none">
                      <option>Document illisible</option>
                      <option>Document expiré</option>
                      <option>Mauvais document</option>
                      <option>Informations manquantes</option>
                      <option>Autre</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ color: C.ink }} className="text-[11px] font-bold block mb-1">
                      Type de document à redemander
                    </label>
                    <select value={refuseDocType} onChange={e => setRefuseDocType(e.target.value)}
                      style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, color: C.ink }}
                      className="w-full h-10 rounded-xl px-3 text-[12px] font-semibold outline-none">
                      <option>Attestation d'assurance habitation</option>
                      <option>Pièce d'identité</option>
                      <option>Avis d'imposition</option>
                      <option>Mutuelle complémentaire</option>
                      <option>RIB</option>
                      <option>Autre</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ color: C.ink }} className="text-[11px] font-bold block mb-1">Précisions</label>
                    <textarea value={refuseDetail} onChange={e => setRefuseDetail(e.target.value)}
                      rows={3} placeholder="Message à la famille…"
                      style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, color: C.ink }}
                      className="w-full rounded-xl p-2.5 text-[12px] outline-none resize-none" />
                  </div>
                  <div className="flex gap-2">
                    <BtnOutline sm onClick={() => setDecision(null)}>Annuler</BtnOutline>
                    <button onClick={() => setDecision("refused")}
                      style={{ backgroundColor: C.accent, color: "white" }}
                      className="flex-1 h-11 rounded-xl text-[12px] font-bold">
                      Envoyer le refus
                    </button>
                  </div>
                </div>
              </Card>
            )}

            <Card p="p-5" className="flex-1 min-h-0">
              <div style={{ color: C.ink2 }} className="text-[11px] font-bold uppercase tracking-wide mb-3">
                Historique · Jean Lefebvre
              </div>
              <div className="space-y-3 relative pl-5">
                <div className="absolute left-1.5 top-2 bottom-2 w-px" style={{ backgroundColor: C.border }} />
                {[
                  { d: "26/04", t: "Attestation assurance déposée",  tone: "pending" },
                  { d: "24/04", t: "Demande envoyée (Marie & Paul)", tone: "info" },
                  { d: "12/03", t: "Pièce d'identité validée",       tone: "ok" },
                  { d: "08/02", t: "RIB validé",                     tone: "ok" },
                ].map((h, i) => (
                  <div key={i} className="relative">
                    <div style={{ backgroundColor: h.tone === "ok" ? C.ok : h.tone === "pending" ? C.urgent : C.info }}
                      className="absolute -left-5 top-1 w-3 h-3 rounded-full ring-2 ring-white" />
                    <div style={{ color: C.ink }} className="text-[12px] font-semibold">{h.t}</div>
                    <div style={{ color: C.ink2 }} className="text-[10px]">{h.d}/2026</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
      <LotBanner lot="Lot 0.1" profiles="Manager, Staff standard, Staff premium" atelier />
    </div>
  );
};

// ─── FS — Signature ───────────────────────────────────────────────────────────
const ScreenFS = ({ navigate }) => {
  const [step, setStep] = useState("view"); // "view" | "sign" | "done"
  return (
    <div className="w-full flex flex-col" style={{ height: "100%", backgroundColor: C.bg }}>
      <header className="pt-10 pb-3 px-5 flex items-center gap-3 shrink-0">
        <button onClick={() => step === "sign" ? setStep("view") : navigate("F1")}
          style={{ backgroundColor: "white" }}
          className="w-10 h-10 rounded-full flex items-center justify-center
            shadow-[0_2px_8px_-4px_rgba(54,10,6,0.12)] shrink-0">
          <ChevronLeft size={18} style={{ color: C.ink }} strokeWidth={2} />
        </button>
        <div className="flex-1 text-center min-w-0">
          <div style={{ color: C.ink2 }} className="text-[10px] font-bold uppercase tracking-wide">Document à signer</div>
          <div style={{ color: C.ink }} className="text-[13px] font-bold">Contrat de séjour 2026</div>
        </div>
        <div className="w-10 shrink-0" />
      </header>

      {step === "view" && (
        <div className="flex-1 overflow-y-auto px-5 pb-4">
          {/* Bandeau urgence */}
          <div style={{ backgroundColor: C.urgent }} className="rounded-2xl px-4 py-3 mb-4 flex items-center gap-3">
            <AlertTriangle size={16} style={{ color: C.ink }} strokeWidth={2} />
            <span style={{ color: C.ink }} className="text-[13px] font-bold">À signer avant le 15/05/2026</span>
          </div>
          {/* Document */}
          <div style={{ backgroundColor: "white", border: `1px solid ${C.border}` }}
            className="rounded-2xl overflow-hidden mb-4">
            <div className="p-5 border-b" style={{ borderColor: C.border }}>
              <div style={{ color: C.accent }} className="text-xl font-black mb-0.5">DomusVi</div>
              <div style={{ color: C.ink }} className="text-[15px] font-extrabold">Contrat de séjour</div>
              <div style={{ color: C.ink2 }} className="text-[11px]">Jean Lefebvre · Les Cyclamens — Challex · 2026</div>
            </div>
            <div className="p-5 space-y-3">
              {[
                ["Résident", "Jean Lefebvre"],
                ["Résidence", "Les Cyclamens — Challex"],
                ["Type de chambre", "Chambre individuelle 24"],
                ["Date d'entrée", "01/03/2026"],
                ["Tarif mensuel", "3 800,00 €"],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between items-center py-1.5 border-b border-dashed"
                  style={{ borderColor: C.border }}>
                  <span style={{ color: C.ink2 }} className="text-[12px]">{l}</span>
                  <span style={{ color: C.ink }} className="text-[12px] font-bold">{v}</span>
                </div>
              ))}
            </div>
            <div style={{ backgroundColor: C.bg }} className="px-5 py-4">
              <div style={{ color: C.ink2 }} className="text-[11px] leading-relaxed">
                En signant ce document, vous acceptez les conditions générales du contrat de séjour
                établies par DomusVi pour la résidence Les Cyclamens. Le contrat complet (PDF) est
                disponible ci-dessous.
              </div>
            </div>
          </div>
          <button style={{ color: C.accent }}
            className="w-full text-[13px] font-bold py-2 mb-4 flex items-center justify-center gap-2">
            <FileText size={14} strokeWidth={2} />Lire le contrat complet (PDF)
          </button>
          <Btn full icon={FileSignature} onClick={() => setStep("sign")}>
            Signer ce document
          </Btn>
        </div>
      )}

      {step === "sign" && (
        <div className="flex-1 overflow-y-auto px-5 pb-4">
          <p style={{ color: C.ink2 }} className="text-[13px] mb-4 leading-relaxed">
            Tracez votre signature dans la zone ci-dessous, ou tapez vos initiales pour valider.
          </p>
          {/* Zone de signature */}
          <div style={{ backgroundColor: "white", border: `2px dashed ${C.accent}`, minHeight: 160 }}
            className="rounded-2xl flex flex-col items-center justify-center gap-3 mb-4 p-6">
            <FileSignature size={32} style={{ color: C.ink3 }} strokeWidth={1.5} />
            <span style={{ color: C.ink3 }} className="text-[13px] font-semibold">
              Zone de signature
            </span>
            <span style={{ color: C.ink3 }} className="text-[11px] text-center">
              Tracez votre signature ici (prototype)
            </span>
          </div>
          {/* Initiales */}
          <div style={{ backgroundColor: C.pill }} className="rounded-2xl p-4 mb-4 flex items-center gap-3">
            <Av init="JL" size={40} solid />
            <div>
              <div style={{ color: C.ink }} className="text-[13px] font-bold">Jean Lefebvre</div>
              <div style={{ color: C.ink2 }} className="text-[11px]">Signataire · {new Date().toLocaleDateString("fr-FR")}</div>
            </div>
          </div>
          <Btn full icon={Check} onClick={() => setStep("done")}>
            Confirmer la signature
          </Btn>
          <button onClick={() => setStep("view")} style={{ color: C.ink2 }}
            className="w-full h-10 mt-2 text-[13px] font-semibold">
            Annuler
          </button>
        </div>
      )}

      {step === "done" && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-10">
          <div style={{ backgroundColor: C.ok }}
            className="w-24 h-24 rounded-full flex items-center justify-center mb-6
              shadow-[0_12px_32px_-12px_rgba(63,107,31,0.25)]">
            <Check size={44} style={{ color: C.ink }} strokeWidth={2.5} />
          </div>
          <h2 style={{ color: C.ink }} className="text-[26px] font-extrabold text-center tracking-tight">
            Document signé
          </h2>
          <p style={{ color: C.ink2 }} className="text-[13px] mt-3 mb-5 text-center leading-relaxed max-w-xs">
            Votre <strong style={{ color: C.ink }}>contrat de séjour 2026</strong> a été signé et
            transmis à la résidence Les Cyclamens.
          </p>
          <div style={{ backgroundColor: "white", border: `1px solid ${C.border}` }}
            className="rounded-2xl p-4 w-full flex items-center gap-3 mb-5">
            <div style={{ backgroundColor: C.blueSoft }}
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
              <FileCheck2 size={18} style={{ color: C.ink2 }} strokeWidth={2} />
            </div>
            <div>
              <div style={{ color: C.ink }} className="text-[13px] font-bold">Copie enregistrée dans votre coffre</div>
              <div style={{ color: C.ink2 }} className="text-[11px]">Contrats & assurances · Accessible à tout moment</div>
            </div>
          </div>
          <Btn full icon={ChevronLeft} onClick={() => navigate("F1")}>
            Retour à mes documents
          </Btn>
        </div>
      )}

      <LotBanner lot="Lot 0.1" profiles="Famille / Résident" atelier />
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ═════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [mode, setMode] = useState("mobile");
  const [familleScreen, setFamilleScreen] = useState("F1");
  const [staffScreen, setStaffScreen] = useState("S1");
  const [showNotice, setShowNotice] = useState(false);
  const [f3From, setF3From] = useState("F2");
  const [f3Doc, setF3Doc] = useState({ type: "facture", title: "Facture novembre 2026" });
  const [f3DocList, setF3DocList] = useState([]);
  const [f3DocIdx, setF3DocIdx] = useState(-1);
  // ─ Overlay panels ─
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  // ─ Animation states ─
  const [familleDir, setFamilleDir] = useState("forward");
  const [familleKey, setFamilleKey] = useState(0);
  const [staffDir, setStaffDir] = useState("forward");
  const [staffKey, setStaffKey] = useState(0);
  const prevMode = useRef("mobile");

  // Staff role simulation
  const [staffRole, setStaffRole] = useState("manager");
  const [roleOpen,  setRoleOpen]  = useState(false);

  // Profondeur de navigation pour déterminer la direction d'animation
  const F_DEPTH = { F1: 0, F2: 1, F3: 2, F4: 2, F5: 2, FS: 2 };
  const S_DEPTH = { S1: 0, S2: 1, S3: 1, S4: 1 };

  useEffect(() => {
    // Chargement Manrope
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(link);
    // Styles globaux : Manrope universel + animations + hover mobile
    const style = document.createElement("style");
    style.id = "fv-global";
    style.textContent = `
      *, *::before, *::after {
        font-family: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif !important;
      }

      /* ── Navigation screens ── */
      @keyframes screenEnterRight {
        from { transform: translateX(100%); }
        to   { transform: translateX(0); }
      }
      @keyframes screenEnterLeft {
        from { transform: translateX(-100%); }
        to   { transform: translateX(0); }
      }
      .screen-enter-right {
        animation: screenEnterRight 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        will-change: transform;
      }
      .screen-enter-left {
        animation: screenEnterLeft 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        will-change: transform;
      }

      /* ── Mobile : supprimer hover transforms, préserver active ── */
      .mobile-view *:hover:not(:active) {
        transform: none !important;
      }

      /* ── Mobile : pressed effect uniforme sur tous les boutons ── */
      .mobile-view button:active,
      .mobile-view a:active {
        transform: scale(0.96) !important;
        opacity: 0.82 !important;
        transition: transform 70ms ease-out, opacity 70ms ease-out !important;
      }

      /* ── Mobile : masquer les scrollbars pour éviter les décalages de largeur ── */
      .mobile-view * {
        scrollbar-width: none !important;
      }
      .mobile-view *::-webkit-scrollbar {
        display: none !important;
      }
    `;
    if (!document.getElementById("fv-global")) document.head.appendChild(style);
  }, []);

  useEffect(() => {
    const prev = prevMode.current;
    prevMode.current = mode;
    if (mode === "mobile" && prev !== "mobile") setFamilleScreen("F1");
    else if (mode !== "mobile" && prev === "mobile") setStaffScreen("S1");
  }, [mode]);

  const navFamille = (screen, ctx = {}) => {
    if (["accueil", "gazette", "residence"].includes(screen)) {
      setShowNotice(true);
      setTimeout(() => setShowNotice(false), 2000);
      return;
    }
    if (ctx.from !== undefined) setF3From(ctx.from);
    if (ctx.doc !== undefined) setF3Doc(ctx.doc);
    if (screen === "F3") {
      setF3DocList(ctx.docList ?? []);
      setF3DocIdx(ctx.docIdx ?? -1);
    }
    const curDepth = F_DEPTH[familleScreen] || 0;
    const newDepth = F_DEPTH[screen] || 0;
    setFamilleDir(newDepth >= curDepth ? "forward" : "back");
    setFamilleKey(k => k + 1);
    setFamilleScreen(screen);
  };

  const navStaff = (screen) => {
    const curDepth = S_DEPTH[staffScreen] || 0;
    const newDepth = S_DEPTH[screen] || 0;
    setStaffDir(newDepth >= curDepth ? "forward" : "back");
    setStaffKey(k => k + 1);
    setStaffScreen(screen);
  };

  const compact = mode === "tablet";

  const familleScreens = {
    F1: <ScreenF1 navigate={navFamille} onNav={navFamille} showNotice={showNotice}
                  onNotif={() => setNotifOpen(true)} onProfile={() => setProfileOpen(true)} />,
    F2: <ScreenF2 navigate={navFamille} onNav={navFamille} onNotif={() => setNotifOpen(true)} />,
    F3: <ScreenF3 navigate={navFamille} onNav={navFamille} f3From={f3From} f3Doc={f3Doc}
                  f3DocList={f3DocList} f3DocIdx={f3DocIdx} />,
    F4: <ScreenF4 navigate={navFamille} onNav={navFamille} />,
    F5: <ScreenF5 navigate={navFamille} onNav={navFamille} />,
    FS: <ScreenFS navigate={navFamille} />,
  };

  const roleProps = { staffRole, onRole: () => setRoleOpen(true) };
  const staffScreens = {
    S1: <ScreenS1 navigate={navStaff} compact={compact} {...roleProps} />,
    S2: <ScreenS2 navigate={navStaff} compact={compact} {...roleProps} />,
    S3: <ScreenS3 navigate={navStaff} compact={compact} {...roleProps} />,
    S4: <ScreenS4 navigate={navStaff} compact={compact} {...roleProps} />,
  };

  // Wrapper animé pour la navigation par profondeur
  const animClass = (dir) => dir === "forward" ? "screen-enter-right" : "screen-enter-left";

  return (
    <ModeContext.Provider value={mode}>
    <div style={{ fontFamily: '"Manrope", -apple-system, sans-serif', backgroundColor: "#EDE5E2", minHeight: "100vh" }}>
      {/* Top bar */}
      <div style={{ backgroundColor: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.border}` }}
        className="sticky top-0 z-50 px-6 py-4">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div style={{ backgroundColor: C.accent }}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg">D</div>
            <div>
              <div className="flex items-center gap-2">
                <span style={{ color: C.ink }} className="text-[15px] font-extrabold">FamilyVi</span>
                <span style={{ backgroundColor: C.pill, color: C.accent }}
                  className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                  Coffre-fort · v3
                </span>
              </div>
              <div style={{ color: C.ink2 }} className="text-[11px] font-medium">DomusVi · Prototype soutenance</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: "mobile",  icon: Smartphone, label: "Mobile",   sub: "App Famille" },
              { id: "tablet",  icon: Tablet,     label: "Tablette", sub: "App Staff" },
              { id: "desktop", icon: Monitor,    label: "Desktop",  sub: "App Staff" },
            ].map(({ id, icon: Ic, label, sub }) => {
              const on = mode === id;
              return (
                <button key={id} onClick={() => setMode(id)}
                  style={on
                    ? { backgroundColor: C.accent, color: "white" }
                    : { backgroundColor: "white", color: C.ink, border: `1.5px solid ${C.border}` }}
                  className="px-4 h-11 rounded-2xl flex items-center gap-2.5 font-bold text-[13px]
                    hover:scale-[1.02] active:scale-[0.98] transition-all">
                  <Ic size={16} strokeWidth={2} />
                  <div className="text-left leading-tight">
                    <div>{label}</div>
                    <div className="text-[10px] font-medium opacity-80">{sub}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{ backgroundColor: C.info, color: C.ink2 }}
            className="px-3 py-1.5 rounded-xl text-[11px] font-semibold">
            {mode === "mobile"
              ? "App Famille — flux distinct du Staff"
              : "App Staff — même flux, layout adapté"}
          </div>
        </div>
      </div>

      {/* Viewport — mobile centré, staff full-width */}
      <div className={mode === "mobile" ? "max-w-[1500px] mx-auto" : "w-full"}>
        {mode === "mobile" && (
          <PhoneFrame>
            {/* Wrapper animé — w-full + overflow-hidden pour largeur constante */}
            <div key={familleKey}
              className={`w-full flex-1 overflow-hidden flex flex-col ${animClass(familleDir)}`}>
              {familleScreens[familleScreen]}
            </div>
            {/* FNav hors du wrapper animé pour ne pas glisser lors des transitions */}
            <FNav active="compte" onNav={navFamille} />
            {/* Panels — z-50, couvrent FNav via le stacking context du PhoneFrame */}
            <NotifPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
            <ProfilePanel open={profileOpen} onClose={() => setProfileOpen(false)} />
            {showNotice && <ModuleNotice />}
          </PhoneFrame>
        )}
        {mode === "desktop" && (
          <DesktopFrame>
            <Sidebar active="documents" compact={false} />
            <div key={staffKey}
              className="flex-1 min-w-0 overflow-hidden flex flex-col">
              {staffScreens[staffScreen]}
            </div>
            <RolePanel open={roleOpen} staffRole={staffRole}
              onSelect={r => { setStaffRole(r); setRoleOpen(false); }}
              onClose={() => setRoleOpen(false)} />
          </DesktopFrame>
        )}
        {mode === "tablet" && (
          <TabletFrame>
            <Sidebar active="documents" compact={true} />
            <div key={staffKey}
              className="flex-1 min-w-0 overflow-hidden flex flex-col">
              {staffScreens[staffScreen]}
            </div>
            <RolePanel open={roleOpen} staffRole={staffRole}
              onSelect={r => { setStaffRole(r); setRoleOpen(false); }}
              onClose={() => setRoleOpen(false)} />
          </TabletFrame>
        )}
      </div>

      <div className="max-w-[1500px] mx-auto px-6 pb-8 pt-2">
        <div style={{ backgroundColor: "rgba(255,255,255,0.6)", border: `1px solid ${C.border}` }}
          className="rounded-2xl px-5 py-4 flex items-start gap-3">
          <Info size={14} style={{ color: C.accent }} className="shrink-0 mt-0.5" />
          <div style={{ color: C.ink2 }} className="text-[12px] leading-relaxed">
            <strong style={{ color: C.ink }}>Navigation :</strong> cliquez directement dans le prototype.
            Picto <AlertTriangle size={11} className="inline" style={{ color: C.ink2 }} /> = atelier de cadrage requis (DAC).
            Accueil · Gazette · Résidence → prototypés séparément.
          </div>
        </div>
      </div>
    </div>
    </ModeContext.Provider>
  );
}
