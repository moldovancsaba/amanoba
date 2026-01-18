import { auth } from '@/auth';
import { getTranslations } from 'next-intl/server';
import { LocaleLink } from '@/components/LocaleLink';
import Logo from '@/components/Logo';
import Image from 'next/image';
import Icon, { MdMenuBook, MdEmail, MdGpsFixed, MdEmojiEvents, MdTrendingUp, MdStar } from '@/components/Icon';

/**
 * Landing Page
 * 
 * What: Main entry point for the platform - shows features and allows users to choose to sign in
 * Why: Users should see what the platform offers before being asked to sign in
 */

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  const t = await getTranslations('common');
  const tAuth = await getTranslations('auth');
  
  return (
    <div className="min-h-screen bg-brand-black">
      {/* Header */}
      <header className="border-b border-brand-darkGrey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/AMANOBA.png"
                alt="Amanoba Logo"
                width={48}
                height={48}
                className="h-12 w-auto"
                priority
              />
              <div>
                <h1 className="text-xl font-bold text-brand-white">{t('appName')}</h1>
                <p className="text-sm text-brand-white/70">30 napos tanulási platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {session?.user ? (
                <LocaleLink
                  href="/dashboard"
                  className="px-4 py-2 bg-brand-accent text-brand-black rounded-lg font-semibold hover:bg-brand-primary-400 transition-colors"
                >
                  {t('dashboard')}
                </LocaleLink>
              ) : (
                <LocaleLink
                  href="/auth/signin"
                  className="px-4 py-2 bg-brand-accent text-brand-black rounded-lg font-semibold hover:bg-brand-primary-400 transition-colors"
                >
                  {tAuth('signIn')}
                </LocaleLink>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-white mb-6">
            Tanulj 30 nap alatt
          </h2>
          <p className="text-xl text-brand-white/70 max-w-3xl mx-auto mb-8">
            Strukturált napi leckék, interaktív értékelések és gamifikált tanulási élmény. 
            Kezdj el egy 30 napos kurzust még ma!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {session?.user ? (
              <>
                <LocaleLink 
                  href="/courses" 
                  className="px-8 py-4 bg-brand-accent text-brand-black rounded-lg font-bold text-lg hover:bg-brand-primary-400 transition-colors"
                >
                  Kurzusok böngészése
                </LocaleLink>
                <LocaleLink 
                  href="/dashboard" 
                  className="px-8 py-4 bg-brand-darkGrey text-brand-white rounded-lg font-bold text-lg hover:bg-brand-secondary-700 transition-colors"
                >
                  Irányítópult
                </LocaleLink>
              </>
            ) : (
              <>
                <LocaleLink 
                  href="/auth/signin" 
                  className="px-8 py-4 bg-brand-accent text-brand-black rounded-lg font-bold text-lg hover:bg-brand-primary-400 transition-colors"
                >
                  Kezdés
                </LocaleLink>
                <LocaleLink 
                  href="/courses" 
                  className="px-8 py-4 bg-brand-darkGrey text-brand-white rounded-lg font-bold text-lg hover:bg-brand-secondary-700 transition-colors"
                >
                  Kurzusok megtekintése
                </LocaleLink>
              </>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-brand-darkGrey rounded-xl p-6 border border-brand-accent/30">
            <div className="flex justify-center mb-4">
              <Icon icon={MdMenuBook} size={48} className="text-brand-accent" />
            </div>
            <h3 className="text-xl font-bold text-brand-white mb-2 text-center">
              30 napos kurzusok
            </h3>
            <p className="text-brand-white/70 text-center">
              Strukturált napi leckék, amelyek emailben érkeznek és a platformon is elérhetők
            </p>
          </div>

          <div className="bg-brand-darkGrey rounded-xl p-6 border border-brand-accent/30">
            <div className="flex justify-center mb-4">
              <Icon icon={MdEmail} size={48} className="text-brand-accent" />
            </div>
            <h3 className="text-xl font-bold text-brand-white mb-2 text-center">
              Napi email leckék
            </h3>
            <p className="text-brand-white/70 text-center">
              Minden nap kapj egy új leckét emailben, időzítve a neked megfelelő időpontban
            </p>
          </div>

          <div className="bg-brand-darkGrey rounded-xl p-6 border border-brand-accent/30">
            <div className="flex justify-center mb-4">
              <Icon icon={MdGpsFixed} size={48} className="text-brand-accent" />
            </div>
            <h3 className="text-xl font-bold text-brand-white mb-2 text-center">
              Interaktív értékelések
            </h3>
            <p className="text-brand-white/70 text-center">
              Teszteld a tudásod játékos értékelésekkel minden lecke után
            </p>
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-brand-darkGrey rounded-xl p-6 border border-brand-accent/30">
            <div className="flex justify-center mb-4">
              <Icon icon={MdEmojiEvents} size={48} className="text-brand-accent" />
            </div>
            <h3 className="text-xl font-bold text-brand-white mb-2 text-center">
              Elérhetőségek
            </h3>
            <p className="text-brand-white/70 text-center">
              Szerezz elérhetőségeket, pontokat és XP-t a tanulásért
            </p>
          </div>

          <div className="bg-brand-darkGrey rounded-xl p-6 border border-brand-accent/30">
            <div className="flex justify-center mb-4">
              <Icon icon={MdTrendingUp} size={48} className="text-brand-accent" />
            </div>
            <h3 className="text-xl font-bold text-brand-white mb-2 text-center">
              Haladás követése
            </h3>
            <p className="text-brand-white/70 text-center">
              Kövesd a fejlődésedet és lásd, mennyit tanultál
            </p>
          </div>

          <div className="bg-brand-darkGrey rounded-xl p-6 border border-brand-accent/30">
            <div className="flex justify-center mb-4">
              <Icon icon={MdStar} size={48} className="text-brand-accent" />
            </div>
            <h3 className="text-xl font-bold text-brand-white mb-2 text-center">
              Gamifikáció
            </h3>
            <p className="text-brand-white/70 text-center">
              Szerezz pontokat, szintet lépj és oldj fel új funkciókat
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-brand-darkGrey mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-brand-white/70 text-sm">
              © 2025 {t('appName')}. Minden jog fenntartva.
            </div>
            <div className="flex gap-6">
              <LocaleLink href="/terms" className="text-brand-white/70 hover:text-brand-white text-sm">
                Felhasználási feltételek
              </LocaleLink>
              <LocaleLink href="/privacy" className="text-brand-white/70 hover:text-brand-white text-sm">
                Adatvédelmi irányelvek
              </LocaleLink>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
