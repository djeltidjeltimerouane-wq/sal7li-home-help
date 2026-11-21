import { describe, it, expect } from "vitest";
import { COMMUNES, pay, release, refund } from "./sal7li";
describe("sal7li", () => {
  it("47 بلدية", () => expect(COMMUNES.length).toBe(47));
  it("payment is held", () => expect(pay(2500).status).toBe("held"));
  it("release only after completion + satisfaction", () => {
    expect(() => release(pay(2500), true)).toThrow();
    expect(() => release({ amount: 1, status: "completed" }, false)).toThrow();
    expect(release({ amount: 1, status: "completed" }, true).status).toBe("released");
  });
  it("refund on no-show, not after release", () => {
    expect(refund({ amount: 1, status: "assigned" }).status).toBe("refunded");
    expect(() => refund({ amount: 1, status: "released" })).toThrow();
  });
});
