(function () {
  var script = document.currentScript;
  if (!script) return;

  var agentId = script.getAttribute("data-agent-id") || "";
  var publicKey = script.getAttribute("data-public-key") || "";
  if (!agentId || !publicKey) return;

  var position = script.getAttribute("data-position") || "bottom-right";
  var theme = script.getAttribute("data-theme") || "auto";
  var accent = script.getAttribute("data-accent") || "#1438f5";
  var metadataKeys = (script.getAttribute("data-metadata") || "")
    .split(",")
    .map(function (item) { return item.trim(); })
    .filter(Boolean);
  var baseUrl = new URL(script.src, window.location.href).origin;
  var mount = document.getElementById("voice-agent-widget");
  var params = new URLSearchParams(window.location.search);
  var metadata = {
    PageUrl: window.location.href,
    PageTitle: document.title || "",
    Referrer: document.referrer || ""
  };

  metadataKeys.forEach(function (key) {
    var value = params.get(key) || params.get(key.toLowerCase()) || script.getAttribute("data-" + key.toLowerCase());
    if (value) metadata[key] = value;
  });

  var iframe = document.createElement("iframe");
  iframe.src = baseUrl + "/agents/embedded?" + new URLSearchParams({
    id: agentId,
    k: publicKey,
    theme: theme,
    position: position,
    accent: accent,
    parent_origin: window.location.origin,
    metadata: JSON.stringify(metadata)
  }).toString();
  iframe.title = "Voice assistant";
  iframe.allow = "microphone; autoplay";
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  iframe.style.border = "0";
  iframe.style.colorScheme = "normal";
  iframe.style.zIndex = "2147483647";

  function setSize(width, height) {
    iframe.style.width = typeof width === "number" ? width + "px" : width;
    iframe.style.height = typeof height === "number" ? height + "px" : height;
  }

  if (position === "inline") {
    iframe.style.display = "block";
    iframe.style.maxWidth = "100%";
    iframe.style.minHeight = "540px";
    setSize("100%", 540);
    (mount || script.parentElement || document.body).appendChild(iframe);
  } else {
    iframe.style.position = "fixed";
    iframe.style.bottom = "20px";
    iframe.style[position === "bottom-left" ? "left" : "right"] = "20px";
    iframe.style.borderRadius = "18px";
    iframe.style.overflow = "hidden";
    setSize(76, 76);
    document.body.appendChild(iframe);
  }

  window.addEventListener("message", function (event) {
    if (event.origin !== baseUrl || !event.data || event.data.type !== "voice-agent-widget-resize") return;
    if (position === "inline") {
      setSize("100%", event.data.height || 540);
      return;
    }
    setSize(event.data.width || (event.data.expanded ? 380 : 76), event.data.height || (event.data.expanded ? 540 : 76));
  });
})();
