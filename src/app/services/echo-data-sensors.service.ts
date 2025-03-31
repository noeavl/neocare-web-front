import { Injectable } from '@angular/core'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

@Injectable({
  providedIn: 'root',
})
export class EchoService {
  private echo: Echo<'pusher'>

  constructor() {
    (window as any).Pusher = Pusher
  
    this.echo = new Echo<'pusher'>({
      broadcaster: 'pusher',
      key: '6943e97f10680d2f0922',
      cluster: 'us2',
      forceTLS: true,
      client: new Pusher('6943e97f10680d2f0922', {
        cluster: 'us2',
        forceTLS: true,
      }),
    })
  }

  listen(channel: string, event: string, callback: (data: any) => void) {
    console.log(channel, event)
    this.echo.channel(channel).listen(event, callback)
  }

  leave(channel: string) {
    this.echo.leave(channel)
  }
}