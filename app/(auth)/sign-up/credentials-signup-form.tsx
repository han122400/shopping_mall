'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signUpWithCredentials } from '@/lib/actions/user.actions'
import { signUpDefaultValues } from '@/lib/constants'

export default function CredentialsSignUpForm() {
  const [data, action] = useActionState(signUpWithCredentials, {
    message: '',
    success: false,
  })

  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const SignUpButton = () => {
    const { pending } = useFormStatus()
    return (
      <Button disabled={pending} className="w-full" variant="default">
        {pending ? 'Submitting...' : 'Create account'}
      </Button>
    )
  }

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Your name"
            required
            type="text"
            defaultValue={signUpDefaultValues.name}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="m@example.com"
            required
            type="email"
            defaultValue={signUpDefaultValues.email}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            required
            type="password"
            minLength={6}
            defaultValue={signUpDefaultValues.password}
          />
        </div>
        <div>
          <SignUpButton />
        </div>

        {data?.message && (
          <div
            className={`text-center ${
              data.success ? 'text-green-600' : 'text-destructive'
            }`}
          >
            {data.message}
          </div>
        )}

        <div className="text-sm text-center text-muted-foreground">
          이미 계정이 있으신가요?{' '}
          <Link
            target="_self"
            className="link"
            href={`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          >
            Sign In
          </Link>
        </div>
      </div>
    </form>
  )
}
