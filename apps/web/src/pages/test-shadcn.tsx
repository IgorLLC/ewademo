import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, User, Settings } from "lucide-react"

export default function TestShadcn() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Prueba de shadcn/ui
          </h1>
          <p className="text-muted-foreground">
            Verificando que todos los componentes funcionen correctamente
          </p>
        </div>

        {/* Botones */}
        <Card>
          <CardHeader>
            <CardTitle>Botones</CardTitle>
            <CardDescription>
              Diferentes variantes de botones de shadcn/ui
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button>Botón Default</Button>
              <Button variant="secondary">Botón Secondary</Button>
              <Button variant="outline">Botón Outline</Button>
              <Button variant="destructive">Botón Destructive</Button>
              <Button variant="ghost">Botón Ghost</Button>
              <Button variant="link">Botón Link</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button>
                <User className="mr-2 h-4 w-4" />
                Con Icono
              </Button>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Inputs */}
        <Card>
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
            <CardDescription>
              Campos de entrada con diferentes estilos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="tu@email.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Contraseña</label>
                <Input type="password" placeholder="••••••••" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Búsqueda</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-10" placeholder="Buscar..." />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Card 1</CardTitle>
              <CardDescription>
                Descripción de la primera tarjeta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Contenido de la primera tarjeta con información relevante.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card 2</CardTitle>
              <CardDescription>
                Descripción de la segunda tarjeta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Contenido de la segunda tarjeta con información relevante.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card 3</CardTitle>
              <CardDescription>
                Descripción de la tercera tarjeta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Contenido de la tercera tarjeta con información relevante.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Colores del tema */}
        <Card>
          <CardHeader>
            <CardTitle>Colores del Tema</CardTitle>
            <CardDescription>
              Variables CSS de shadcn/ui
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-12 bg-primary rounded-md"></div>
                <p className="text-xs text-center">Primary</p>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-secondary rounded-md"></div>
                <p className="text-xs text-center">Secondary</p>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-muted rounded-md"></div>
                <p className="text-xs text-center">Muted</p>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-accent rounded-md"></div>
                <p className="text-xs text-center">Accent</p>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-destructive rounded-md"></div>
                <p className="text-xs text-center">Destructive</p>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-card rounded-md border"></div>
                <p className="text-xs text-center">Card</p>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-popover rounded-md border"></div>
                <p className="text-xs text-center">Popover</p>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-background rounded-md border"></div>
                <p className="text-xs text-center">Background</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 