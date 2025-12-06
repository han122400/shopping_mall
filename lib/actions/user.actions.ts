'use server'

import { hashSync } from 'bcrypt-ts-edge'
import { eq } from 'drizzle-orm'
import { signIn, signOut } from '@/auth'
import db from '@/db/drizzle'
import { users } from '@/db/schema'
import { signInFormSchema, signUpFormSchema } from '../validator'
import { isRedirectError } from 'next/dist/client/components/redirect-error'

export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    })
    const callbackUrl =
      (formData.get('callbackUrl') as string | null) || undefined

    await signIn('credentials', {
      ...user,
      redirectTo: callbackUrl,
    })
    return { success: true, message: 'Sign in successfully' }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    return { success: false, message: 'Invalid email or password' }
  }
}

export async function signUpWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const payload = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    })

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, payload.email),
    })
    if (existingUser) {
      return { success: false, message: '이미 가입된 이메일입니다.' }
    }

    await db.insert(users).values({
      name: payload.name,
      email: payload.email,
      password: hashSync(payload.password, 10),
    })

    const callbackUrl =
      (formData.get('callbackUrl') as string | null) || undefined

    await signIn('credentials', {
      email: payload.email,
      password: payload.password,
      redirectTo: callbackUrl,
    })

    return { success: true, message: '회원가입이 완료되었습니다.' }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    return { success: false, message: '회원가입 중 오류가 발생했습니다.' }
  }
}

export const SignOut = async () => {
  await signOut()
}
