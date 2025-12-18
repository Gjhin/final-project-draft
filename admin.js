document.addEventListener("DOMContentLoaded", () => {
  // IMPORTANT: set this to your teammate's backend port
  const API_URL = "http://localhost:3000/api/validate-email";

  const loadAttemptsBtn = document.getElementById("loadAttemptsBtn");
  const loadMetricsBtn  = document.getElementById("loadMetricsBtn");
  const statusText      = document.getElementById("statusText");
  const tbody           = document.querySelector("#attemptsTable tbody");
  const chartCanvas     = document.getElementById("metricsChart");

  let chart = null;

  loadAttemptsBtn.addEventListener("click", loadAttempts);
  loadMetricsBtn.addEventListener("click", loadMetrics);

  async function postJSON(payload) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    if (!res.ok) throw new Error(`(${res.status}) ${text}`);

    return JSON.parse(text);
  }

  async function loadAttempts() {
    statusText.textContent = "Loading attempts...";
    tbody.innerHTML = `<tr><td colspan="4" class="muted">Loading...</td></tr>`;

    try {
      const data = await postJSON({ mode: "recent", limit: 25 });
      const attempts = Array.isArray(data.attempts) ? data.attempts : [];

      tbody.innerHTML = "";
      if (attempts.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="muted">No attempts found.</td></tr>`;
      } else {
        attempts.forEach(a => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${escapeHtml(a.email || "")}</td>
            <td>${escapeHtml(a.result || "")}</td>
            <td>${escapeHtml(a.reason || "")}</td>
            <td>${a.created_at ? new Date(a.created_at).toLocaleString() : ""}</td>
          `;
          tbody.appendChild(tr);
        });
      }

      statusText.textContent = `Loaded ${attempts.length} attempt(s).`;
    } catch (err) {
      statusText.textContent = "Failed to load attempts.";
      tbody.innerHTML = `<tr><td colspan="4">Error: ${escapeHtml(err.message)}</td></tr>`;
      console.error(err);
    }
  }

  async function loadMetrics() {
    statusText.textContent = "Loading metrics...";

    try {
      const data = await postJSON({ mode: "metrics" });
      const topReasons = Array.isArray(data.topReasons) ? data.topReasons : [];

      const labels = topReasons.map(x => x.reason);
      const values = topReasons.map(x => x.count);

      if (chart) chart.destroy();
      chart = new Chart(chartCanvas, {
        type: "bar",
        data: {
          labels,
          datasets: [{ label: "Rejections", data: values }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });

      statusText.textContent = "Metrics updated.";
    } catch (err) {
      statusText.textContent = "Failed to load metrics.";
      console.error(err);
      alert("Metrics error: " + err.message);
    }
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, s => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[s]));
  }
});
