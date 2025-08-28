import {a2 as g, am as f, an as h, F as r, j as d, M as u, U as c, u as m} from "./copilot-_lIGjjDp.js";
import {B as v} from "./base-panel-BP2hYfzZ.js";
import {i as b} from "./icons-CJwGJ_MG.js";

const w = "copilot-features-panel{padding:var(--space-100);font:var(--font-xsmall);display:grid;grid-template-columns:auto 1fr;gap:var(--space-50);height:auto}copilot-features-panel a{display:flex;align-items:center;gap:var(--space-50);white-space:nowrap}copilot-features-panel a svg{height:12px;width:12px;min-height:12px;min-width:12px}";
var $ = Object.getOwnPropertyDescriptor, x = (e, a, t, n) => {
  for (var o = n > 1 ? void 0 : n ? $(a, t) : a, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (o = i(o) || o);
  return o;
};
const l = window.Vaadin.devTools;
let p = class extends v {
  render() {
    return r` <style>
        ${w}
      </style>
      ${d.featureFlags.map(
      (e) => r`
          <copilot-toggle-button
            .title="${e.title}"
            ?checked=${e.enabled}
            @on-change=${(a) => this.toggleFeatureFlag(a, e)}>
          </copilot-toggle-button>
          <a class="ahreflike" href="${e.moreInfoLink}" title="Learn more" target="_blank"
            >learn more ${b.share}</a
          >
        `
    )}`;
  }
  toggleFeatureFlag(e, a) {
    const t = e.target.checked;
    g("use-feature", { source: "toggle", enabled: t, id: a.id }), l.frontendConnection ? (l.frontendConnection.send("setFeature", { featureId: a.id, enabled: t }), c({
      type: u.INFORMATION,
      message: `“${a.title}” ${t ? "enabled" : "disabled"}`,
      details: a.requiresServerRestart ? f() : void 0,
      dismissId: `feature${a.id}${t ? "Enabled" : "Disabled"}`
    }), h()) : l.log("error", `Unable to toggle feature ${a.title}: No server connection available`);
  }
};
p = x([
  m("copilot-features-panel")
], p);
const F = {
  header: "Features",
  expanded: !1,
  panelOrder: 35,
  panel: "right",
  floating: !1,
  tag: "copilot-features-panel",
  helpUrl: "https://vaadin.com/docs/latest/flow/configuration/feature-flags"
}, y = {
  init(e) {
    e.addPanel(F);
  }
};
window.Vaadin.copilot.plugins.push(y);
export {
  p as CopilotFeaturesPanel
};
