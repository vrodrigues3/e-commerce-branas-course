import { checkout } from './application'

const input: any = {
  items: []
}

process.stdin.on('data', async (data) => {
  const command = data.toString().replace(/\n/g, '')
  if (command.startsWith('set-cpf')) {
    const params = command.replace('set-cpf ', '')
    input.cpf = params
  }

  if (command.startsWith('add-item')) {
    const params = command.replace('add-item ', '')
    const [idProduct, quantityStr] = params.split(' ')

    const id = parseInt(idProduct)
    const quantity = parseInt(quantityStr)

    input.items.push({ id, quantity })
  }

  if (command.startsWith('checkout')) {
    try {
      const output = await checkout(input)
      console.log(output)
    } catch (error: any) {
      console.log(error.message)
    }
  }
})
