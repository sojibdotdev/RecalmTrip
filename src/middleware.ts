import { auth } from './auth'
import { routes } from './routes'

export default auth(async (req) => {
  const { AUTH, ADMIN, USER } = routes

  if (req.nextUrl.pathname.startsWith('/api/auth')) {
    return
  } else if (ADMIN.some((route) => req.nextUrl.pathname.match(route))) {
    if (req.auth && req.auth.user.role === 'ADMIN') {
      return
    } else {
      let callbackUrl = req.nextUrl.pathname
      if (req.nextUrl.search) {
        callbackUrl += req.nextUrl.search
      }
      const encodedCallbackUrl = encodeURIComponent(callbackUrl)
      return Response.redirect(
        new URL(
          `/auth/login?admin=true&&callbackUrl=${encodedCallbackUrl}`,
          req.nextUrl
        )
      )
    }
  } else if (USER.some((route) => req.nextUrl.pathname.match(route))) {
    if (req.auth) {
      return
    } else {
      let callbackUrl = req.nextUrl.pathname
      if (req.nextUrl.search) {
        callbackUrl += req.nextUrl.search
      }
      const encodedCallbackUrl = encodeURIComponent(callbackUrl)
      return Response.redirect(
        new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, req.nextUrl)
      )
    }
  } else if (AUTH.some((route) => req.nextUrl.pathname.match(route))) {
    return
  } else {
    return
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)']
}
