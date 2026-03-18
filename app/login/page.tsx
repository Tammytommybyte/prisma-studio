import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950 p-4">
      <Card className="w-full max-w-sm border-zinc-800 bg-zinc-900 text-zinc-100">
        <form action={login}>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl tracking-tight">Prisma Studio</CardTitle>
            <CardDescription className="text-zinc-400">
              Ingresa tus credenciales para acceder.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                className="border-zinc-800 bg-zinc-950 text-white placeholder:text-zinc-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="border-zinc-800 bg-zinc-950 text-white"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              Entrar
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
