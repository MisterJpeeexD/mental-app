import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return <main className="not-found"><span>404</span><h1>Página no encontrada</h1><p>La dirección solicitada no existe.</p><Link to="/">Volver al inicio</Link></main>;
}
