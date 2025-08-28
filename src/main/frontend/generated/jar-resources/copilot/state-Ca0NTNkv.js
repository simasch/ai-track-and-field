import {ao as u, ap as p} from "./copilot-_lIGjjDp.js";

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const l = { attribute: !0, type: String, converter: p, reflect: !1, hasChanged: u }, d = (t = l, n, e) => {
  const { kind: s, metadata: i } = e;
  let r = globalThis.litPropertyMetadata.get(i);
  if (r === void 0 && globalThis.litPropertyMetadata.set(i, r = /* @__PURE__ */ new Map()), s === "setter" && ((t = Object.create(t)).wrapped = !0), r.set(e.name, t), s === "accessor") {
    const { name: a } = e;
    return { set(o) {
      const c = n.get.call(this);
      n.set.call(this, o), this.requestUpdate(a, c, t);
    }, init(o) {
      return o !== void 0 && this.C(a, void 0, t, o), o;
    } };
  }
  if (s === "setter") {
    const { name: a } = e;
    return function(o) {
      const c = this[a];
      n.call(this, o), this.requestUpdate(a, c, t);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function h(t) {
  return (n, e) => typeof e == "object" ? d(t, n, e) : ((s, i, r) => {
    const a = i.hasOwnProperty(r);
    return i.constructor.createProperty(r, s), a ? Object.getOwnPropertyDescriptor(i, r) : void 0;
  })(t, n, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function b(t) {
  return h({ ...t, state: !0, attribute: !1 });
}
export {
  h as n,
  b as r
};
