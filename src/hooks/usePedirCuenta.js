import { useState, useCallback } from 'react';
import { ordersService } from '../services/orders';
import { tablesService } from '../services/tables';

/**
 * Hook compartido para el flujo de "Pedir Cuenta".
 * Valida que no haya pedidos en proceso, luego cambia el estado de la mesa.
 *
 * @param {object} opts
 * @param {number|string} opts.iMesaId - ID de la mesa
 * @param {function} [opts.onEnPago]    - Callback cuando el estado es 'en_pago'
 * @param {function} [opts.onDisponible] - Callback cuando el estado es 'disponible'
 */
export function usePedirCuenta({ iMesaId, onEnPago, onDisponible } = {}) {
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const clearError = useCallback(() => setError(''), []);

  /**
   * Ejecuta el flujo completo.
   * Devuelve true si logró cambiar el estado, false si fue bloqueado por error.
   */
  const ejecutar = useCallback(async () => {
    if (!iMesaId) {
      setError('No se identificó la mesa.');
      return false;
    }
    setLoading(true);
    setError('');

    try {
      // 1. Obtener pedidos de la sesión actual
      const token = localStorage.getItem('mesaSessionToken');
      let pedidos = [];
      try {
        const data = await ordersService.getAll({ iMesaId, sTokenSesion: token });
        pedidos = data?.data || [];
      } catch {
        pedidos = [];
      }

      // 2. Bloquear si hay pedidos aún en proceso
      const enProceso = pedidos.filter(o =>
        ['pendiente', 'en_preparacion'].includes(o.sEstado)
      );
      if (enProceso.length > 0) {
        setError(
          `Aún tienes ${enProceso.length} pedido${enProceso.length !== 1 ? 's' : ''} en preparación. ` +
          `Espera a que estén listos antes de pedir la cuenta.`
        );
        return false;
      }

      // 3. Decidir si mandar al cajero o liberar directamente
      const hayCobrables = pedidos.some(o =>
        ['listo', 'entregado'].includes(o.sEstado)
      );

      if (hayCobrables) {
        await tablesService.changeStatus(iMesaId, 'en_pago');
        onEnPago?.();
      } else {
        await tablesService.changeStatus(iMesaId, 'disponible');
        localStorage.removeItem('mesaSessionToken');
        onDisponible?.();
      }

      return true;
    } catch (e) {
      setError('Error al comunicarse con el servidor. Intenta de nuevo.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [iMesaId, onEnPago, onDisponible]);

  return { ejecutar, loading, error, clearError };
}
