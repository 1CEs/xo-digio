import PlayfulButton from "@/components/playful-button"
import PlayfulInput from "@/components/playful-input"
import Image from "next/image"
import Logo from "@/public/logo.svg"

function SignUpPage() {
  return (
    <form 
      className="flex flex-col gap-4 items-center justify-center 
                rounded-xl border-b-primary border-r-primary w-1/6"
      >
      <Image src={Logo} alt="Logo" width={150} height={150} />
      <PlayfulInput placeholder="Username" />
      <PlayfulInput placeholder="Email" />
      <PlayfulInput placeholder="Password" type="password" />
      <PlayfulInput placeholder="Confirm Password" type="password" />
      <PlayfulButton size="md" variant="primary">
        SIGN UP
      </PlayfulButton>
    </form>
  )
}

export default SignUpPage