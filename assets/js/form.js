document.getElementById("tripForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const areas = [...document.querySelectorAll("input[name=area]:checked")].map(
    (cb) => cb.value
  );
  const categories = [
    ...document.querySelectorAll("input[name=like]:checked"),
  ].map((cb) => cb.value);
  const payload = {
    areas,
    start_date: document.getElementById("startDate").value,
    end_date: document.getElementById("endDate").value,
    indoor_outdoor: ["indoor", "mixed", "outdoor"][
      document.getElementById("mySlider").value / 50
    ],
    budget_hotel: Number(
      document.querySelector("input[name=hotel_budget]").value || 0
    ),
    budget_play: Number(
      document.querySelector("input[name=play_budget]").value || 0
    ),
    categories,
    spot_count: Number(
      document.querySelector("input[name=spot_cnt]").value || 5
    ),
  };

  const res = await fetch("http://127.0.0.1:8000/api/plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const plan = await res.json();
  localStorage.setItem("plan", JSON.stringify(plan)); // 臨時存
  window.location.href = "itinerary.html";
});
