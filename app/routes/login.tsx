import { Link, useNavigate, useNavigation } from 'react-router'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

export default function Login() {
  const navigate = useNavigate()
  const navigation = useNavigation()

  return (
    <div className={`
      mx-auto flex h-screen w-full max-w-72 flex-col items-center justify-center
    `}
    >
      <h1 className="text-xl font-bold">Welcome</h1>
      <div>Please login to continue</div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          navigate('/admin/ai-knowledge')
        }}
        className="mt-4 flex w-full max-w-72 flex-col gap-y-6"
      >
        <Input />
        <Input />
        <Button isLoading={navigation.state === 'submitting'}>
          Login
        </Button>
      </form>
      <Link
        className={`
          mt-8 text-sm
          hover:underline
        `}
        to="/"
      >
        Go Home.
      </Link>
    </div>
  )
}
