export class Cpf {
  private value: string

  constructor(value: string) {
    if (!this.validate(value)) {
      throw new Error('Invalid cpf')
    }
    this.value = value
  }

  private calculateDigit(cpf: string, factor: number) {
    let total = 0
    for (const digit of cpf) {
      if (factor > 1) total += +digit * factor--
    }
    const rest = total % 11
    return rest < 2 ? 0 : 11 - rest
  }
  private isInvalidLength(cpf: string) {
    return cpf.length !== 11
  }
  private allDigitsEqual(cpf: string) {
    const [firstDigit] = cpf
    return [...cpf].every((digit) => digit === firstDigit)
  }
  private extractDigits(cpf: string) {
    return cpf.slice(9)
  }

  private validate(rawCpf?: string | null) {
    if (!rawCpf) return false
    const cleanCpf = rawCpf.replace(/\D/g, '')
    if (this.isInvalidLength(cleanCpf)) return false
    if (this.allDigitsEqual(cleanCpf)) return false
    const digit1 = this.calculateDigit(cleanCpf, 10)
    const digit2 = this.calculateDigit(cleanCpf, 11)
    const actualDigit = this.extractDigits(cleanCpf)
    const validateDigit = `${digit1}${digit2}`
    return actualDigit == validateDigit
  }

  getValue() {
    return this.value
  }
}
