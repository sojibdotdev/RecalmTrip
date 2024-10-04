import { RegisterSchema } from '@/schema'
import { z } from 'zod'

const inputFields: Array<{
  id: number
  name: keyof z.infer<typeof RegisterSchema>
  placeholder: string
  type: string
}> = [
  {
    id: 0,
    name: 'firstName',
    placeholder: 'First Name',
    type: 'text'
  },
  {
    id: 1,
    name: 'lastName',
    placeholder: 'Last Name',
    type: 'text'
  },
  {
    id: 2,
    name: 'email',
    placeholder: 'Email',
    type: 'text'
  },
  {
    id: 3,
    name: 'password',
    placeholder: 'Password',
    type: 'password'
  }
]
export { inputFields }
