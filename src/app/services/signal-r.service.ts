
import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";  // or from "@microsoft/signalr" if you are using a new library
import { Notificador } from '../interface/notificacao.model';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public data: Notificador[];
  public list: Notificador[];
  public broadcastedData: Notificador[];
  public valuePadrao = 1;

  private hubConnection: signalR.HubConnection
  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5000/Notificador')
      .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }
  public addTransferChartDataListener = () => {
    this.hubConnection.on('BroadcastMessage', (data) => {
      this.data = data;


      var listaGuardada = sessionStorage.getItem("mensagem");
      if (!listaGuardada) {
        sessionStorage.setItem("mensagem", JSON.stringify(this.data));
      }
      else {
        this.list = JSON.parse(listaGuardada);
        // this.list.push(JSON.stringify(this.data));
        sessionStorage.setItem("mensagem", JSON.stringify(this.list));

      }


      var value = sessionStorage.getItem("qtyMensagem");
      if (!value) {
        sessionStorage.setItem("qtyMensagem", this.valuePadrao.toString());
      }
      else {
        var numeroGuardado = sessionStorage.getItem("qtyMensagem");
        var soma = parseInt(numeroGuardado) + this.valuePadrao;
        sessionStorage.setItem("qtyMensagem", soma.toString());
      }
      console.log(data);
    });
  }
}
