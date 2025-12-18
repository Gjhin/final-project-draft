import express from "express";

import cors from "cors";

import dotenv from "dotenv";

import supabase from""";

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.static("public"));



app.get("/", (req, res) => {
  res.sendFile("home.html", { root: "public" });
});

app.get("/about", (req, res) => {
  res.sendFile("about.html", { root: "public" });
});

app.get("/admin", (req, res) => {
  res.sendFile("admin.html", { root: "public" });
});



app.post("/api/validate-email", async (req, res) => {
  const { email, mode, limit = 25 } = req.body;

  try {
   
    if (!mode || mode === "check") {
      let accepted = true;
      let reason = "Valid email";

      if (!email || !email.includes("@")) {
        accepted = false;
        reason = "Invalid format";
      } else if (!email.endsWith("@umd.edu")) {
        accepted = false;
        reason = "Invalid domain";
      }

    
      await supabase.from("signups").insert([
        { email, result: accepted ? "accepted" : "rejected", reason }
      ]);

      return res.json({ accepted, reason });
    }

 
    if (mode === "recent") {
      const { data } = await supabase
        .from("signups")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      return res.json({ attempts: data });
    }

    if (mode === "metrics") {
      const { data } = await supabase
        .from("signups")
        .select("reason")
        .eq("result", "rejected");

      const counts = {};
      data.forEach(r => {
        counts[r.reason] = (counts[r.reason] || 0) + 1;
      });

      const topReasons = Object.entries(counts).map(([reason, count]) => ({
        reason,
        count
      }));

      return res.json({ topReasons });
    }

    res.status(400).json({ error: "Invalid mode" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
