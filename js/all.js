//queryselector
const buttonType = document.querySelector(".buttonType");
const buttonSelect = document.querySelectorAll(".buttonType>button");
const search = document.querySelector(".search");
const showResult = document.querySelector(".show-result");
const textCrop = document.querySelector(".textCrop");
const select = document.querySelector(".sort-select");
const showList = document.querySelector(".showList");
const sortAdvanced = document.querySelector(".market");
const Up = document.querySelectorAll(".fa-caret-up");
const Down = document.querySelectorAll(".fa-caret-down");
//前置作業
let data = [];
axios
  .get("https://hexschool.github.io/js-filter-data/data.json")
  .then(function (response) {
    data = response.data;
    getData(); //等資料確實取得再分類
    showList.innerHTML = `<tr><td colspan="7" class="text-center p-3">
    請輸入並搜尋想比價的作物名稱^＿^  </td></tr>`;
  });
//資料分類
let info = [];
function getData() {
  for (let i = 0; i < 3; i++) info[i] = [];
  data.forEach(function (value) {
    switch (value["種類代碼"]) {
      case "N04":
        info[0].push(value);
        break;
      case "N05":
        info[1].push(value);
        break;
      case "N06":
        info[2].push(value);
        break;
    }
  });
}
//種類選擇
let cropType = 0; //按鈕計數器初始化
buttonType.addEventListener("click", function (e) {
  if (e.target.type !== "button") return; //排除按鈕以外區域
  let num = e.target.dataset.type;
  if (num == cropType) return; //若與原來選取一樣則跳出
  //更新按鈕
  buttonSelect[cropType].classList.toggle("active"); //原先選取的按鈕取消
  buttonSelect[num].classList.toggle("active"); //新的按鈕
  cropType = num; //將按鈕計數器更新
});
//排序篩選
let sequence = 0; //排序篩選計數器
let advanceNum = 0; //進階功能計數器
select.addEventListener("change", function (e) {
  let selectNum = parseInt(e.target.value, 10);
  advanceNum = selectNum;
  switch (selectNum) {
    case 0:
      sequence = 0;
      break;
    case 1:
      sequence = "上價";
      break;
    case 2:
      sequence = "中價";
      break;
    case 3:
      sequence = "下價";
      break;
    case 4:
      sequence = "平均價";
      break;
    case 5:
      sequence = "交易量";
      break;
  }
  if (infoSort.length != 0) {
    showData();
    sortUpDown();
  }
});
//搜尋按鈕
let cropName = "";
search.addEventListener("click", function (e) {
  if (textCrop.value == "") return; //若搜尋內容為空白則跳出
  cropName = textCrop.value;
  textCrop.value = "";
  showResult.innerHTML = `查看「${cropName}」的比價結果`;
  searchData();
  showData();
  sortUpDown();
});
//查詢資料
function searchData() {
  infoSort.splice(0, infoSort.length); //先清空資料
  info[cropType].forEach(function (value) {
    if (value["作物名稱"].includes(cropName)) infoSort.push(value);
  });
}
//顯示
function showData() {
  showList.innerHTML = `<tr><td colspan="7" class="text-center p-3">
    資料載入中．．．  </td></tr>`;
  let show = sortData();
  if (infoSort.length == 0) {
    showList.innerHTML = `<tr><td colspan="7" class="text-center p-3">
  查詢不到當日的交易資訊QQ  </td></tr>`;
  } else showList.innerHTML = show;
}
//整理資料
let infoSort = [];
function sortData() {
  let str = "";
  if (sequence != 0) bubbleSort(infoSort, sequence);
  infoSort.forEach(function (item) {
    str += `<tr><td>${item["作物名稱"]}</td><td>${item["市場名稱"]}</td><td>${item["上價"]}</td><td>${item["中價"]}
    </td><td>${item["下價"]}</td><td>${item["平均價"]}</td><td>${item["交易量"]}</td></tr>`;
  });
  return str;
}
//泡沫排序
function bubbleSort(arr, par) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j][par] > arr[j + 1][par]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}
//進階功能
sortAdvanced.addEventListener("click", function (e) {
  let str = "";
  if (infoSort.length == 0) return;
  let Num = parseInt(e.target.dataset.change, 10);
  if (Num == advanceNum) {
    infoSort.reverse();
    infoSort.forEach(function (item) {
      str += `<tr><td>${item["作物名稱"]}</td><td>${item["市場名稱"]}</td><td>${item["上價"]}</td><td>${item["中價"]}
      </td><td>${item["下價"]}</td><td>${item["平均價"]}</td><td>${item["交易量"]}</td></tr>`;
    });
    showList.innerHTML = str;
  }
});
//進階功能之切換顯示
let sortNum = 0; //進階功能函式計數器
function sortUpDown() {
  for (let i = 0; i < 5; i++) {
    Up[i].classList.remove("sort-active");
    Down[i].classList.remove("sort-active");
  }
  //if (sortNum == advanceNum) return;
  Up[advanceNum - 1].classList.toggle("sort-active");
  Down[advanceNum - 1].classList.toggle("sort-active");
  sortNum = advanceNum; //記錄上次
}
