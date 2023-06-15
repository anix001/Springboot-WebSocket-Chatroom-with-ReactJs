import { TextInput } from "@mantine/core"

interface loginProps{
    handleInputValue: (event: any) => void
    registerUser: (event: any) => void    
}

const LoginPage = ({handleInputValue, registerUser}:loginProps) => {
  return (
    <form style={{ height:'90vh'}} 
    className="bg-slate-100 login-layout flex justify-center flex-col items-center rounded-3xl" onSubmit={registerUser}>
      <h2 className="text-center text-5xl py-md underline">Login to ChatRoom 🖥️</h2>
      <TextInput name="username" placeholder="Enter your Name" size="lg" onChange={handleInputValue} className="my-sm" style={{width:'60%', fontWeight:'400'}} required/>
    </form>
  )
}

export default LoginPage
