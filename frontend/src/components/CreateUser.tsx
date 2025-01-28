import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Usuario {
    nombre_usuario: string;
    contrasenia: string;
    imagen_perfil?: string;
}

const CreateUser = () => {
    const router = useRouter();
    const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    const initialState = {
        nombre_usuario: '',
        contrasenia: '',
        imagen_perfil: ''
    };

    const [usuario, setUsuario] = useState<Usuario>(initialState);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const [exito, setExito] = useState(false);

    const manejarEnvio = async (e: React.FormEvent) => {
        e.preventDefault();
        setCargando(true);
        setError('');
        setExito(false);

        try {
            await axios.post(`${apiURL}/usuarios`, usuario);
            setExito(true);
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Error al crear usuario');
        } finally {
            setCargando(false);
        }
    };

    return (
        <>
            {/* Toast Notifications */}
            {error && (
                <div className="fixed top-4 right-4 z-50">
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg">
                        <div className="flex items-center">
                            <div className="py-1">
                                <svg className="w-6 h-6 mr-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <div>{error}</div>
                        </div>
                    </div>
                </div>
            )}

            {exito && (
                <div className="fixed top-4 right-4 z-50">
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg">
                        <div className="flex items-center">
                            <div className="py-1">
                                <svg className="w-6 h-6 mr-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <div>¡Usuario creado exitosamente!</div>
                        </div>
                    </div>
                </div>
            )}

            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-xl transform transition-all duration-300 hover:scale-105 w-96">
                    <div className="mb-6 text-center">
                        <h2 className="text-2xl font-bold text-gray-800">Crear Usuario</h2>
                    </div>

                    <form onSubmit={manejarEnvio} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Nombre de Usuario
                            </label>
                            <input
                                type="text"
                                value={usuario.nombre_usuario}
                                onChange={(e) => setUsuario({...usuario, nombre_usuario: e.target.value})}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                value={usuario.contrasenia}
                                onChange={(e) => setUsuario({...usuario, contrasenia: e.target.value})}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                URL Imagen de Perfil (opcional)
                            </label>
                            <input
                                type="text"
                                value={usuario.imagen_perfil || ''}
                                onChange={(e) => setUsuario({...usuario, imagen_perfil: e.target.value})}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="https://ejemplo.com/imagen.jpg"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={cargando}
                            className={`w-full py-2 rounded-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500
                                ${cargando 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                        >
                            {cargando ? 'Creando...' : 'Crear Usuario'}
                        </button>

                        <button
                            type="button"
                            onClick={() => router.push('/login')}
                            className="w-full py-2 mt-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transform transition-all duration-300 hover:scale-105"
                        >
                            Volver al Login
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateUser;