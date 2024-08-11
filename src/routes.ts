type RoutePaths = string[]

interface Routes {
  AUTH: RoutePaths
  USER: RoutePaths
  ADMIN: RoutePaths
}

const routes: Routes = {
  AUTH: ['/auth/login', '/auth/register', '/auth/error'],
  USER: ['/privet'],
  ADMIN: ['/admin/*']
}

export { routes }
