// Create Supabase client
var supabaseClient = window.supabase.createClient(
  window.CONFIG.SUPABASE_URL,
  window.CONFIG.SUPABASE_ANON_KEY
);

// Grab elements
var loadAttemptsBtn = document.getElementById("loadAttemptsBtn");
var loadMetricsBtn  = document.getElementById("loadMetricsBtn");
var statusText      = document.getElementById("statusText");
var tbody           = document.querySelector("#attemptsTable tbody");
var chartCanvas     = document.getElementById("metricsChart");

var chart = null;

// Button handlers
loadAttemptsBtn.onclick = function () {
  loadAttempts(25);
};

loadMetricsBtn.onclick = function () {
  loadMetrics(200);
};

// Load recent attempts
function loadAttempts(limit) {
  statusText.textContent = "Loading attempts...";
  tbody.innerHTML = '<tr><td colspan="4" class="muted">Loading...</td></tr>';

  supabaseClient
    .from("Signup")
    .select("email,result,reason,created_at")
    .order("created_at", { ascending: false })
    .limit(limit)
    .then(function (res) {
      if (res.error) {
        statusText.textContent = "Failed to load attempts.";
        console.log(res.error);
        return;
      }

      var rows = res.data || [];
      tbody.innerHTML = "";

      if (rows.length === 0) {
        tbody.innerHTML =
          '<tr><td colspan="4" class="muted">No attempts found.</td></tr>';
        statusText.textContent = "No data found.";
        return;
      }

      for (var i = 0; i < rows.length; i++) {
        var a = rows[i];
        var tr = document.createElement("tr");

        tr.innerHTML =
          "<td>" + escapeHtml(a.email) + "</td>" +
          "<td>" + escapeHtml(a.result) + "</td>" +
          "<td>" + escapeHtml(a.reason) + "</td>" +
          "<td>" + formatTime(a.created_at) + "</td>";

        tbody.appendChild(tr);
      }

      statusText.textContent = "Loaded " + rows.length + " attempt(s).";
    });
}

// Load Metric Chart
function loadMetrics(limit) {
  statusText.textContent = "Loading metrics...";

  supabaseClient
    .from("Signup")
    .select("result,reason")
    .limit(limit)
    .then(function (res) {
      if (res.error) {
        statusText.textContent = "Failed to load metrics.";
        console.log(res.error);
        return;
      }

      var rows = res.data || [];
      var counts = {};

      for (var i = 0; i < rows.length; i++) {
        if (rows[i].result !== "Rejected") continue;

        var reason = rows[i].reason || "Unknown";
        if (!counts[reason]) counts[reason] = 0;
        counts[reason]++;
      }

      var labels = [];
      var values = [];

      for (var key in counts) {
        labels.push(key);
        values.push(counts[key]);
      }

      if (chart) chart.destroy();
      chart = new Chart(chartCanvas, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            { label: "Rejections", data: values }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });

      statusText.textContent = "Metrics updated.";
    });
}

// Utility functions
function formatTime(ts) {
  return ts ? new Date(ts).toLocaleString() : "";
}

function escapeHtml(str) {
  return String(str || "").replace(/[&<>"']/g, function (s) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[s];
  });
}
