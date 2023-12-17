import { validate } from '../src/cpfValidator'

const validCpfs = ['529.982.247-25', '168.995.350-09']

test.each(validCpfs)('should test a valid cpf: %s', (cpf: string) => {
  const isValid = validate(cpf)
  expect(isValid).toBe(true)
})

const invalidCpfs = [
  '111.111.111-11',
  '222.222.222-22',
  '333.333.333-33',
  '444.444.444-44',
  '555.555.555-55',
  '666.666.666-66',
  '777.777.777-77',
  '888.888.888-88',
  '999.999.999-99',
  '529.982.247-30',
  '168.995.350-10'
]

test.each(invalidCpfs)('should test a invalid cpf: %s', (cpf: string) => {
  const isValid = validate(cpf)
  expect(isValid).toBe(false)
})

test('should test a null cpf', () => {
  const isValid = validate(null)
  expect(isValid).toBeFalsy()
})

test('should test an undefined cpf', () => {
  const isValid = validate(undefined)
  expect(isValid).toBeFalsy()
})

test('should test a cpf with length less than 11', () => {
  const isValid = validate('1234567890')
  expect(isValid).toBeFalsy()
})
