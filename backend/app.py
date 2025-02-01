# -----------------------------------------------------------------------------
# Autor: Santiago Bobadilla Suarez
# -----------------------------------------------------------------------------

# -----------------------------------------------------------------------------
# Bibliotecas
# -----------------------------------------------------------------------------

# Flask: Framework web para Python
# - Flask: Clase principal para crear la aplicación web
# - request: Maneja las solicitudes HTTP entrantes
# - jsonify: Convierte datos Python a formato JSON
# - make_response: Crea respuestas HTTP personalizadas
from flask import Flask, request, jsonify, make_response

# SQLAlchemy: Sistema de mapeo objeto-relacional (ORM)
# - SQLAlchemy: Clase principal para interactuar con la base de datos
# - validates: Decorador para validación de campos en modelos
# - SQLAlchemyError: Manejo de excepciones de base de datos
# - ValidationError: Manejo de errores de validación de datos
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates
from sqlalchemy.exc import SQLAlchemyError
from marshmallow import ValidationError

# Werkzeug: Utilidades para seguridad
# - generate_password_hash: Genera hash seguro de contraseñas
# - check_password_hash: Verifica hash de contraseñas
from werkzeug.security import generate_password_hash, check_password_hash

# CORS: Manejo de recursos compartidos entre diferentes orígenes
# Permite peticiones desde dominios diferentes al del servidor
from flask_cors import CORS

# environ: Acceso a variables de entorno del sistema
# Usado para configuración segura de la aplicación
from os import environ

# datetime: Utilidades para manejo de fechas y tiempos
# - datetime: Clase principal para fechas y tiempos
# - timezone: Manejo de zonas horarias
# - timedelta: Cálculos con intervalos de tiempo
from datetime import datetime, timezone, timedelta

# JWT: Implementación de JSON Web Tokens
# - create_access_token: Crea tokens de acceso
# - jwt_required: Decorador para proteger rutas
# - JWTManager: Gestiona la configuración JWT
from flask_jwt_extended import create_access_token, jwt_required, JWTManager


# -----------------------------------------------------------------------------
# Configuración de la Aplicación
# -----------------------------------------------------------------------------

# Crear la instancia de la aplicación Flask
# Esta es la base de nuestra aplicación web
app = Flask(__name__)

# Configuración de CORS (Cross-Origin Resource Sharing)
# Permite peticiones desde el frontend especificado
# - origins: URLs permitidas para realizar peticiones
# - methods: Métodos HTTP permitidos
# - allow_headers: Cabeceras HTTP permitidas
# - supports_credentials: Permite envío de credenciales
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:3000",  # URL del frontend principal
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Accept"],
        "supports_credentials": True
    }
})

# Configuración de la Base de Datos
# - DATABASE_URL: Variable de entorno definida en el dockerfile
# - Establece la conexión con la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('DATABASE_URL')

# Inicialización de SQLAlchemy
# Crea una instancia de la base de datos vinculada a la aplicación
db = SQLAlchemy(app)

# Configuración de JWT (JSON Web Tokens)
# - JWT_SECRET_KEY: Clave secreta para firmar los tokens (debe ser segura en producción)
# - JWT_ACCESS_TOKEN_EXPIRES: Tiempo de expiración del token (1 hora)
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # TODO Cambiar por una clave segura en producción
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
jwt = JWTManager(app)

# ----------------------------------------------------------------------------------------- MODELS -----------------------------------------------------------------------------------------

# -------------------------------------------------------------------
# Modelo Usuario
# -------------------------------------------------------------------

class User(db.Model):
    """
    Modelo Usuario para representar usuarios en el sistema.
    
    Atributos:
        id (Integer): Identificador único autoincremental
        nombre_usuario (String): Nombre de usuario único, máximo 80 caracteres
        contrasenia (String): Contraseña hasheada, máximo 120 caracteres
        imagen_perfil (String): URL de la imagen de perfil, opcional
    """
    __tablename__ = 'usuario'

    # Identificador único del usuario
    id = db.Column(db.Integer, primary_key=True)
    
    # Nombre de usuario - debe ser único y no puede ser nulo
    nombre_usuario = db.Column(db.String(80), unique=True, nullable=False)
    
    # Contraseña hasheada - no puede ser nula
    contrasenia = db.Column(db.String(120), unique=False, nullable=False)
    
    # URL de la imagen de perfil - opcional
    imagen_perfil = db.Column(db.String(1000), unique=False, nullable=True)

    # Método para validar la contraseña
    def validate_password(self, password):
        """
        Valida que la contraseña cumpla con los requisitos mínimos
        Args:
            password (str): Contraseña a validar
        Raises:
            ValidationError: Si la contraseña tiene menos de 8 caracteres
        Returns:
            bool: True si la contraseña es válida
        """
        if len(password) < 8:
            raise ValidationError("La contraseña debe tener al menos 8 caracteres")
        return True

    # Método para establecer la contraseña
    def set_password(self, password):
        """
        Hashea y guarda la contraseña del usuario
        Args:
            password (str): Contraseña en texto plano
        """
        self.contrasenia = generate_password_hash(password)

    # Método para verificar la contraseña
    def check_password(self, password):
        """
        Verifica si la contraseña proporcionada coincide con la hasheada
        Args:
            password (str): Contraseña a verificar
        Returns:
            bool: True si la contraseña coincide, False en caso contrario
        """
        return check_password_hash(self.contrasenia, password)

    # Método para serializar el usuario a JSON
    def json(self):
        """
        Serializa los datos del usuario a formato JSON
        Returns:
            dict: Diccionario con los datos del usuario o mensaje de error
        """
        try:
            return {
                'id': self.id,
                'nombre_usuario': self.nombre_usuario,
                'imagen_perfil': self.imagen_perfil,
            }
        except Exception as e:
            return {
                'error': f'Error serializing user: {str(e)}'
            }


# -------------------------------------------------------------------
# Modelo Categoría
# -------------------------------------------------------------------

class Category(db.Model):
    """
    Modelo Categoría para representar las categorías de tareas en el sistema.
    
    Atributos:
        id (Integer): Identificador único autoincremental
        nombre (String): Nombre de la categoría, máximo 80 caracteres
        descripcion (String): Descripción de la categoría, máximo 250 caracteres
        user_id (Integer): ID del usuario propietario de la categoría
    """
    __tablename__ = 'categoria'

    # Identificador único de la categoría
    id = db.Column(db.Integer, primary_key=True)

    # Nombre de la categoría - no puede ser nulo
    nombre = db.Column(db.String(80), unique=False, nullable=False)

    # Descripción de la categoría - opcional
    descripcion = db.Column(db.String(250), unique=False, nullable=True)

    # ID del usuario propietario - clave foránea a la tabla usuario
    user_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)

    # Método para serializar la categoría a JSON
    def json(self):
        """
        Serializa los datos de la categoría a formato JSON
        Returns:
            dict: Diccionario con los datos de la categoría o mensaje de error
        """
        try:
            return {
                'id': self.id,
                'nombre': self.nombre,
                'descripcion': self.descripcion,
                'user_id': self.user_id
            }
        except Exception as e:
            return {
                'error': f'Error serializando categoría: {str(e)}'
            }
        
# -------------------------------------------------------------------
# Modelo Tarea
# -------------------------------------------------------------------

class Task(db.Model):
    """
    Modelo Tarea para representar las tareas en el sistema.
    
    Atributos:
        id (Integer): Identificador único autoincremental
        texto_tarea (String): Descripción de la tarea
        fecha_creacion (DateTime): Fecha de creación de la tarea
        fecha_tentativa_finalizacion (DateTime): Fecha estimada de finalización
        estado (String): Estado actual de la tarea
    """
    __tablename__ = 'tarea'

    # Identificador único de la tarea
    id = db.Column(db.Integer, primary_key=True)

    # Descripción de la tarea - no puede ser nula
    texto_tarea = db.Column(db.String(250), unique=False, nullable=False)

    # Fecha de creación - se establece automáticamente
    fecha_creacion = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    # Fecha tentativa de finalización - opcional
    fecha_tentativa_finalizacion = db.Column(db.DateTime, unique=False, nullable=False)

    # Estado de la tarea - no puede ser nulo
    estado = db.Column(db.String(20), nullable=False, default='pendiente')

    # Relaciones con otros modelos
    user_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categoria.id'), nullable=False)
    
    # Estados válidos para las tareas
    VALID_STATES = ['PENDIENTE', 'EN_PROGRESO', 'FINALIZADA']

    # Timestamps para auditoría
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    # Validación del estado de la tarea
    @validates('estado')
    def validate_estado(self, key, estado):
        """
        Valida que el estado de la tarea sea uno de los permitidos
        Args:
            key (str): Nombre del campo (estado)
            estado (str): Estado a validar
        Raises:
            ValidationError: Si el estado no es válido
        Returns:
            str: Estado validado
        """
        if estado not in self.VALID_STATES:
            raise ValidationError(f"Estado debe ser uno de: {', '.join(self.VALID_STATES)}")
        return estado
    
    # Validación de la fecha tentativa de finalización
    @validates('fecha_tentativa_finalizacion')
    def validate_fecha_tentativa_finalizacion(self, key, date):
        """
        Valida y convierte la fecha tentativa de finalización
        Args:
            key (str): Nombre del campo
            date (str|datetime): Fecha a validar
        Returns:
            datetime: Fecha en UTC
        Raises:
            ValidationError: Si el formato de fecha es inválido
        """
        if isinstance(date, str):
            try:
                naive_date = datetime.strptime(date, '%Y-%m-%d')
                date = naive_date.replace(tzinfo=timezone.utc)
            except ValueError:
                raise ValidationError("Invalid date format. Use YYYY-MM-DD")
        elif isinstance(date, datetime) and date.tzinfo is None:
            date = date.replace(tzinfo=timezone.utc)
        
        # Get current time in UTC
        now = datetime.now(timezone.utc)

        # Compare timezone-aware datetimes
        if date < now:
            raise ValidationError("Expected completion date cannot be in the past")

        return date

    # Método para serializar la tarea a JSON
    def json(self):
        """
        Serializa los datos de la tarea a formato JSON
        Returns:
            dict: Diccionario con los datos de la tarea o mensaje de error
        """
        try:
            return {
                'id': self.id,
                'texto_tarea': self.texto_tarea,
                'fecha_creacion': self.fecha_creacion.strftime('%Y-%m-%d') if self.fecha_creacion else None,
                'fecha_tentativa_finalizacion': self.fecha_tentativa_finalizacion.strftime('%Y-%m-%d') if self.fecha_tentativa_finalizacion else None,
                'estado': self.estado,
                'user_id': self.user_id,
                'category_id': self.category_id,
                'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M:%S')
            }
        except Exception as e:
            return {
                'error': f'Error serializando tarea: {str(e)}'
            }

# -------------------------------------------------------------------
# Crear las tablas.
# -------------------------------------------------------------------
# Crea todas las tablas definidas en los modelos si no existen
# Debe ejecutarse después de definir todos los modelos
db.create_all()

# ----------------------------------------------------------------------------------------- ROUTES/CRUD -----------------------------------------------------------------------------------------

# -------------------------------------------------------------------
# Server Test
# -------------------------------------------------------------------

# Create a test route
@app.route('/test', methods=['GET'])
def test():
  return jsonify({'message': 'The server is running 🥳.'})

# ----------------------------------------------------------------------------------------- 
# ROUTES/CRUD 
# -----------------------------------------------------------------------------------------
# Definición de rutas para operaciones CRUD (Create, Read, Update, Delete)
# Cada ruta maneja una operación específica sobre los modelos definidos
# Las rutas están protegidas por autenticación JWT donde sea necesario
# -----------------------------------------------------------------------------------------

# -------------------------------------------------------------------
# CRUD DE USUARIOS
# -------------------------------------------------------------------
# Implementación de operaciones CRUD (Create, Read, Update, Delete)
# para el manejo de usuarios en el sistema.

# Crear nuevo usuario
# Ruta: POST /usuarios
# Crea un nuevo usuario en el sistema
# Params (JSON):
#   - nombre_usuario: string (requerido)
#   - contrasenia: string (requerido)
#   - imagen_perfil: string (opcional)
# Returns:
#   - 201: Usuario creado exitosamente
#   - 400: Error de validación o BD
@app.route('/usuarios', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        new_user = User(nombre_usuario=data['nombre_usuario'])
        new_user.validate_password(data['contrasenia'])
        new_user.set_password(data['contrasenia'])
        if data.get('imagen_perfil'):
            new_user.imagen_perfil = data['imagen_perfil']
        db.session.add(new_user)
        db.session.commit()
        return new_user.json(), 201
    except ValidationError as e:
        return jsonify({"errors": e.messages}), 400
    except SQLAlchemyError as e:
        db.session.rollback()
        return {"error": str(e)}, 400
    
# Iniciar sesión
# Ruta: POST /usuarios/login
# Autentica un usuario y genera token JWT
# Params (JSON):
#   - nombre_usuario: string (requerido)
#   - contrasenia: string (requerido)
# Returns:
#   - 200: Login exitoso, devuelve token y datos usuario
#   - 401: Credenciales inválidas
#   - 400: Error de BD
@app.route('/usuarios/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        user = User.query.filter_by(nombre_usuario=data['nombre_usuario']).first()
        if user and user.check_password(data['contrasenia']):
            # Create access token
            access_token = create_access_token(identity=user.id)

            return {
                'token': access_token,
                'user': user.json()
            }, 200
        return {"error": "Invalid username or password"}, 401
    except SQLAlchemyError as e:
        return {"error": str(e)}, 400

# Cerrar sesión
# Ruta: POST /usuarios/logout
# Cierra la sesión del usuario actual
# Requiere: Token JWT válido
# Returns:
#   - 200: Logout exitoso
@app.route('/usuarios/logout', methods=['POST'])
@jwt_required()
def logout():
    return {"message": "Logout successful"}, 200

# Obtener todos los usuarios
# Ruta: GET /usuarios
# Lista todos los usuarios registrados
# Returns:
#   - 200: Lista de usuarios en formato JSON
@app.route('/usuarios', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.json() for user in users]), 200

# Obtener usuario por ID
# Ruta: GET /usuarios/<id>
# Obtiene los datos de un usuario específico
# Params:
#   - id: int (en URL)
# Returns:
#   - 200: Datos del usuario
#   - 404: Usuario no encontrado
@app.route('/usuarios/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.get(id)
    if user:
        return user.json(), 200
    return {"error": "User not found"}, 404

# Actualizar usuario
# Ruta: PUT /usuarios/<id>
# Actualiza los datos de un usuario existente
# Requiere: Token JWT válido
# Params:
#   - id: int (en URL)
#   - nombre_usuario: string (opcional)
#   - contrasenia: string (opcional)
# Returns:
#   - 200: Usuario actualizado
#   - 404: Usuario no encontrado
#   - 400: Error de validación o BD
@app.route('/usuarios/<int:id>', methods=['PUT'])
@jwt_required()
def update_user(id):
    try:
        data = request.get_json()
        user = User.query.get(id)
        user.validate_password(data['contrasenia'])
        if user:
            user.nombre_usuario = data.get('nombre_usuario', user.nombre_usuario)
            user.set_password(data.get('contrasenia', user.contrasenia))
            db.session.commit()
            return user.json(), 200
        return {"error": "User not found"}, 404
    except ValidationError as e:
        return jsonify({"errors": e.messages}), 400
    except SQLAlchemyError as e:
        db.session.rollback()
        return {"error": str(e)},

# Eliminar usuario
# Ruta: DELETE /usuarios/<id>
# Elimina un usuario del sistema
# Requiere: Token JWT válido
# Params:
#   - id: int (en URL)
# Returns:
#   - 200: Usuario eliminado
#   - 404: Usuario no encontrado
@app.route('/usuarios/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_user(id):
    user = User.query.get(id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return user.json(), 200
    return {"error": "User not found"}, 404

# -------------------------------------------------------------------
# CRUD DE CATEGORÍAS
# -------------------------------------------------------------------
# Implementación de operaciones CRUD (Create, Read, Update, Delete)
# para el manejo de categorías en el sistema.

# Crear nueva categoría
# Ruta: POST /categorias
# Crea una nueva categoría en el sistema
# Requiere: Token JWT válido
# Params (JSON):
#   - nombre: string (requerido)
#   - user_id: int (requerido)
#   - descripcion: string (opcional)
# Returns:
#   - 201: Categoría creada exitosamente
#   - 400: Error de validación o BD
#   - 404: Usuario no encontrado
@app.route('/categorias', methods=['POST'])
@jwt_required()
def create_category():
    try:
        data = request.get_json()

        user = User.query.get(data['user_id'])
        if not user:
            return {"error": f"User with id {data['user_id']} not found"}, 404

        # Create category with validated data
        new_category = Category(
            nombre=data['nombre'].strip(),
            user_id=data['user_id'],
            descripcion=data.get('descripcion', '').strip()
        )
        
        db.session.add(new_category)
        db.session.commit()
        return new_category.json(), 201
    except ValidationError as e:
        return jsonify({"errors": e.messages}), 400
    except SQLAlchemyError as e:
        db.session.rollback()
        return {"error": str(e)}, 400

# Obtener todas las categorías
# Ruta: GET /categorias
# Lista todas las categorías registradas
# Returns:
#   - 200: Lista de categorías en formato JSON
@app.route('/categorias', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([category.json() for category in categories]), 200

# Obtener categoría por ID
# Ruta: GET /categorias/<id>
# Obtiene los datos de una categoría específica
# Params:
#   - id: int (en URL)
# Returns:
#   - 200: Datos de la categoría
#   - 404: Categoría no encontrada
@app.route('/categorias/<int:id>', methods=['GET'])
def get_category(id):
    category = Category.query.get(id)
    if category:
        return category.json(), 200
    return {"error": "Category not found"}, 404

# Obtener categorías por ID de usuario
# Ruta: GET /usuario/<user_id>/categorias
# Lista todas las categorías de un usuario específico
# Requiere: Token JWT válido
# Params:
#   - user_id: int (en URL)
# Returns:
#   - 200: Lista de categorías del usuario
@app.route('/usuario/<int:user_id>/categorias', methods=['GET'])
@jwt_required()
def get_categories_by_user(user_id):
    categories = Category.query.filter_by(user_id=user_id).all()
    return jsonify([category.json() for category in categories]), 200

# Actualizar categoría
# Ruta: PUT /categorias/<id>
# Actualiza los datos de una categoría existente
# Requiere: Token JWT válido
# Params:
#   - id: int (en URL)
#   - nombre: string (opcional)
#   - descripcion: string (opcional)
# Returns:
#   - 200: Categoría actualizada
#   - 404: Categoría no encontrada
#   - 400: Error de validación o BD
@app.route('/categorias/<int:id>', methods=['PUT'])
@jwt_required()
def update_category(id):
    try:
        data = request.get_json()
        category = Category.query.get(id)
        if category:
            category.nombre = data.get('nombre', category.nombre)
            category.descripcion = data.get('descripcion', category.descripcion)
            db.session.commit()
            return category.json(), 200
        return {"error": "Category not found"}, 404
    except ValidationError as e:
        return jsonify({"errors": e.messages}), 400
    except SQLAlchemyError as e:
        db.session.rollback()
        return {"error": str(e)}, 400

# Eliminar categoría
# Ruta: DELETE /categorias/<id>
# Elimina una categoría del sistema
# Requiere: Token JWT válido
# Params:
#   - id: int (en URL)
# Returns:
#   - 200: Categoría eliminada
#   - 404: Categoría no encontrada
@app.route('/categorias/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_category(id):
    category = Category.query.get(id)
    if category:
        db.session.delete(category)
        db.session.commit()
        return category.json(), 200
    return {"error": "Category not found"}, 404

# -------------------------------------------------------------------
# CRUD DE TAREAS
# -------------------------------------------------------------------
# Implementación de operaciones CRUD (Create, Read, Update, Delete)
# para el manejo de tareas en el sistema.

# Crear nueva tarea
# Ruta: POST /tareas
# Crea una nueva tarea en el sistema
# Requiere: Token JWT válido
# Params (JSON):
#   - texto_tarea: string (requerido)
#   - fecha_tentativa_finalizacion: string (requerido, formato: YYYY-MM-DD)
#   - estado: string (requerido)
#   - user_id: int (requerido)
#   - category_id: int (requerido)
# Returns:
#   - 201: Tarea creada exitosamente
#   - 400: Error de validación o BD
#   - 404: Usuario o categoría no encontrada
@app.route('/tareas', methods=['POST'])
@jwt_required()
def create_task():
    try:
        data = request.get_json()

        user = User.query.get(data['user_id'])
        category = Category.query.get(data['category_id'])
        
        if not user:
            return {"error": f"User with id {data['user_id']} not found"}, 404
        if not category:
            return {"error": f"Category with id {data['category_id']} not found"}, 404

        new_task = Task(
            texto_tarea=data['texto_tarea'],
            fecha_tentativa_finalizacion=datetime.strptime(data['fecha_tentativa_finalizacion'], '%Y-%m-%d'),
            estado=data['estado'],
            user_id=data['user_id'],
            category_id=data['category_id']
        )

        db.session.add(new_task)
        db.session.commit()
        return new_task.json(), 201

    except ValidationError as e:
        return {"error": e.messages}, 400
    except SQLAlchemyError as e:
        db.session.rollback()
        return {"error": str(e)}, 400
    except ValueError as e:
        return {"error": "Invalid date format. Use YYYY-MM-DD"}, 400

# Obtener todas las tareas
# Ruta: GET /tareas
# Lista todas las tareas registradas
# Returns:
#   - 200: Lista de tareas en formato JSON
@app.route('/tareas', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([task.json() for task in tasks]), 200

# Obtener tareas por ID de usuario
# Ruta: GET /usuario/<user_id>/tareas
# Lista todas las tareas de un usuario específico
# Requiere: Token JWT válido
# Params:
#   - user_id: int (en URL)
# Returns:
#   - 200: Lista de tareas del usuario
@app.route('/usuario/<int:user_id>/tareas', methods=['GET'])
@jwt_required()
def get_tasks_by_user(user_id):
    tasks = Task.query.filter_by(user_id=user_id).all()
    return jsonify([task.json() for task in tasks]), 200

# Obtener tarea por ID
# Ruta: GET /tareas/<id>
# Obtiene los datos de una tarea específica
# Params:
#   - id: int (en URL)
# Returns:
#   - 200: Datos de la tarea
#   - 404: Tarea no encontrada
@app.route('/tareas/<int:id>', methods=['GET'])
def get_task(id):
    task = Task.query.get(id)
    if task:
        return task.json(), 200
    return {"error": "Task not found"}, 404

# Actualizar tarea
# Ruta: PUT /tareas/<id>
# Actualiza los datos de una tarea existente
# Requiere: Token JWT válido
# Params:
#   - id: int (en URL)
#   - texto_tarea: string (opcional)
#   - fecha_tentativa_finalizacion: string (opcional, formato: YYYY-MM-DD)
#   - estado: string (opcional)
#   - user_id: int (opcional)
#   - category_id: int (opcional)
# Returns:
#   - 200: Tarea actualizada
#   - 404: Tarea no encontrada
#   - 400: Error de validación o BD
@app.route('/tareas/<int:id>', methods=['PUT'])
@jwt_required()
def update_task(id):
    try:
        data = request.get_json()
        task = Task.query.get(id)
        if task:
            task.texto_tarea = data.get('texto_tarea', task.texto_tarea)
            task.fecha_tentativa_finalizacion = datetime.strptime(data.get('fecha_tentativa_finalizacion', task.fecha_tentativa_finalizacion), '%Y-%m-%d')
            task.estado = data.get('estado', task.estado)
            task.user_id = data.get('user_id', task.user_id)
            task.category_id = data.get('category_id', task.category_id)
            db.session.commit()
            return task.json(), 200
        return {"error": "Task not found"}, 404
    
    except ValidationError as e:
        return jsonify({"errors": e.messages}), 400
    except SQLAlchemyError as e:
        db.session.rollback()
        return {"error": str(e)}, 400
    except ValueError as e:
        return {"error": "Invalid date format. Use YYYY-MM-DD"}, 400
    
# Eliminar tarea
# Ruta: DELETE /tareas/<id>
# Elimina una tarea del sistema
# Requiere: Token JWT válido
# Params:
#   - id: int (en URL)
# Returns:
#   - 200: Tarea eliminada
#   - 404: Tarea no encontrada
@app.route('/tareas/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_task(id):
    task = Task.query.get(id)
    if task:
        db.session.delete(task)
        db.session.commit()
        return task.json(), 200
    return {"error": "Task not found"}, 404