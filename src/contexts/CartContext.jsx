import { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext(null);

/* ─── HELPERS ─────────────────────────────────────────────── */
let _counter = 2;

const newPlate = (label) => ({
  id: `plate-${Date.now()}-${Math.random()}`,
  label: label ?? `Plato ${_counter++}`,
  items: [],
});

const firstPlate = () => {
  _counter = 2;
  return { id: `plate-init`, label: 'Plato 1', items: [] };
};

/* ═══════════════════════════════════════════════════════════
   CART PROVIDER
═══════════════════════════════════════════════════════════ */
export const CartProvider = ({ children }) => {
  const [plates, setPlates]           = useState(() => [firstPlate()]);
  const [activePlateId, _setActive]   = useState('plate-init');

  const setActivePlate = useCallback((id) => _setActive(id), []);

  /* ─── Platos ──────────────────────────────────────────── */
  const addPlate = useCallback(() => {
    const plate = newPlate();
    setPlates(prev => [...prev, plate]);
    _setActive(plate.id);
  }, []);

  const removePlate = useCallback((id) => {
    setPlates(prev => {
      if (prev.length <= 1) return prev;
      return prev.filter(p => p.id !== id);
    });
    _setActive(prev => prev === id ? plates[0]?.id ?? 'plate-init' : prev);
  }, [plates]);

  const renamePlate = useCallback((id, label) => {
    setPlates(prev => prev.map(p => p.id === id ? { ...p, label } : p));
  }, []);

  /* ─── Items sobre el plato ACTIVO ──────────────────────── */
  const addItem = useCallback((producto) => {
    setPlates(prev => {
      const pid = activePlateId;
      return prev.map(p => {
        if (p.id !== pid) return p;
        const existe = p.items.find(i => i.id === producto.id);
        const items = existe
          ? p.items.map(i => i.id === producto.id ? { ...i, qty: i.qty + 1 } : i)
          : [...p.items, { ...producto, qty: 1 }];
        return { ...p, items };
      });
    });
  }, [activePlateId]);

  /** Agrega un producto con cantidad exacta al plato activo */
  const addItemQty = useCallback((producto, qty) => {
    if (!qty || qty <= 0) return;
    setPlates(prev => {
      const pid = activePlateId;
      return prev.map(p => {
        if (p.id !== pid) return p;
        const existe = p.items.find(i => i.id === producto.id);
        const items = existe
          ? p.items.map(i => i.id === producto.id ? { ...i, qty: i.qty + qty } : i)
          : [...p.items, { ...producto, qty }];
        return { ...p, items };
      });
    });
  }, [activePlateId]);

  const decrementItem = useCallback((id) => {
    setPlates(prev => {
      const pid = activePlateId;
      return prev.map(p => {
        if (p.id !== pid) return p;
        const items = p.items
          .map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i)
          .filter(i => i.qty > 0);
        return { ...p, items };
      });
    });
  }, [activePlateId]);

  const removeItem = useCallback((id) => {
    setPlates(prev => {
      const pid = activePlateId;
      return prev.map(p => {
        if (p.id !== pid) return p;
        return { ...p, items: p.items.filter(i => i.id !== id) };
      });
    });
  }, [activePlateId]);

  /* ─── Items sobre CUALQUIER plato (sidebar) ─────────── */
  const adjustItemInPlate = useCallback((plateId, itemId, delta) => {
    setPlates(prev => prev.map(p => {
      if (p.id !== plateId) return p;
      const items = p.items
        .map(i => i.id === itemId ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0);
      return { ...p, items };
    }));
  }, []);

  const removeItemFromPlate = useCallback((plateId, itemId) => {
    setPlates(prev => prev.map(p => {
      if (p.id !== plateId) return p;
      return { ...p, items: p.items.filter(i => i.id !== itemId) };
    }));
  }, []);

  /* ─── Reset ───────────────────────────────────────────── */
  const clearAllPlates = useCallback(() => {
    const fresh = firstPlate();
    setPlates([fresh]);
    _setActive(fresh.id);
  }, []);

  const clearCart = clearAllPlates;

  /* ─── Computed ────────────────────────────────────────── */
  const activePlate  = plates.find(p => p.id === activePlateId) ?? plates[0];
  const items        = activePlate?.items ?? [];
  const totalItems   = plates.reduce((s, p) => s + p.items.reduce((si, i) => si + i.qty, 0), 0);
  const totalPrecio  = plates.reduce((s, p) => s + p.items.reduce((si, i) => si + i.precio * i.qty, 0), 0);

  return (
    <CartContext.Provider value={{
      plates, activePlateId, activePlate,
      setActivePlate, addPlate, removePlate, renamePlate,
      items, addItem, addItemQty, decrementItem, removeItem,
      adjustItemInPlate, removeItemFromPlate,
      clearCart, clearAllPlates,
      totalItems, totalPrecio,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
};