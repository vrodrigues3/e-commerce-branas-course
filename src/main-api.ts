import express from 'express'
import { Checkout } from './application/Checkout'
import { ProductDataDatabase } from './infra/data/ProductDataDatabase'
import { CouponDataDatabase } from './infra/data/CouponDataDatabase'
import { OrderDataDatabase } from './infra/data/OrderDataDatabase'
import { PrismaConnection } from './infra/database/PrismaConnection'
import { ExpressHttpServer } from './infra/http/ExpressHttpServer'
import { RestController } from './infra/controller/RestController'

const connection = new PrismaConnection()
const httpServer = new ExpressHttpServer()
const productData = new ProductDataDatabase(connection)
const couponData = new CouponDataDatabase(connection)
const orderData = new OrderDataDatabase(connection)
const checkout = new Checkout(productData, couponData, orderData)
new RestController(httpServer, checkout)

httpServer.listen(3000)
