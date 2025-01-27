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
from datetime import datetime, timezone

# -------------------------------------------------------------------
# App Configuration
# -------------------------------------------------------------------

# Create the Flask app.
app = Flask(__name__)

# Enable CORS: Allow requests from the frontend.
CORS(app)

# Database configuration: Use the DATABASE_URL environment variable (dockerfile).
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('DATABASE_URL')

# SQLAlchemy configuration: Track modifications to the database.
db = SQLAlchemy(app)

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
    imagen_perfil = db.Column(db.String(120), unique=True, nullable=True)
  
    def set_password(self, password):
        if not password or len(password) < 6:
            raise ValidationError("Password must be at least 6 characters long")
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
  nombre = db.Column(db.String(80), unique=True, nullable=False)
  descripcion = db.Column(db.String(250), unique=False, nullable=True)

  def json(self):
        try:
            return {
                'id': self.id,
                'nombre': self.nombre,
                'descripcion': self.descripcion,
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
    fecha_tentativa_finalizacion = db.Column(db.Date, unique=False, nullable=False)
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
        if date < datetime.now(timezone.utc).date():
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


