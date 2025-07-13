/* ========= 1. 後端 URL ============================================= */
// 先用 Cloud Run 的 https 網址；本機測試則可自動 fallback
const API_BASE =
  window.API_BASE || "https://hsinchu-trip-planner-backend-320837244860.asia-east1.run.app";

/* ========= 2. 表單送出 ============================================ */
document.getElementById("tripForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // ------------- (a) 取得表單值 ----------------
  const areas = [...document.querySelectorAll("input[name=area]:checked")]
                .map((cb) => cb.value);

  const categoriesRaw = [...document.querySelectorAll("input[name=like]:checked")]
                        .map((cb) => cb.value);

  // 中→英對應 (若你的 value 已經是英文，可省略)
  const catMap = { "食物": "food", "玩樂": "play", "風景": "photo" };
  const categories = categoriesRaw.map(c => catMap[c] || c);

  const sliderVal = Number(document.getElementById("mySlider").value); // 0 / 50 / 100
  const indoor_outdoor = sliderVal === 0 ? "outdoor"
                       : sliderVal === 100 ? "indoor"
                       : "mixed";

  const payload = {
    areas,
    start_date: document.getElementById("startDate").value,
    end_date:   document.getElementById("endDate").value,
    indoor_outdoor,
    budget_hotel: Number(
      document.querySelector("input[name=hotel_budget]")?.value || 0),
    budget_play:  Number(
      document.querySelector("input[name=play_budget]")?.value  || 0),
    categories,
    spot_count: Number(
      document.querySelector("input[name=spot_cnt]")?.value || 5),
  };

  // ------------- (b) 呼叫後端 -------------------
  try {
    const res  = await fetch(`${API_BASE}/api/plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(await res.text());

    const plan = await res.json();
    // 附帶使用者條件一起存，itinerary 可以算預算條
    localStorage.setItem("plan", JSON.stringify({ ...plan, ...payload }));

    // ------------- (c) 跳轉 ----------------------
    window.location.href = "itinerary.html";
  } catch (err) {
    console.error(err);
    alert("建立行程失敗，請稍後再試！");
  }
});

