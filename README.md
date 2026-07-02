# Autogest-Pro
Proyecto academico, Programacion III.

## Estructura de ramas

Este repositorio organiza su trabajo en las siguientes ramas:

| Rama | Propósito |
|---|---|
| `main` | Rama principal / producción. Contiene el código estable y desplegable. |
| `Dev` | Rama de integración de desarrollo. Aquí se combinan las features antes de pasar a QA. |
| `QA` | Rama de pruebas / control de calidad. Se usa para validar cambios antes de llevarlos a `main`. |
| `frontend` | Rama de trabajo específica para el desarrollo del frontend. |
| `backend` | Rama de trabajo específica para el desarrollo del backend. |

### Flujo de trabajo sugerido

1. Desarrollar features en `frontend` o `backend` según corresponda.
2. Integrar los cambios en `Dev`.
3. Validar en `QA` antes de aprobar.
4. Fusionar a `main` una vez verificado y estable.
