const $siteList = $(".siteList");
const x = localStorage.getItem("x");
const xObject = JSON.parse(x); //JSON.parse() 把字符串转化为对象
const hashMap = xObject || [
  { logo: "A", url: "https://www.acfun.cn" },
  { logo: "B", url: "https://www.bilibili.com" },
];

//使网址显示为 xxx.com 的形式
const simplifyUrl = (url) => {
  return url
    .replace("https://", "")
    .replace("http://", "")
    .replace("www.", "")
    .replace(/\/.*/, ""); //删除 / 开头的内容
};

const render = () => {
  $siteList.find($("li").not(".lastLi")).remove();

  hashMap.forEach((node, index) => {
    const $li = $(`<li>
      <div class="site">
          <div class="logo">${node.logo}</div>
          <div class="link">${simplifyUrl(node.url)}</div>
          <div class="close">
            <svg class="icon">
              <use xlink:href="#icon-close"></use>
            </svg>
          </div>
      </div>
    </li>`).insertBefore($(".lastLi"));

    $li.on("click", () => {
      window.open(node.url);
    });
    $li.on("click", ".close", (e) => {
      e.stopPropagation(); //阻止冒泡
      hashMap.splice(index, 1);
      render();
    });
  });
};

render(); //调用render(),先渲染

$(".addButton").on("click", () => {
  let url = window.prompt("请问要输入什么网址");
  if (url.indexOf("http") !== 0) {
    url = "https://" + url;
  }
  console.log(url);
  hashMap.push({
    logo: simplifyUrl(url)[0],
    logoType: "text",
    url: url,
  });

  //使用 render()，重新渲染 hashMap
  render();
});

//页面被关闭前触发;
window.onbeforeunload = () => {
  const string = JSON.stringify(hashMap); //localStorage 只能存储字符串，不能存储对象
  //JSON.stringify() 把对象转化为字符串
  localStorage.setItem("x", string);
};

$(document).on("keypress", (e) => {
  const { key } = e; //const key = e.key 的简写
  for (let i = 0; i < hashMap.length; i++) {
    if (hashMap[i].logo.toLowerCase() === key) {
      window.open(hashMap[i].url);
    }
  }
});
