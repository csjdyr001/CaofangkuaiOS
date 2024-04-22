class Log {
  static logs = [];
  
  static i(message){
    message = "[CaofangkuaiOS] " + message;
    console.log(message);
    this.logs.push({"type":"info","message":message});
  }

  static e(message){
    message = "[CaofangkuaiOS] " + message;
    console.log("%c" + message,"color:red");
    this.logs.push({"type":"error","message":message});
  }

  static clear(){
    console.clear();
    this.logs = [];
  }
  
  static getLogs(){
    return this.logs;
  }
}