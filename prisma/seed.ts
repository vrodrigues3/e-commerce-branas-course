import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.product.create({
    data: {
      description: 'A',
      price: 100
    }
  })

  await prisma.product.create({
    data: {
      description: 'B',
      price: 200
    }
  })

  await prisma.product.create({
    data: {
      description: 'C',
      price: 200
    }
  })

  await prisma.coupon.create({
    data: {
      code: 'VALE20',
      percentage: 20
    }
  })
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
