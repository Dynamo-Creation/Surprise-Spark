import fs from 'fs';
import path from 'path';

const comps = [
  'particles',
  'retro-grid',
  'border-beam',
  'orbiting-circles',
  'sparkles-text',
  'magic-card',
  'marquee',
  'confetti',
  'shimmer-button',
  'ripple',
  'animated-beam'
];

const outDir = path.resolve('components/magicui');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function run() {
  for (const name of comps) {
    try {
      const res = await fetch(`https://magicui.design/r/${name}.json`);
      if (!res.ok) {
        console.error(`Failed to fetch ${name}: ${res.statusText}`);
        continue;
      }
      const data = await res.json();
      for (const file of data.files || []) {
        const fileName = path.basename(file.path);
        let content = file.content;
        if (name === 'magic-card') {
          content = content.replace('import { useTheme } from "next-themes"', '');
          content = content.replace(
            `  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDarkTheme = useMemo(() => {
    if (!mounted) return true
    const currentTheme = theme === "system" ? systemTheme : theme
    return currentTheme === "dark"
  }, [theme, systemTheme, mounted])`,
            `  const [isDarkTheme, setIsDarkTheme] = useState(true);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDarkTheme(document.documentElement.classList.contains("dark") || window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);`
          );
        }
        fs.writeFileSync(path.join(outDir, fileName), content, 'utf8');
        console.log(`Successfully installed: ${fileName}`);
      }
    } catch (err) {
      console.error(`Error processing ${name}:`, err);
    }
  }
}

run();
