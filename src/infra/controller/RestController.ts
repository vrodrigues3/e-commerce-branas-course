import { Checkout } from '../../application/Checkout'
import { HttpServer } from '../http/HttpServer'

export class RestController {
  constructor(
    readonly httpServer: HttpServer,
    checkout: Checkout
  ) {
    httpServer.on('post', '/checkout', async (params: any, body: any) => {
      const output = await checkout.execute(body)
      return output
    })
  }
}
