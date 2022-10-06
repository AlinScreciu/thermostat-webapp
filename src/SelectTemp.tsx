import React, { useLayoutEffect, useState } from 'react'
import { User } from 'firebase/auth'
import { Control, SubmitHandler, useForm, useWatch } from 'react-hook-form'
import {
  getThermostatSettings,
  getUserTemp,
  ThermoSettings,
  updateTemp,
} from './service/firebase'
import Header from './Header'
interface SelectTempProps {
  user: User
}
type FormValues = {
  temperature: string
}
function IsolateReRender({ control }: { control: Control<FormValues> }) {
  const temp = useWatch({
    control,
    name: 'temperature',
    defaultValue: '20',
  })

  return (
    <div className="text-white text-2xl font-bold px-5">
      Selected: {temp}°<span className="italic">C</span>
    </div>
  )
}
export default function SelectTemp({ user }: SelectTempProps) {
  const { register, handleSubmit, control } = useForm<FormValues>()
  const [myTemp, setMyTemp] = useState<string>('')
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    updateTemp(parseFloat(data.temperature), user)
    setMyTemp(data.temperature)
  }

  const [thermosData, setThermosData] = useState<ThermoSettings | null>(null)
  useLayoutEffect(() => {
    getUserTemp(user.email).then((temp) => setMyTemp(temp))
    getThermostatSettings()
      .then((data) => {
        setThermosData(data)
      })
      .catch((err) => console.log(err))
  }, [])
  return (
    <div className="flex w-screen h-screen bg-slate-900 flex-col items-center ">
      <Header />
      <h2 className="text-white font-bold leading-8 text-xl">
        Welcome {user.displayName}
        <br /> Heat is now {thermosData?.cmd}
        <br /> Last temp measured {thermosData?.lastTemp}°
        <span className="italic">C</span>
        <br /> On {thermosData?.lastTime}
        <br /> in {thermosData?.location}
        <br /> My preferred temp: {myTemp}°<span className="italic">C</span>
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center mt-10">
          <IsolateReRender control={control} />
          <input
            className="accent-indigo-800 m-3 scale-150"
            type="range"
            max={26}
            min={15}
            step={0.5}
            defaultValue={myTemp}
            placeholder="temperature"
            {...register('temperature', { required: true, max: 26, min: 15 })}
          />
          <input
            className="bg-indigo-800 text-white text-2xl font-bold rounded-xl m-3 mt-8 p-2 w-fit ease-in-out duration-300 hover:scale-125"
            type="submit"
          />
        </div>
      </form>
    </div>
  )
}
