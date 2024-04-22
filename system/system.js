var Applications = []
class CFKOSApplication {
    constructor(json) {
        this.json = json;
        this.appName = json.appName || "";
        this.packageName = json.packageName || "";
        this.mainActivity = json.mainActivity || "";
        this.iconViewFor = json.iconViewFor || "desktop";
        this.activities = json.activities.map(activityJson => new Activity(activityJson)) || [];
    }
    
    getAppName() {
        return this.appName;
    }
    
    getPackageName() {
        return this.packageName;
    }
    
    getMainActivity() {
        return this.mainActivity;
    }
    
    getIconViewFor() {
        return this.iconViewFor;
    }
    
    getActivities() {
        return this.activities;
    }
}

class Activity {
    constructor(json) {
        this.json = json;
        this.name = json.name || "";
        this.portraitLayout = json.portraitLayout || "";
        this.landscapeLayout = json.landscapeLayout || "";
        this.codes = json.codes || "";
    }
    
    getName() {
        return this.name;
    }
    
    getPortraitLayout() {
        return this.portraitLayout;
    }
  
  getLandscapeLayout() {
        return this.landscapeLayout;
    }
  
  getCodes(){
    return this.codes;
    }
}

async function installCPK(cpk){
    let res = await JSZip.loadAsync(cpk);
    let manifestJSON = await res.file("manifest.json").async("string");
    let app = new CFKOSApplication(JSON.parse(manifestJSON));
    Applications.push({"cpk":cpk,"CFKOSApplication":app});
    Log.i(`InstallCPK:${app.getPackageName()}`);
}

async function runApplication(packageName,activityName,animation=true){
try{
for (let i = 0; i < Applications.length; i++) {
    if (Applications[i].CFKOSApplication.getPackageName() == packageName) {
        let appActivities = Applications[i].CFKOSApplication.getActivities();
        for (let j = 0; j < appActivities.length; j++) {
          if(appActivities[j].getName() == activityName){
          if(animation == true){
            Animation.openNewActivity(document.getElementById("phone"))
          }
          let res = await JSZip.loadAsync(Applications[i].cpk);
          let appLayout = "";
          if(isPortraitScreen() == true){
          //浏览器竖屏
          if(appActivities[j].getPortraitLayout() == ""){
          Dialog.alert("提示","此应用不支持竖屏布局，将使用横屏布局");
          appLayout = await res.file(appActivities[j].getLandscapeLayout()).async("string");
          }else{
          appLayout = await res.file(appActivities[j].getPortraitLayout()).async("string");
          }
          }else{
          //浏览器横屏
          if(appActivities[j].getLandscapeLayout() == ""){
          Dialog.alert("提示","此应用不支持横屏布局，将使用竖屏布局");
          appLayout = await res.file(appActivities[j].getPortraitLayout()).async("string");
          }else{
          appLayout = await res.file(appActivities[j].getLandscapeLayout()).async("string");
          }
          }
          //document.getElementById("phone").innerHTML="";
          document.getElementById("phone").innerHTML=appLayout;
          for (let k = 0; k < appActivities[j].getCodes().length; k++) {
          let code = await res.file(appActivities[j].getCodes()[k]).async("string");
          eval(code);
          }
          Log.i(`RunApplication:${packageName}.${activityName}`);
          break;
          }
        }
        break;
    }
}
}catch(e){
Log.e(`${packageName}.${activityName} Error:${e}`)
Animation.closeNewActivity(document.getElementById("phone"))
}
}

async function initSystem(){
await installCPK(await (await fetch('./system/applications/system.cpk')).blob());
await installCPK(await (await fetch('./system/applications/launcher.cpk')).blob());
await installCPK(await (await fetch('./system/applications/WebGoose.cpk')).blob());
//await runApplication("cfkos.webgoose","main",false);
await runApplication("cfkos.system","systemLauncher",false);
}
function importJS(pm){
return new Promise((resolve,reject) => {
if(!document.getElementById(pm)){
let pLoad = document.createElement('script');
pLoad.setAttribute("id",pm);
pLoad.src = "./sdk/" + pm.replace(/\./g,"/") + ".js";
document.body.appendChild(pLoad);
pLoad.onload = function (){
resolve()
}
}
})
}

function isPortraitScreen(){//true为竖屏，false为横屏
let device = navigator.userAgent.toLowerCase();
if (/ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(device)) {
  //移动端
  let screenDirection = window.matchMedia("(orientation: portrait)");
  return screenDirection.matches
} else {
  //pc端直接返回false
  return false
}
}

function fullScreenDisplay(){
    /* 全屏操作的主要方法和属性
     * 不同浏览器需要添加不同的前缀
     * chrome:webkit   firefox:moz   ie:ms   opera:o
     * 1.requestFullScreen():开启全屏显示
     * 2.cancelFullScreen():退出全屏显示:在不同的浏览器下退出全屏只能使用document来实现
     * 3.fullScreenElement:是否是全屏状态，也只能使用document进行判断
     */
    // 判断是否全屏，全屏则退出，非全屏则全屏
    if(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement){
        if(document.cancelFullScreen){
            document.cancelFullScreen();
        }
        else if(document.webkitCancelFullScreen){
            document.webkitCancelFullScreen();
        }
        else if(document.mozCancelFullScreen){
            document.mozCancelFullScreen();
        }
        else if(document.msCancelFullScreen){
            document.msCancelFullScreen();
        }
    }else{
        document.querySelector('html').requestFullscreen()
        .then(() => {// 进入全屏成功
        })
        .catch(() => {// 进入全屏失败
          Log.e("Failed to enter the full screen")
        })
    }
}

class Animation{
  static openNewActivity(ele) {
            ele.classList.add('div2-opened');
        }

        static closeNewActivity(ele) {
            ele.classList.remove('div2-opened');
        }

        static openAnotherApp(old,ne) {
            old.classList.add('div1-closed');
            window.setTimeout(old.classList.add('div1-closed2'), 200);
            window.setTimeout(ne.classList.add('div3-opened'), 200);
        }

        static closeAnotherApp(old,online) {
            online.classList.remove('div3-opened');
            old.classList.remove('div1-closed2');
            window.setTimeout(old.classList.remove('div1-closed'), 200);
        }
}

function getAssetsFile(packageName,filename,type="string"){
return new Promise(async (resolve, reject) => {
for (let i = 0; i < Applications.length; i++) {
    if (Applications[i].CFKOSApplication.getPackageName() == packageName) {
          let res = await JSZip.loadAsync(Applications[i].cpk);
          let result = await res.file("assets/" + filename).async(type);
          resolve(result);
          break;
    }
  }
})
}

window.onload = async function (){
//导入包
await importJS("cfkos.view.Dialog")
await importJS("cfkos.util.Log")
/*
await importJS("cfkos.view.FloatingWindow")
new FloatingWindow(`<div style="background-color:#ff8800;width:60px;height:60px;">
<h6>悬浮窗测试</h6>
</div>`,true,true).show();//悬浮窗测试
*/
//清空控制台
Log.clear();
initSystem()
//全屏
fullScreenDisplay()
//Dialog.winAlert("测试",'<span class="i_details">测试</span>');
}