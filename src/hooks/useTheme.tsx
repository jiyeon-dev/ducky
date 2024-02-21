import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const MEDIA = "(prefers-color-scheme: dark)";
const COLORS = ["light", "dark"];

type ThemeType = "dark" | "light" | "system";
interface ThemeContextProps {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}
interface ThemeProviderProps {
  enableSystem?: boolean | undefined; // 시스템 설정 값 따를지 설정
  storageKey?: string | undefined; // 로컬 스토리지 키
  defaultTheme?: string | undefined; // 기본 테마
  children?: React.ReactNode;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = (props: ThemeProviderProps) => {
  const context = useContext(ThemeContext);

  if (context) return <>{props.children}</>;
  else return <Theme {...props} />;
};

const Theme = ({
  enableSystem = true,
  storageKey = "theme",
  defaultTheme = enableSystem ? "system" : "light",
  children,
}: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<ThemeType>(() =>
    getTheme(storageKey, defaultTheme)
  );

  // DOM에 테마 적용
  const applyTheme = useCallback((theme: ThemeType) => {
    let resolved = theme;

    if (theme === "system" && enableSystem) {
      resolved = getSystemTheme();
    }

    // 클래스에 테마 변경
    const d = document.documentElement; // <html>
    d.classList.remove(...COLORS); // 기존 theme 클래스 제거
    d.classList.add(resolved); // 변경된 theme 클래스 추가

    // style color-scheme 변경
    const newColorScheme = COLORS.includes(resolved)
      ? resolved
      : COLORS.includes(defaultTheme)
      ? defaultTheme
      : "light";
    d.style.colorScheme = newColorScheme;
  }, []);

  // 테마 저장
  const setTheme = useCallback((theme: ThemeType) => {
    setThemeState(theme);

    // 로컬 스토리지에 저장
    try {
      localStorage.setItem(storageKey, theme);
    } catch (e) {
      //
    }
  }, []);

  // 로컬 스토리지 이벤트 핸들링
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) {
        return;
      }

      const theme = e.newValue || defaultTheme;
      setTheme(theme);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [setTheme]);

  // 테마 변경
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const providerValue = useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme, setTheme]
  );

  return (
    <ThemeContext.Provider value={providerValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * 현재 테마 반환
 * @param key 로컬 저장소 키
 * @param fallback 저장소에서 값 못찾을 경우 반환할 theme
 * @returns 테마
 */
const getTheme = (key: string, fallback: string): ThemeType => {
  let theme;
  try {
    theme = localStorage.getItem(key) || undefined;
  } catch (e) {
    //
  }
  return (theme || fallback) as ThemeType;
};

/**
 * 시스템 설정 테마 반환
 * @param e 미디어 쿼리 이벤트
 * @returns 테마
 */
const getSystemTheme = (
  e?: MediaQueryList | MediaQueryListEvent
): ThemeType => {
  if (!e) e = window.matchMedia(MEDIA);
  const isDark = e.matches;
  const systemTheme = isDark ? "dark" : "light";
  return systemTheme;
};

// hook
export const useTheme = () =>
  useContext(ThemeContext) ?? ({} as ThemeContextProps);
