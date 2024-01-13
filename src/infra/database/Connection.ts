import { Prisma, PrismaClient } from '@prisma/client'
import { DefaultArgs } from '@prisma/client/runtime/library'

export interface Connection {
  query(): PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
  close(): Promise<void>
}
