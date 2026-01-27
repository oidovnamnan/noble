// Custom Translation Hook
import { useAppStore } from '@/lib/store';
import mn from '@/i18n/mn.json';
import en from '@/i18n/en.json';

const translations = { mn, en };

export function useTranslation() {
    const { language } = useAppStore();

    const t = (key: string) => {
        const keys = key.split('.');
        let value: any = translations[language];

        for (const k of keys) {
            if (value) {
                value = value[k];
            }
        }

        return value || key;
    };

    return { t, language };
}
