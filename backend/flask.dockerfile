# Imagen base: Python 3.6 versión ligera basada en Debian Buster
# - python:3.6-slim-buster: Imagen oficial de Python optimizada para tamaño
FROM python:3.6-slim-buster

# Establece el directorio de trabajo en el contenedor
# - /app: Directorio donde se copiará y ejecutará la aplicación
WORKDIR /app

# Copia el archivo de dependencias
# - requirements.txt: Lista de paquetes Python necesarios
COPY requirements.txt ./

# Instala las dependencias del proyecto
# - pip install: Gestor de paquetes de Python
# - -r requirements.txt: Lee dependencias del archivo
RUN pip install -r requirements.txt

# Copia todo el código fuente al contenedor
# - COPY . .: Copia desde el directorio actual al directorio de trabajo
COPY . .

# Expone el puerto 4000 para acceder a la aplicación
# - 4000: Puerto donde escuchará el servidor Flask
EXPOSE 4000

# Comando para ejecutar la aplicación
# - flask run: Inicia el servidor de desarrollo Flask
# - --host=0.0.0.0: Permite conexiones desde cualquier IP
# - --port=4000: Puerto donde escuchará el servidor
CMD [ "flask", "run", "--host=0.0.0.0", "--port=4000"]