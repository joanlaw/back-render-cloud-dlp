import app from './app.js'
import { connectToDB } from './utils/mongoose.js'

async function main() {
  await connectToDB()
  app.listen(process.env.PORT || 4000)
  console.log('Funcionando en ', 4000)
}

main()