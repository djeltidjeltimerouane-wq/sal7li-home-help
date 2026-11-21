export const COMMUNES = ["معسكر","بوحنيفية","تيزي","حسين","ماوسة","تغنيف","الهاشم","سيدي قادة","زلامطة","وادي الأبطال","عين فراح","غريس","فروحة","مطمور","ماقضة","سيدي بوسعيد","البرج","عين فكان","بنيان","خلوية","المنور","وادي التاغية","عوف","عين فارس","عين فراس","سيق","عقاز","العلايمية","القعدة","زهانة","المحمدية","سيدي عبد المومن","فراقيق","الغمري","سجرارة","مقطع الدوز","بوهني","القطنة","المأمونية","القرط","غروس","قرجوم","الشرفة","رأس عين عميروش","نسموط","سيدي عبد الجبار","السهايلية"] as const;

export const SERVICES = [
  { id: "plumbing", name: "سباكة", icon: "🚰", price: 2500 },
  { id: "electric", name: "كهربائي", icon: "⚡", price: 2000 },
  { id: "appliances", name: "مصلح صيانة الأجهزة", icon: "🔧", price: 3000 },
  { id: "sealing", name: "الترصيص", icon: "🧱", price: 2500 },
  { id: "welding", name: "التلحيم", icon: "🔥", price: 3500 },
] as const;

export type EscrowStatus = "held" | "assigned" | "in_progress" | "completed" | "released" | "refunded";
export interface Order { amount: number; status: EscrowStatus }

/** المبلغ يُحجز عند الدفع */
export const pay = (amount: number): Order => ({ amount, status: "held" });
/** يُحوَّل للحرفي فقط بعد التنفيذ ورضا الزبون */
export function release(o: Order, satisfied: boolean): Order {
  if (o.status !== "completed" || !satisfied) throw new Error("لا يمكن تحويل المبلغ");
  return { ...o, status: "released" };
}
/** يُسترجع للزبون عند غياب الحرفي أو التأخر قبل إتمام الخدمة */
export function refund(o: Order): Order {
  if (o.status === "released" || o.status === "completed") throw new Error("لا يمكن الاسترجاع");
  return { ...o, status: "refunded" };
}
