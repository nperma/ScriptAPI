import {world,system}from"@minecraft/server";

export class CMD {
 
  constructor(){
    this.register = [];
    this.prefix = ["+",".","!","?"];
    world.beforeEvents.chatSend.subscribe(this.handler.bind(this))
    this.adminTag="admin";
  }
  
  static register({
    name,
    aliases=[],
    usage="No Usage",
    description="No Description",
    admin=false,
    group="GENERAL"
  }, callback){
    this.register.push({...arguments[0], callback});
  }
  
  static getCommand(name) {
    return this.register.find(({name,aliases}) => name===name||(aliases.length>0&&aliases.includes(name))) ?? null
  }
  
  static getCommands(){
    return this.register;
  }
  
  handler(ev) {
    const{sender:player,message}=ev;
    const testPrefix = this.prefix.find(k=> message.startsWith(k))
    if (testPrefix) {
      const args = message?.slice(testPrefix.length).trim().split(" ");
      const command = args.shift().toLowerCase();
      
      if (this.getCommand(command)) {
        ev.cancel=true;
        const isAdmin = player.hasTag(this.adminTag);
        if (this.getCommand(command).admin && !isAdmin) return player.sendMessage("§cyou dont have access to use this command!!")
        try {
        this.getCommand(command).callback({
          prefix: testPrefix,
          command,
          args,
          player,
          message,
          isAdmin
        })
        } catch(err) {
          console.warn(err.stack)
        }
      }
    }
  }
}