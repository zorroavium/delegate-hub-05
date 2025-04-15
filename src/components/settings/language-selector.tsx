import React from 'react';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

// Enhanced language options with names, flags, and RTL support
const languages = [
  // Common languages
  { code: 'en', name: 'English', flag: '🇺🇸', rtl: false, region: 'common' },
  { code: 'es', name: 'Español', flag: '🇪🇸', rtl: false, region: 'common' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', rtl: false, region: 'common' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', rtl: false, region: 'common' },
  { code: 'zh', name: '中文', flag: '🇨🇳', rtl: false, region: 'common' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', rtl: false, region: 'common' },
  { code: 'pt', name: 'Português', flag: '🇵🇹', rtl: false, region: 'common' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', rtl: false, region: 'common' },
  
  // RTL languages
  { code: 'ar', name: 'العربية', flag: '🇸🇦', rtl: true, region: 'rtl' },
  { code: 'he', name: 'עברית', flag: '🇮🇱', rtl: true, region: 'rtl' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷', rtl: true, region: 'rtl' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰', rtl: true, region: 'rtl' },
  
  // Other languages
  { code: 'ru', name: 'Русский', flag: '🇷🇺', rtl: false, region: 'other' },
  { code: 'ko', name: '한국어', flag: '🇰🇷', rtl: false, region: 'other' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', rtl: false, region: 'other' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩', rtl: false, region: 'other' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷', rtl: false, region: 'other' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱', rtl: false, region: 'other' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱', rtl: false, region: 'other' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪', rtl: false, region: 'other' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦', rtl: false, region: 'other' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳', rtl: false, region: 'other' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭', rtl: false, region: 'other' },
];

interface LanguageSelectorProps {
  variant?: 'default' | 'outline' | 'minimal';
  showRegions?: boolean;
}

export function LanguageSelector({ variant = 'default', showRegions = false }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();
  
  // Get current language details
  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];
  
  // Group languages by region if needed
  const groupedLanguages = showRegions
    ? {
        common: languages.filter(lang => lang.region === 'common'),
        rtl: languages.filter(lang => lang.region === 'rtl'),
        other: languages.filter(lang => lang.region === 'other'),
      }
    : { all: languages };
  
  if (variant === 'minimal') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <span className="sr-only">Change language</span>
            <Globe className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <ScrollArea className="h-[300px]">
            {showRegions ? (
              <>
                <DropdownMenuLabel>Common Languages</DropdownMenuLabel>
                {groupedLanguages.common.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as any)}
                    className={language === lang.code ? 'bg-accent' : ''}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                    {language === lang.code && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
                
                <DropdownMenuSeparator />
                <DropdownMenuLabel>RTL Languages</DropdownMenuLabel>
                {groupedLanguages.rtl.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as any)}
                    className={language === lang.code ? 'bg-accent' : ''}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                    {language === lang.code && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
                
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Other Languages</DropdownMenuLabel>
                {groupedLanguages.other.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as any)}
                    className={language === lang.code ? 'bg-accent' : ''}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                    {language === lang.code && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
              </>
            ) : (
              languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as any)}
                  className={language === lang.code ? 'bg-accent' : ''}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                  {language === lang.code && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
              ))
            )}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
  if (variant === 'outline') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Globe className="h-3.5 w-3.5" />
            <span>{currentLanguage.flag}</span>
            <span className="sr-only">{currentLanguage.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <ScrollArea className="h-[300px]">
            {showRegions ? (
              <>
                <DropdownMenuLabel>Common Languages</DropdownMenuLabel>
                {groupedLanguages.common.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as any)}
                    className={language === lang.code ? 'bg-accent' : ''}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                    {language === lang.code && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
                
                <DropdownMenuSeparator />
                <DropdownMenuLabel>RTL Languages</DropdownMenuLabel>
                {groupedLanguages.rtl.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as any)}
                    className={language === lang.code ? 'bg-accent' : ''}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                    {language === lang.code && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
                
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Other Languages</DropdownMenuLabel>
                {groupedLanguages.other.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as any)}
                    className={language === lang.code ? 'bg-accent' : ''}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                    {language === lang.code && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
              </>
            ) : (
              languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as any)}
                  className={language === lang.code ? 'bg-accent' : ''}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                  {language === lang.code && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
              ))
            )}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Globe className="h-4 w-4" />
          <span>{currentLanguage.flag}</span>
          <span>{currentLanguage.name}</span>
          {currentLanguage.rtl && (
            <span className="ml-1 rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-medium leading-none text-muted-foreground">
              RTL
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <ScrollArea className="h-[300px]">
          {showRegions ? (
            <>
              <DropdownMenuLabel>Common Languages</DropdownMenuLabel>
              {groupedLanguages.common.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as any)}
                  className={language === lang.code ? 'bg-accent' : ''}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                  {lang.rtl && (
                    <span className="ml-auto rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-medium leading-none text-muted-foreground">
                      RTL
                    </span>
                  )}
                  {language === lang.code && <Check className="ml-2 h-4 w-4" />}
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel>RTL Languages</DropdownMenuLabel>
              {groupedLanguages.rtl.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as any)}
                  className={language === lang.code ? 'bg-accent' : ''}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                  <span className="ml-auto rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-medium leading-none text-muted-foreground">
                    RTL
                  </span>
                  {language === lang.code && <Check className="ml-2 h-4 w-4" />}
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Other Languages</DropdownMenuLabel>
              {groupedLanguages.other.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as any)}
                  className={language === lang.code ? 'bg-accent' : ''}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                  {lang.rtl && (
                    <span className="ml-auto rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-medium leading-none text-muted-foreground">
                      RTL
                    </span>
                  )}
                  {language === lang.code && <Check className="ml-2 h-4 w-4" />}
                </DropdownMenuItem>
              ))}
            </>
          ) : (
            languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setLanguage(lang.code as any)}
                className={language === lang.code ? 'bg-accent' : ''}
              >
                <span className="mr-2">{lang.flag}</span>
                {lang.name}
                {lang.rtl && (
                  <span className="ml-auto rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-medium leading-none text-muted-foreground">
                    RTL
                  </span>
                )}
                {language === lang.code && <Check className="ml-2 h-4 w-4" />}
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
