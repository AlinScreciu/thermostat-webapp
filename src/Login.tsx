import { User } from 'firebase/auth'
import React, { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { useForm, SubmitHandler } from 'react-hook-form'
import { signInWithGoogle } from './service/firebase'
import SelectTemp from './SelectTemp'
import Header from './Header'
type FormValues = {
  email: string
  password: string
}

export default function App() {
  const { handleSubmit } = useForm<FormValues>()
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data)
  }
  const [user, setUser] = useState<User | null>(null)

  if (user == null) {
    return (
      <div className="flex w-screen h-screen bg-slate-900 flex-col items-center">
        <Header />
        <span className="text-white font-bold text-2xl mt-16">
          Login with google
        </span>
        <form onSubmit={handleSubmit(onSubmit)}>
          <button
            className="bg-indigo-800 text-slate-300 rounded-full p-3 s ease-in-out duration-300 hover:scale-150 mt-10 "
            onClick={() => {
              signInWithGoogle().then((loggedUser: User | null) => {
                setUser(loggedUser)
              })
            }}
          >
            <FcGoogle size={'60'} />
          </button>
        </form>
      </div>
    )
  }
  return (
    <div>
      <SelectTemp user={user} />
    </div>
  )
}
