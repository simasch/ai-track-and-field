import {
    a2 as $,
    ak as I,
    al as c,
    b as H,
    E,
    F as a,
    J as g,
    j as p,
    L as k,
    M as D,
    Q as C,
    U as P,
    u as w,
    v as A,
    W as V,
    x as S
} from "./copilot-_lIGjjDp.js";
import {r as x} from "./state-Ca0NTNkv.js";
import {B as T} from "./base-panel-BP2hYfzZ.js";
import {i as d} from "./icons-CJwGJ_MG.js";
import {c as O, e as h} from "./early-project-state-CXnqwb94.js";

const j = 'copilot-info-panel{--dev-tools-red-color: red;--dev-tools-grey-color: gray;--dev-tools-green-color: green;position:relative}copilot-info-panel dl{margin:0;width:100%}copilot-info-panel dl>div{align-items:center;display:flex;gap:var(--space-50);height:var(--size-m);padding:0 var(--space-150);position:relative}copilot-info-panel dl>div:after{border-bottom:1px solid var(--divider-secondary-color);content:"";inset:auto var(--space-150) 0;position:absolute}copilot-info-panel dl dt{color:var(--secondary-text-color)}copilot-info-panel dl dd{align-items:center;display:flex;font-weight:var(--font-weight-medium);gap:var(--space-50);margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}copilot-info-panel dl dd span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}copilot-info-panel dl dd span.icon{display:inline-flex;vertical-align:bottom}copilot-info-panel dd.live-reload-status>span{overflow:hidden;text-overflow:ellipsis;display:block;color:var(--status-color)}copilot-info-panel dd span.hidden{display:none}copilot-info-panel code{white-space:nowrap;-webkit-user-select:all;user-select:all}copilot-info-panel .checks{display:inline-grid;grid-template-columns:auto 1fr;gap:var(--space-50)}copilot-info-panel span.hint{font-size:var(--font-size-0);background:var(--gray-50);padding:var(--space-75);border-radius:var(--radius-2)}';
var J = Object.defineProperty, N = Object.getOwnPropertyDescriptor, v = (e, t, n, i) => {
  for (var o = i > 1 ? void 0 : i ? N(t, n) : t, s = e.length - 1, l; s >= 0; s--)
    (l = e[s]) && (o = (i ? l(t, n, o) : l(o)) || o);
  return i && o && J(t, n, o), o;
};
let u = class extends T {
  constructor() {
    super(...arguments), this.serverInfo = [], this.clientInfo = [{ name: "Browser", version: navigator.userAgent }], this.handleServerInfoEvent = (e) => {
      const t = JSON.parse(e.data.info);
      this.serverInfo = t.versions, I().then((n) => {
        n && (this.clientInfo.unshift({ name: "Vaadin Employee", version: "true", more: void 0 }), this.requestUpdate("clientInfo"));
      }), g() === "success" && $("hotswap-active", { value: k() });
    };
  }
  connectedCallback() {
    super.connectedCallback(), this.onCommand("copilot-info", this.handleServerInfoEvent), this.onEventBus("system-info-with-callback", (e) => {
      e.detail.callback(this.getInfoForClipboard(e.detail.notify));
    }), this.reaction(
      () => p.idePluginState,
      () => {
        this.requestUpdate("serverInfo");
      }
    );
  }
  getIndex(e) {
    return this.serverInfo.findIndex((t) => t.name === e);
  }
  render() {
    const e = p.newVaadinVersionState?.versions !== void 0 && p.newVaadinVersionState.versions.length > 0, t = [...this.serverInfo, ...this.clientInfo];
    let n = this.getIndex("Spring") + 1;
    n === 0 && (n = t.length), h.springSecurityEnabled && (t.splice(n, 0, { name: "Spring Security", version: "true" }), n++), h.springJpaDataEnabled && (t.splice(n, 0, { name: "Spring Data JPA", version: "true" }), n++);
    const i = t.find((o) => o.name === "Vaadin");
    return i && (i.more = a` <button
        aria-label="Edit Vaadin Version"
        class="icon relative"
        id="new-vaadin-version-btn"
        title="Edit Vaadin Version"
        @click="${(o) => {
      o.stopPropagation(), S.updatePanel("copilot-vaadin-versions", { floating: !0 });
    }}">
        ${d.editAlt}
        ${e ? a`<span aria-hidden="true" class="absolute bg-error end-0 h-75 rounded-full top-0 w-75"></span>` : ""}
      </button>`), a` <style>
        ${j}
      </style>
      <div class="flex flex-col gap-150 items-start">
        <dl>
          ${t.map(
      (o) => a`
              <div>
                <dt>${o.name}</dt>
                <dd title="${o.version}">
                  <span> ${this.renderValue(o.version)} </span>
                  ${o.more}
                </dd>
              </div>
            `
    )}
          ${this.renderDevWorkflowSection()}
        </dl>
        ${this.renderDevelopmentWorkflowButton()}
      </div>`;
  }
  renderDevWorkflowSection() {
    const e = g(), t = this.getIdePluginLabelText(p.idePluginState), n = this.getHotswapAgentLabelText(e);
    return a`
      <div>
        <dt>Java Hotswap</dt>
        <dd>
          ${f(e === "success", e === "success" ? "Enabled" : "Disabled")} ${n}
        </dd>
      </div>
      ${c() !== "unsupported" ? a` <div>
            <dt>IDE Plugin</dt>
            <dd>
              ${f(
      c() === "success",
      c() === "success" ? "Installed" : "Not Installed"
    )}
              ${t}
            </dd>
          </div>` : E}
    `;
  }
  renderDevelopmentWorkflowButton() {
    const e = C();
    let t = "", n = null, i = "";
    return e.status === "success" ? (t = "success", n = d.check, i = "Details") : e.status === "warning" ? (t = "warning", n = d.lightning, i = "Improve Development Workflow") : e.status === "error" && (t = "error", n = d.alertCircle, i = "Fix Development Workflow"), a`
      <button
        class="mx-50"
        id="development-workflow-guide"
        @click="${() => {
      V();
    }}">
        <span class="prefix ${t}-text"> ${n} </span>
        ${i}
        <span class="suffix">
          <span class="bg-${t} end-0 h-75 rounded-full top-0 w-75"></span>
        </span>
      </button>
    `;
  }
  getHotswapAgentLabelText(e) {
    return e === "success" ? "Java Hotswap is enabled" : e === "error" ? "Hotswap is partially enabled" : "Hotswap is disabled";
  }
  getIdePluginLabelText(e) {
    if (c() !== "success")
      return "Not installed";
    if (e?.version) {
      let t = null;
      return e?.ide && (e?.ide === "intellij" ? t = "IntelliJ" : e?.ide === "vscode" ? t = "VS Code" : e?.ide === "eclipse" && (t = "Eclipse")), t ? `${e?.version} ${t}` : e?.version;
    }
    return "Not installed";
  }
  renderValue(e) {
    return e === "false" ? f(!1, "False") : e === "true" ? f(!0, "True") : e;
  }
  getInfoForClipboard(e) {
    const t = this.renderRoot.querySelectorAll(".items-start dt"), o = Array.from(t).map((s) => ({
      key: s.textContent.trim(),
      value: s.nextElementSibling.textContent.trim()
    })).filter((s) => s.key !== "Live reload").filter((s) => !s.key.startsWith("Vaadin Emplo")).map((s) => {
      const { key: l } = s;
      let { value: r } = s;
      if (l === "IDE Plugin")
        r = this.getIdePluginLabelText(p.idePluginState) ?? "false";
      else if (l === "Java Hotswap") {
        const y = p.jdkInfo?.jrebel, m = g();
        y && m === "success" ? r = "JRebel is in use" : r = this.getHotswapAgentLabelText(m);
      } else l === "Vaadin" && r.indexOf(`
`) !== -1 && (r = r.substring(0, r.indexOf(`
`)));
      return `${l}: ${r}`;
    }).join(`
`);
    return e && P({
      type: D.INFORMATION,
      message: "Environment information copied to clipboard",
      dismissId: "versionInfoCopied"
    }), o.trim();
  }
};
v([
  x()
], u.prototype, "serverInfo", 2);
v([
  x()
], u.prototype, "clientInfo", 2);
u = v([
  w("copilot-info-panel")
], u);
let b = class extends A {
  createRenderRoot() {
    return this;
  }
  connectedCallback() {
    super.connectedCallback(), this.style.display = "flex";
  }
  render() {
    return a` <button
      @click=${() => {
      H.emit("system-info-with-callback", {
        callback: O,
        notify: !0
      });
    }}
      aria-label="Copy to Clipboard"
      class="icon"
      title="Copy to Clipboard">
      <span>${d.copy}</span>
    </button>`;
  }
};
b = v([
  w("copilot-info-actions")
], b);
const B = {
  header: "Info",
  expanded: !1,
  panelOrder: 15,
  panel: "right",
  floating: !1,
  tag: "copilot-info-panel",
  actionsTag: "copilot-info-actions",
  eager: !0
  // Render even when collapsed as error handling depends on this
}, W = {
  init(e) {
    e.addPanel(B);
  }
};
window.Vaadin.copilot.plugins.push(W);
function f(e, t) {
  return e ? a`<span aria-label=${t} class="icon success-text" title=${t}>${d.check}</span>` : a`<span aria-label=${t} class="icon error-text" title=${t}>${d.x}</span>`;
}
export {
  b as Actions,
  u as CopilotInfoPanel
};
