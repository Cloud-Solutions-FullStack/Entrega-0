# ----------------------------------
# Santiago Bobadilla Suarez
# ----------------------------------

# -------------------------------------------------------------------
# Libraries
# -------------------------------------------------------------------

# Flask: Web framework.
from flask import Flask, request, jsonify, make_response

# SQLAlchemy: ORM for databases.
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates
from sqlalchemy.exc import SQLAlchemyError
from marshmallow import ValidationError

# Werkzeug: Password hashing utilities.
from werkzeug.security import generate_password_hash, check_password_hash

# CORS: Cross-Origin Resource Sharing.
from flask_cors import CORS

# Environment variable: Access to environment variables.
from os import environ

# Datetime: Date and time utilities.
from datetime import datetime, timezone, timedelta

# JWT: JSON Web Tokens, for user authentication.
from flask_jwt_extended import create_access_token, jwt_required, JWTManager


# -------------------------------------------------------------------
# App Configuration
# -------------------------------------------------------------------

# Create the Flask app.
app = Flask(__name__)

# Enable CORS: Allow requests from the frontend.
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:5173",
            "http://localhost:4000"
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Accept"],
        "supports_credentials": True
    }
})

# Database configuration: Use the DATABASE_URL environment variable (dockerfile).
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('DATABASE_URL')

# SQLAlchemy configuration: Track modifications to the database.
db = SQLAlchemy(app)

# Add JWT configuration to your Flask app
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this to a secure secret key
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
jwt = JWTManager(app)

# ----------------------------------------------------------------------------------------- MODELS -----------------------------------------------------------------------------------------

# -------------------------------------------------------------------
# User Model
# -------------------------------------------------------------------

class User(db.Model):
    """
    User Model for representing users in the system.
    Attributes:
        id: Unique identifier
        nombre_usuario: Username
        contrasenia: Hashed password
        imagen_perfil: Profile image URL
    """
    __tablename__ = 'usuario'

    id = db.Column(db.Integer, primary_key=True)
    nombre_usuario = db.Column(db.String(80), unique=True, nullable=False)
    contrasenia = db.Column(db.String(120), unique=False, nullable=False)
    imagen_perfil = db.Column(db.String(1000), unique=False, nullable=True)
  
    def validate_password(self, password):
        if len(password) < 8:
            raise ValidationError("La contraseña debe tener al menos 8 caracteres")
        return True

    def set_password(self, password):
        self.contrasenia = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.contrasenia, password)

    def json(self):
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
# Category Model
# -------------------------------------------------------------------

class Category(db.Model):
  """
    Category Model for representing task categories in the system.
    Attributes:
        id: Unique identifier
        nombre: Category name
        descripcion: Category description
    """
  __tablename__ = 'categoria'
  # Define the columns of the table: id, nombre y descripción.
  id = db.Column(db.Integer, primary_key=True)
  nombre = db.Column(db.String(80), unique=False, nullable=False)
  descripcion = db.Column(db.String(250), unique=False, nullable=True)
  user_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)

  def json(self):
        try:
            return {
                'id': self.id,
                'nombre': self.nombre,
                'descripcion': self.descripcion,
                'user_id': self.user_id,
            }
        except Exception as e:
            return {
                'error': f'Error serializing category: {str(e)}'
            }

# -------------------------------------------------------------------
# Task Model
# -------------------------------------------------------------------

class Task(db.Model):
    
    """
    Task Model for representing tasks in the system.
    Attributes:
        id: Unique identifier
        texto_tarea: Task description
        fecha_creacion: Creation date
        fecha_tentativa_finalizacion: Expected completion date
        estado: Current status of the task
        user_id: Foreign key to user
        category_id: Foreign key to category
    """

    __tablename__ = 'tarea'
    VALID_STATES = ['PENDIENTE', 'EN_PROGRESO', 'FINALIZADA']

    id = db.Column(db.Integer, primary_key=True)
    texto_tarea = db.Column(db.String(80), unique=False, nullable=False)
    fecha_creacion = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    fecha_tentativa_finalizacion = db.Column(db.DateTime, unique=False, nullable=False)
    estado = db.Column(db.String(120), unique=False, nullable=False)

    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categoria.id'), nullable=False)
    
    # Timestamps
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    @validates('estado')
    def validate_estado(self, key, estado):
        if estado not in self.VALID_STATES:
            raise ValidationError(f"Estado must be one of: {', '.join(self.VALID_STATES)}")
        return estado
    
    @validates('fecha_tentativa_finalizacion')
    def validate_fecha_tentativa_finalizacion(self, key, date):
        if isinstance(date, str):
            try:
                # Parse string to naive datetime
                naive_date = datetime.strptime(date, '%Y-%m-%d')
                # Make it timezone aware with UTC
                date = naive_date.replace(tzinfo=timezone.utc)
            except ValueError:
                raise ValidationError("Invalid date format. Use YYYY-MM-DD")
        elif isinstance(date, datetime) and date.tzinfo is None:
            # Make naive datetime timezone aware
            date = date.replace(tzinfo=timezone.utc)

        # Get current time in UTC
        now = datetime.now(timezone.utc)

        # Compare timezone-aware datetimes
        if date < now:
            raise ValidationError("Expected completion date cannot be in the past")

        return date

    def json(self):
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
                'error': f'Error serializing task: {str(e)}'
            }

# -------------------------------------------------------------------
# Crear las tablas.
# -------------------------------------------------------------------

db.create_all()

# ----------------------------------------------------------------------------------------- ROUTES/CRUD -----------------------------------------------------------------------------------------

# -------------------------------------------------------------------
# Server Test
# -------------------------------------------------------------------

# Create a test route
@app.route('/test', methods=['GET'])
def test():
  return jsonify({'message': 'The server is running 🥳.'})

# -------------------------------------------------------------------
# User CRUD
# -------------------------------------------------------------------

# Create a new user.
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
    
# Start a session.
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

# Logout.
@app.route('/usuarios/logout', methods=['POST'])
@jwt_required()
def logout():
    return {"message": "Logout successful"}, 200

# Get all users.
@app.route('/usuarios', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.json() for user in users]), 200

# Get a user by id.
@app.route('/usuarios/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.get(id)
    if user:
        return user.json(), 200
    return {"error": "User not found"}, 404

# Update a user by id.
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

# Delete a user by id.
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
# Category CRUD
# -------------------------------------------------------------------

# Create a new category.
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

# Get all categories.
@app.route('/categorias', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([category.json() for category in categories]), 200

# Get a category by id.
@app.route('/categorias/<int:id>', methods=['GET'])
def get_category(id):
    category = Category.query.get(id)
    if category:
        return category.json(), 200
    return {"error": "Category not found"}, 404

# Get all categories by user id.
@app.route('/usuario/<int:user_id>/categorias', methods=['GET'])
@jwt_required()
def get_categories_by_user(user_id):
    categories = Category.query.filter_by(user_id=user_id).all()
    return jsonify([category.json() for category in categories]), 200

# Update a category by id.
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

# Delete a category by id.
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
# Task CRUD
# -------------------------------------------------------------------

# Create a new task.
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

# Get all tasks.
@app.route('/tareas', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([task.json() for task in tasks]), 200

# Get all tasks by user id.
@app.route('/usuario/<int:user_id>/tareas', methods=['GET'])
@jwt_required()
def get_tasks_by_user(user_id):
    tasks = Task.query.filter_by(user_id=user_id).all()
    return jsonify([task.json() for task in tasks]), 200

# Get a task by id.
@app.route('/tareas/<int:id>', methods=['GET'])
def get_task(id):
    task = Task.query.get(id)
    if task:
        return task.json(), 200
    return {"error": "Task not found"}, 404

# Update a task by id.
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
    
# Delete a task by id.
@app.route('/tareas/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_task(id):
    task = Task.query.get(id)
    if task:
        db.session.delete(task)
        db.session.commit()
        return task.json(), 200
    return {"error": "Task not found"}, 404