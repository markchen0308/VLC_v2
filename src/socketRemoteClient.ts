import * as Net from 'net';//import socket module
import * as fs from 'fs';
let configfilePath = './config.json';
export class SocketRemoteClient {

    socketRemoteClient: Net.Socket ;
    socket: Net.Socket = null;
    socketRemoteServerPort: number;
    socketRemoteServerIP: string;
    flagServerStatus: boolean = false;


    constructor() {
        //console.log("start socket client to wait remote socket server");

    }
    

    setClientSeverInfo(ip:string,port:number)
    {
        this.socketRemoteServerIP = ip;
        this.socketRemoteServerPort = port;
    }
    //-----------------------------------------------------------------------
    async startRemoteClient() {
       // await this.readConfigFile();//read config.json
        this.socketRemoteClient= null;
        this.configureClient();// connect to modbus server
    }

    //----------------------------------------------------------------------------------
    readConfigFile(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let configJsonFile = fs.readFileSync(configfilePath, 'utf8');//read config.json file
            let configJson = JSON.parse(configJsonFile);//parse coonfig.json file
            this.socketRemoteServerIP = configJson.socketRemoteServerIP;
            this.socketRemoteServerPort = configJson.socketRemoteServerPort;
            resolve(true);
        });
    }

    //-----------------------------------------------------------------------------------
    configureClient() // connect to remote server
    {      
        this.socketRemoteClient = Net.connect(this.socketRemoteServerPort, this.socketRemoteServerIP, () => {
            //console.log(`modbusClient connected to: ${this.socketRemoteClient.address} :  ${this.socketRemoteClient.localPort}`);
            console.log("remote server connected at ");

            this.flagServerStatus = true;
            this.sendMsg2Server("Hello,I'm VLC client\n")//sent cmd data to server
          
        });
        //this.socketRemoteClient.setEncoding('utf8');


        this.socketRemoteClient.on('end', () => {
            console.log('remote client disconnected');
            this.flagServerStatus = false;
        });

        // received server cmd data \
        this.socketRemoteClient.on('data', (data) => {
            //let temp: any = data;
            //let cmd: DTCMD.iCmd = JSON.parse(temp);
            //this.parseControlServerCmd(cmd);
            console.log('Get remote server data:'+data)
        });
        
    }

    //-----------------------------------------------------------------------------------
    isRemoteServerHolding():boolean
    {
        return this.flagServerStatus;
    }
    //-----------------------------------------------------------------------------------
    sendMsg2Server(msg:string)//sent cmd data to server
    {
        //console.log("sent msg")
        this.socketRemoteClient.write(msg);
    }

}
