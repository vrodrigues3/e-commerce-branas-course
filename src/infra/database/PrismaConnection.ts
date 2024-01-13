import { Prisma, PrismaClient } from '@prisma/client'
import { Connection } from './Connection'
import { DefaultArgs, Sql } from '@prisma/client/runtime/library'

export class PrismaConnection implements Connection {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>

  constructor() {
    this.prisma = new PrismaClient()
  }

  query(): PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs> {
    return this.prisma
  }

  close(): Promise<void> {
    return this.prisma.$disconnect()
  }
}
