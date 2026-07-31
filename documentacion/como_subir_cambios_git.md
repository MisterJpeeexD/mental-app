# Guía: Cómo Subir Cambios a GitHub (Control de Versiones Git)

Esta guía práctica detalla el procedimiento estándar que debe seguir el equipo de desarrollo de **AbrazaMente** para guardar sus cambios locales, sincronizar el repositorio y subir el código o la documentación a GitHub de manera segura.

---

## 🛠️ Procedimiento Paso a Paso en Git

Sigue este flujo secuencial en la terminal de tu sistema para realizar commits y subir tus desarrollos:

### Paso 1: Revisar el Estado del Repositorio
Antes de guardar tus modificaciones, verifica qué archivos han sido editados o agregados:
```bash
git status
```
*Esto mostrará los archivos modificados bajo el directorio `documentacion/` o `src/`.*

### Paso 2: Crear o Cambiar a tu Rama de Funcionalidad
Recuerda que todas las implementaciones deben realizarse en ramas independientes (ej: `feature/community-module` para desarrollo, o una rama técnica):
* **Crear una nueva rama**:
  ```bash
  git checkout -b feature/mi-nueva-funcionalidad
  ```
* **Cambiar a una rama existente**:
  ```bash
  git checkout feature/routes-protected
  ```

### Paso 3: Añadir tus Archivos al Área de Preparación (Stage)
Añade únicamente los archivos que deseas incluir en tu entrega:
* **Añadir toda la carpeta de documentación**:
  ```bash
  git add documentacion/
  ```
* **Añadir un archivo específico**:
  ```bash
  git add documentacion/como_subir_cambios_git.md
  ```

### Paso 4: Confirmar los Cambios (Commit)
Realiza la confirmación de tus cambios escribiendo un mensaje claro y descriptivo siguiendo las pautas semánticas:
```bash
git commit -m "docs: agregar guía paso a paso para subir cambios a GitHub"
```

### Paso 5: Sincronizar con la Rama Principal (Main)
Para evitar conflictos de fusión (*merge conflicts*) en GitHub, descarga las últimas actualizaciones realizadas por otros colaboradores y reajusta tu historial local:
```bash
git checkout main
git pull origin main
git checkout <tu-nombre-de-rama>
git rebase main
```

### Paso 6: Subir la Rama al Repositorio Remoto (Push)
Sube tu rama de funcionalidad a GitHub:
```bash
git push origin <tu-nombre-de-rama>
```
*Si es la primera vez que subes esa rama, Git te pedirá ejecutar:*
```bash
git push --set-upstream origin <tu-nombre-de-rama>
```

### Paso 7: Crear el Pull Request (PR)
1. Entra a tu repositorio en GitHub: [MisterJpeeexD/mental-app](https://github.com/MisterJpeeexD/mental-app).
2. Verás un cartel amarillo sugiriendo crear un Pull Request para tu rama recientemente subida.
3. Haz clic en **Compare & pull request**.
4. Completa la descripción detallando qué issue soluciona (ej: `Closes #33`) y solicita la revisión de tu equipo.
