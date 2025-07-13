/* itinerary.js — 去除匯出按鈕，加上推薦飯店卡 */

//////////////////////////////////////////////////////////////////////
//  1. 讀行程 ------------------------------------------------------- //
//////////////////////////////////////////////////////////////////////
const plan = JSON.parse(localStorage.getItem("plan") || "{}");
if (!plan.days) {
  alert("找不到行程資料，請回首頁重新建立！");
}

//////////////////////////////////////////////////////////////////////
//  2. DOM ---------------------------------------------------------- //
//////////////////////////////////////////////////////////////////////
const dayLists = document.getElementById("dayLists");
const suggestZone = document.getElementById("suggestZone");
const costNowEl = document.getElementById("costNow");
const budgetMaxEl = document.getElementById("budgetMax");
const costBar = document.getElementById("costBar");
const hotelCard = document.getElementById("hotelCard");

//////////////////////////////////////////////////////////////////////
//  3. 常量 --------------------------------------------------------- //
//////////////////////////////////////////////////////////////////////
let activeDay = 1;
const budgetPlay = plan.budget_play || 999999;
budgetMaxEl.textContent = budgetPlay.toString();

//////////////////////////////////////////////////////////////////////
//  4. 產生飯店卡 --------------------------------------------------- //
//////////////////////////////////////////////////////////////////////
(function renderHotel() {
  if (!plan.hotel) return;
  hotelCard.innerHTML = `
    <div style="background:#fff;border:1px solid #ccc;border-radius:8px;padding:10px;margin:10px 0;">
      <strong style="font-size:1rem;color:var(--purple);">${
        plan.hotel.name
      }</strong><br/>
      <span class="spot-meta">${plan.hotel.address}</span><br/>
      <span class="spot-meta">參考房價：NT$ ${plan.hotel.price.toLocaleString()}</span>
    </div>`;
})();

//////////////////////////////////////////////////////////////////////
//  5. 產生多日清單 (同頁顯示) ------------------------------------- //
//////////////////////////////////////////////////////////////////////
plan.days.forEach((spots, idx) => {
  const day = idx + 1;

  const h3 = document.createElement("h3");
  h3.textContent = `DAY ${day}`;
  h3.dataset.day = day;
  h3.style =
    "margin:6px 0 2px;padding:2px 6px;cursor:pointer;color:var(--purple);";
  if (day === 1) {
    h3.style.background = "var(--purple)";
    h3.style.color = "#fff";
  }
  h3.onclick = () => {
    document.querySelectorAll("h3[data-day]").forEach((t) => {
      t.style.background = "";
      t.style.color = "var(--purple)";
    });
    h3.style.background = "var(--purple)";
    h3.style.color = "#fff";
    activeDay = day;
  };
  dayLists.appendChild(h3);

  const ul = document.createElement("ul");
  ul.className = "day-list";
  ul.dataset.day = day;
  dayLists.appendChild(ul);

  spots.forEach((s) => ul.appendChild(renderCard(s)));
  new Sortable(ul, { group: "days", animation: 150, onEnd: updateCost });
});

//////////////////////////////////////////////////////////////////////
//  6. 建議區 ------------------------------------------------------- //
//////////////////////////////////////////////////////////////////////
(plan.suggestions || []).forEach((s) => {
  const div = document.createElement("div");
  div.className = "suggest-card";
  div.innerHTML = `
    <strong>${s.name}</strong><br/>
    <span class="spot-meta">${s.address}</span><br/>
    <span class="spot-meta">營業 ${s.open_time}–${s.close_time}</span><br/>
    <button class="add-btn">➕ 加入行程</button>`;
  div.dataset.data = JSON.stringify(s);
  suggestZone.appendChild(div);
});
suggestZone.addEventListener("click", (e) => {
  if (!e.target.classList.contains("add-btn")) return;
  const s = JSON.parse(e.target.parentElement.dataset.data);
  const ul = dayLists.querySelector(`ul[data-day="${activeDay}"]`);
  ul.appendChild(renderCard(s));
  updateCost();
});

//////////////////////////////////////////////////////////////////////
//  7. 景點卡元件 --------------------------------------------------- //
//////////////////////////////////////////////////////////////////////
function renderCard(s) {
  const li = document.createElement("li");
  li.className = "spot-card";
  li.dataset.ticket = s.ticket || 0;
  li.innerHTML = `
   <div>
     <strong>${s.name}</strong><br/>
     <span class="spot-meta">${s.address}</span><br/>
     <span class="spot-meta">營業 ${s.open_time}–${s.close_time}</span>
   </div>
   <button class="btn-del">🗑</button>`;
  li.querySelector(".btn-del").onclick = () => {
    li.remove();
    updateCost();
  };
  return li;
}

//////////////////////////////////////////////////////////////////////
//  8. 預算條 ------------------------------------------------------- //
//////////////////////////////////////////////////////////////////////
function updateCost() {
  const total = [...dayLists.querySelectorAll(".spot-card")].reduce(
    (sum, li) => sum + Number(li.dataset.ticket),
    0
  );
  costNowEl.textContent = total.toString();
  costBar.max = budgetPlay;
  costBar.value = total;
  costNowEl.classList.toggle("over", total > budgetPlay);
}
updateCost();
