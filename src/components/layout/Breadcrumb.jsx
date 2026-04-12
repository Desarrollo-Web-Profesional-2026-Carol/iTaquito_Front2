import { useNavigate } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { C, FONT } from '../../styles/designTokens';
import { useBreadcrumb } from '../../contexts/BreadcrumbContext';

const Breadcrumb = () => {
  const navigate = useNavigate();
  const { history } = useBreadcrumb();

  // No mostrar si solo hay un item (Inicio)
  if (history.length <= 1) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '10px 0 20px',
        fontFamily: FONT,
        flexWrap: 'wrap',
      }}
    >
      {history.map((item, i) => {
        const isLast = i === history.length - 1;
        return (
          <div key={item.path} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {i > 0 && (
              <ChevronRight size={13} color={C.textMuted} style={{ flexShrink: 0 }} />
            )}
            {isLast ? (
              <span style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                color: C.textPrimary, fontSize: '13px', fontWeight: '700',
                background: `${C.pink}12`,
                border: `1px solid ${C.pink}33`,
                borderRadius: '6px',
                padding: '3px 10px',
              }}>
                {item.label}
              </span>
            ) : (
              <button
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: C.textMuted, fontSize: '13px', fontWeight: '600',
                  fontFamily: FONT, padding: '3px 6px',
                  borderRadius: '6px', transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = C.pink;
                  e.currentTarget.style.background = `${C.pink}10`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = C.textMuted;
                  e.currentTarget.style.background = 'none';
                }}
              >
                {i === 0 && <Home size={12} />}
                {item.label}
              </button>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;