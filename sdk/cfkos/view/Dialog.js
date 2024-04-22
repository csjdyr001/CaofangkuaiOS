class Dialog {
  static snackbar(message){
    mdui.snackbar({
      message: message
    });
  }

static dialog(title,content,btn1="取消",btn2="确定",btn1callback,btn2callback){
  mdui.dialog({
  title: title,
  content: content,
  buttons: [
    {
      text: btn1,
      onClick: btn1callback
    },
    {
      text: btn2,
      onClick: btn2callback
    }
  ]
});
}

static alert(title,content,callback){
  mdui.alert(content, title, callback);
}

static winAlert(title,content){
const winAlert = document.createElement('div');
winAlert.id = 'winAlert';
winAlert.className = 'container';
winAlert.style.zIndex = '9999';
winAlert.innerHTML = `
	<header>
		<span class="text" id="alertTitle">${title}</span>
		<button class="btn close"></button>
	</header>
	<main>
		<form action="#">
			<div class="input_field" id="alertContent">${content}</div>
		</form>
	</main>
 `;
document.body.appendChild(winAlert);
// 关闭按钮的点击事件监听器
const closeBtn = document.querySelector('#winAlert .btn.close');
closeBtn.addEventListener('click', () => {
	document.body.removeChild(winAlert);
});
return winAlert;
}
}