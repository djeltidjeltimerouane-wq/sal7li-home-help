import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { COMMUNES, SERVICES, pay, release, refund, type Order } from "@/lib/sal7li";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "صلحلي Sal7Li — حرفيون موثوقون في معسكر" },
      { name: "description", content: "احجز سباكاً أو كهربائياً أو مصلح أجهزة في بلديات معسكر بدفع محمي وخدمة مضمونة." },
      { property: "og:title", content: "صلحلي Sal7Li" },
      { property: "og:description", content: "حرفيون موثوقون، دفع محمي، وخدمة مضمونة في ولاية معسكر." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: App,
});

type Screen = "login" | "signup" | "location" | "service" | "schedule" | "payment" | "execution" | "rating" | "done";

const inp = "w-full rounded-xl border border-input bg-card px-4 py-3 text-base outline-none focus:ring-2 focus:ring-ring";
const btn = "w-full rounded-xl bg-primary py-3.5 font-bold text-primary-foreground shadow-soft disabled:opacity-40";
const btn2 = "w-full rounded-xl border border-primary py-3 font-bold text-primary";

function Shell({ title, step, children, onBack }: { title: string; step?: number; children: ReactNode; onBack?: () => void }) {
  return (
    <div className="mx-auto min-h-screen max-w-md bg-background">
      <header className="bg-hero px-5 pb-6 pt-5 text-primary-foreground">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-extrabold">صلحلي <span className="text-accent">Sal7Li</span></span>
          {onBack && <button onClick={onBack} className="text-sm opacity-80">رجوع ←</button>}
        </div>
        <h1 className="mt-4 text-xl font-bold">{title}</h1>
        {step && <div className="mt-3 flex gap-1">{[1,2,3,4,5,6].map(i => <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-accent" : "bg-primary-foreground/25"}`} />)}</div>}
      </header>
      <main className="space-y-4 p-5">{children}</main>
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [user, setUser] = useState({ first: "", last: "", phone: "", email: "", pass: "", pass2: "" });
  const [login, setLogin] = useState({ email: "", pass: "" });
  const [err, setErr] = useState("");
  const [commune, setCommune] = useState("");
  const [q, setQ] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState(""); const [time, setTime] = useState("");
  const [method, setMethod] = useState<"baridimob" | "edahabia" | "">("");
  const [card, setCard] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [msgs, setMsgs] = useState<{ me: boolean; t: string }[]>([{ me: false, t: "مرحباً بك في خدمة عملاء صلحلي، كيف يمكننا مساعدتك؟" }]);
  const [msg, setMsg] = useState("");
  const [stars, setStars] = useState(0); const [comment, setComment] = useState("");
  const service = SERVICES.find(s => s.id === serviceId);

  const doLogin = () => {
    const saved = JSON.parse(localStorage.getItem("sal7li_users") || "[]") as typeof user[];
    const u = saved.find(x => x.email === login.email.trim() && x.pass === login.pass);
    if (!u) return setErr("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    setUser(u); setErr(""); setScreen("location");
  };
  const doSignup = () => {
    if (!user.first || !user.last) return setErr("أدخل الاسم واللقب");
    if (!/^0[5-7]\d{8}$/.test(user.phone)) return setErr("رقم الهاتف غير صحيح (مثال: 0555123456)");
    if (!/^\S+@\S+\.\S+$/.test(user.email)) return setErr("البريد الإلكتروني غير صحيح");
    if (user.pass.length < 6) return setErr("كلمة المرور 6 أحرف على الأقل");
    if (user.pass !== user.pass2) return setErr("كلمتا المرور غير متطابقتين");
    const saved = JSON.parse(localStorage.getItem("sal7li_users") || "[]");
    localStorage.setItem("sal7li_users", JSON.stringify([...saved, user]));
    setErr(""); setScreen("location");
  };
  const send = () => { if (!msg.trim()) return; setMsgs(m => [...m, { me: true, t: msg }, { me: false, t: "شكراً، تم استلام استفسارك وسيتواصل معك أحد أعواننا." }]); setMsg(""); };

  if (screen === "login") return (
    <Shell title="تسجيل الدخول">
      <p className="text-muted-foreground">حرفيون موثوقون، دفع محمي، وخدمة في موعدها.</p>
      <input className={inp} type="email" placeholder="البريد الإلكتروني" value={login.email} onChange={e => setLogin({ ...login, email: e.target.value })} />
      <input className={inp} type="password" placeholder="كلمة المرور" value={login.pass} onChange={e => setLogin({ ...login, pass: e.target.value })} />
      {err && <p className="text-sm text-destructive">{err}</p>}
      <button className={btn} onClick={doLogin}>دخول</button>
      <button className={btn2} onClick={() => { setErr(""); setScreen("signup"); }}>إنشاء حساب جديد</button>
    </Shell>
  );

  if (screen === "signup") return (
    <Shell title="إنشاء حساب المستخدم" onBack={() => setScreen("login")}>
      <div className="grid grid-cols-2 gap-3">
        <input className={inp} placeholder="الاسم" value={user.first} onChange={e => setUser({ ...user, first: e.target.value })} />
        <input className={inp} placeholder="اللقب" value={user.last} onChange={e => setUser({ ...user, last: e.target.value })} />
      </div>
      <input className={inp} inputMode="tel" placeholder="رقم الهاتف" value={user.phone} onChange={e => setUser({ ...user, phone: e.target.value })} />
      <input className={inp} type="email" placeholder="البريد الإلكتروني" value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} />
      <input className={inp} type="password" placeholder="كلمة المرور" value={user.pass} onChange={e => setUser({ ...user, pass: e.target.value })} />
      <input className={inp} type="password" placeholder="تأكيد كلمة المرور" value={user.pass2} onChange={e => setUser({ ...user, pass2: e.target.value })} />
      {err && <p className="text-sm text-destructive">{err}</p>}
      <button className={btn} onClick={doSignup}>إنشاء الحساب</button>
    </Shell>
  );

  if (screen === "location") return (
    <Shell title="حدد موقعك — ولاية معسكر" step={1}>
      <input className={inp} placeholder="ابحث عن بلديتك..." value={q} onChange={e => setQ(e.target.value)} />
      <div className="grid max-h-[55vh] grid-cols-2 gap-2 overflow-y-auto">
        {COMMUNES.filter(c => c.includes(q)).map(c => (
          <button key={c} onClick={() => setCommune(c)} className={`rounded-xl border px-3 py-3 text-sm font-medium ${commune === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}>📍 {c}</button>
        ))}
      </div>
      <button className={btn} disabled={!commune} onClick={() => setScreen("service")}>التالي</button>
    </Shell>
  );

  if (screen === "service") return (
    <Shell title="اختر الخدمة" step={2} onBack={() => setScreen("location")}>
      {SERVICES.map(s => (
        <button key={s.id} onClick={() => setServiceId(s.id)} className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-right ${serviceId === s.id ? "border-primary bg-secondary" : "border-border bg-card"}`}>
          <span className="text-3xl">{s.icon}</span>
          <span className="flex-1 font-bold">{s.name}</span>
          <span className="font-bold text-primary">{s.price} دج</span>
        </button>
      ))}
      <button className={btn} disabled={!serviceId} onClick={() => setScreen("schedule")}>التالي</button>
    </Shell>
  );

  if (screen === "schedule") return (
    <Shell title="حدد تاريخ ووقت الموعد" step={3} onBack={() => setScreen("service")}>
      <label className="block font-medium">التاريخ<input className={`${inp} mt-1`} type="date" min={new Date().toISOString().slice(0, 10)} value={date} onChange={e => setDate(e.target.value)} /></label>
      <p className="font-medium">الوقت</p>
      <div className="grid grid-cols-3 gap-2">
        {["08:00","10:00","12:00","14:00","16:00","18:00"].map(t => (
          <button key={t} onClick={() => setTime(t)} className={`rounded-xl border py-3 font-bold ${time === t ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}>{t}</button>
        ))}
      </div>
      <button className={btn} disabled={!date || !time} onClick={() => setScreen("payment")}>التالي</button>
    </Shell>
  );

  if (screen === "payment") return (
    <Shell title="الدفع" step={4} onBack={() => setScreen("schedule")}>
      <div className="rounded-2xl bg-card p-4 shadow-soft">
        <div className="flex justify-between"><span>{service?.icon} {service?.name}</span><b>{service?.price} دج</b></div>
        <p className="mt-1 text-sm text-muted-foreground">📍 {commune} · 📅 {date} · 🕒 {time}</p>
      </div>
      <div className="flex gap-2 rounded-2xl bg-success/15 p-3 text-sm font-bold text-success">
        <span className="flex-1 text-center">🔒 Payment Protected</span><span className="flex-1 text-center">✅ Services Guaranteed</span>
      </div>
      {([["baridimob","بريدي موب","📱"],["edahabia","البطاقة الذهبية","💳"]] as const).map(([id, n, ic]) => (
        <button key={id} onClick={() => setMethod(id)} className={`flex w-full items-center gap-3 rounded-2xl border p-4 font-bold ${method === id ? "border-primary bg-secondary" : "border-border bg-card"}`}>{ic} {n}</button>
      ))}
      {method && <input className={inp} inputMode="numeric" placeholder={method === "edahabia" ? "رقم البطاقة الذهبية (16 رقم)" : "رقم الحساب البريدي (RIP)"} value={card} onChange={e => setCard(e.target.value.replace(/\D/g, ""))} />}
      <p className="text-xs text-muted-foreground">يُحجز المبلغ بشكل آمن لدى صلحلي ولا يُسلَّم للحرفي إلا بعد تنفيذ الخدمة ورضاك عنها.</p>
      <button className={btn} disabled={!method || card.length < 10} onClick={() => { setOrder({ ...pay(service!.price), status: "assigned" }); setScreen("execution"); }}>ادفع {service?.price} دج</button>
    </Shell>
  );

  if (screen === "execution" && order) {
    const steps = ["تم الدفع والمبلغ محجوز", "تم توجيه الحرفي", "الحرفي في الطريق / ينفذ الخدمة", "تم إنجاز الخدمة"];
    const idx = order.status === "assigned" ? 1 : order.status === "in_progress" ? 2 : order.status === "completed" ? 3 : 0;
    return (
      <Shell title="تنفيذ الخدمة" step={5}>
        {order.status === "refunded" ? (
          <div className="rounded-2xl bg-card p-6 text-center shadow-soft">
            <p className="text-4xl">↩️</p><p className="mt-2 text-lg font-bold">تم رفض الطلب واسترجاع {order.amount} دج</p>
            <p className="text-sm text-muted-foreground">أُعيد المبلغ إلى حسابك بطريقة آمنة وسريعة.</p>
            <button className={`${btn} mt-4`} onClick={() => { setOrder(null); setScreen("service"); }}>طلب جديد</button>
          </div>
        ) : <>
          <div className="rounded-2xl bg-card p-4 shadow-soft">
            <p className="font-bold">👷 الحرفي: كريم بن علي · {service?.name}</p>
            <p className="text-sm text-muted-foreground">📍 {commune} · {date} {time}</p>
            <ol className="mt-3 space-y-2">{steps.map((s, i) => <li key={s} className={`flex items-center gap-2 text-sm ${i <= idx ? "font-bold text-primary" : "text-muted-foreground"}`}>{i <= idx ? "●" : "○"} {s}</li>)}</ol>
          </div>
          {order.status === "assigned" && <button className={btn} onClick={() => setOrder({ ...order, status: "in_progress" })}>وصل الحرفي — بدأ التنفيذ</button>}
          {order.status === "in_progress" && <button className={btn} onClick={() => setOrder({ ...order, status: "completed" })}>تم إنجاز الخدمة</button>}
          {order.status === "completed" && <button className={btn} onClick={() => setScreen("rating")}>قيّم الخدمة وأكّد رضاك</button>}
          {order.status !== "completed" && <button className="w-full rounded-xl border border-destructive py-3 font-bold text-destructive" onClick={() => setOrder(refund(order))}>الحرفي لم يحضر / تأخر — رفض الطلب واسترجاع المبلغ</button>}
          <div className="rounded-2xl bg-card p-4 shadow-soft">
            <p className="mb-2 font-bold">💬 خدمة العملاء — استفسار وتعليق</p>
            <div className="max-h-48 space-y-2 overflow-y-auto">{msgs.map((m, i) => <p key={i} className={`w-fit max-w-[85%] rounded-xl px-3 py-2 text-sm ${m.me ? "bg-primary text-primary-foreground" : "mr-auto bg-muted"}`}>{m.t}</p>)}</div>
            <div className="mt-2 flex gap-2"><input className={inp} placeholder="اكتب استفسارك..." value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} /><button className="rounded-xl bg-accent px-4 font-bold text-accent-foreground" onClick={send}>إرسال</button></div>
          </div>
        </>}
      </Shell>
    );
  }

  if (screen === "rating" && order) return (
    <Shell title="تقييم الخدمة" step={6}>
      <div className="flex justify-center gap-2 text-4xl">{[1,2,3,4,5].map(i => <button key={i} onClick={() => setStars(i)} className={i <= stars ? "text-accent" : "text-border"}>★</button>)}</div>
      <textarea className={`${inp} min-h-28`} placeholder="اكتب تعليقك حول الخدمة..." value={comment} onChange={e => setComment(e.target.value)} />
      <button className={btn} disabled={!stars} onClick={() => { setOrder(release(order, true)); setScreen("done"); }}>أنا راضٍ — حوّل المبلغ للحرفي</button>
    </Shell>
  );

  return (
    <Shell title="شكراً لك!">
      <div className="rounded-2xl bg-card p-6 text-center shadow-soft">
        <p className="text-5xl">✅</p>
        <p className="mt-3 text-lg font-bold">تم تحويل {order?.amount} دج إلى الحرفي بأمان</p>
        <p className="text-sm text-muted-foreground">تقييمك: {"★".repeat(stars)}</p>
      </div>
      <button className={btn} onClick={() => { setOrder(null); setServiceId(""); setStars(0); setComment(""); setScreen("service"); }}>طلب خدمة جديدة</button>
    </Shell>
  );
}
