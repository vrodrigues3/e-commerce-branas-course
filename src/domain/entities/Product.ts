export class Product {
  constructor(
    readonly id: number,
    readonly description: string,
    readonly price: number,
    readonly width: number,
    readonly height: number,
    readonly length: number,
    readonly weight: number,
    readonly currency: string = 'BRL'
  ) {}
}
