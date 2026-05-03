import * as signalR from '@microsoft/signalr';
import { WebHostDomain } from '@/global/EnviromentDefine.ts';

class OrderSignalRService {
  private connection: signalR.HubConnection;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(WebHostDomain+"orderHub") // 後端映射的路徑
      .withAutomaticReconnect() // 自動重連
      .build();
  }

  async start() {
    try {
      await this.connection.start();
      console.log('SignalR Connected.');
    } catch (err) {
      console.error('SignalR Connection Error: ', err);
    }
  }

  // 監聽伺服器傳來的訊息
  onReceiveUpdate(callback: (orderId: string, status: string) => void) {
    this.connection.on('ReceiveStatusUpdate', callback);
  }
}

export const orderSignalR = new OrderSignalRService();