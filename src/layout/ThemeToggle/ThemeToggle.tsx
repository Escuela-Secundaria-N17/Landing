import { Icon, IconButton } from '@/components/ui';
import { useTheme } from '@/theme/theme';

/** Botón sol/luna: muestra el ícono del tema al que se va a cambiar. */
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const toLight = theme === 'dark';

  return (
    <IconButton label={toLight ? 'Activar modo claro' : 'Activar modo oscuro'} onClick={toggle}>
      <Icon name={toLight ? 'sun' : 'moon'} size={18} />
    </IconButton>
  );
}
