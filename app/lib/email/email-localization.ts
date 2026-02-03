import type { Locale } from '@/app/lib/i18n/locales';

type EmailTokens = {
  border: string;
  muted: string;
  bodyText?: string;
  ctaBg?: string;
  ctaText?: string;
};

type UnsubscribeFooterParams = {
  locale: Locale;
  unsubscribeUrl: string;
  courseName: string;
  tokens: EmailTokens;
};

const LESSON_UNSUBSCRIBE_STRINGS: Record<
  Locale,
  {
    reason: (courseName: string) => string;
    linkText: string;
    langAttr?: string;
    dirAttr?: 'ltr' | 'rtl';
  }
> = {
  en: {
    reason: (courseName: string) => `You're receiving this email because you're enrolled in ${courseName}.`,
    linkText: 'Unsubscribe from lesson emails',
    langAttr: 'en',
    dirAttr: 'ltr',
  },
  'en-GB': {
    reason: (courseName: string) => `You're receiving this email because you're enrolled in ${courseName}.`,
    linkText: 'Unsubscribe from lesson emails',
    langAttr: 'en-GB',
    dirAttr: 'ltr',
  },
  'en-US': {
    reason: (courseName: string) => `You're receiving this email because you're enrolled in ${courseName}.`,
    linkText: 'Unsubscribe from lesson emails',
    langAttr: 'en-US',
    dirAttr: 'ltr',
  },
  hu: {
    reason: (courseName: string) => `Azért kapod ezt az e-mailt, mert be vagy iratkozva a(z) ${courseName} kurzusra.`,
    linkText: 'Leiratkozás a leckemail-ekről',
    langAttr: 'hu',
    dirAttr: 'ltr',
  },
  ar: {
    reason: (courseName: string) => `تتلقى هذا البريد الإلكتروني لأنك مسجّل في ${courseName}.`,
    linkText: 'إلغاء الاشتراك في رسائل الدروس',
    langAttr: 'ar',
    dirAttr: 'rtl',
  },
  hi: {
    reason: (courseName: string) => `आपको यह ईमेल इसलिए मिल रहा है क्योंकि आप ${courseName} में नामांकित हैं।`,
    linkText: 'पाठ ईमेल से सदस्यता समाप्त करें',
    langAttr: 'hi',
    dirAttr: 'ltr',
  },
  id: {
    reason: (courseName: string) => `Anda menerima email ini karena Anda terdaftar di ${courseName}.`,
    linkText: 'Berhenti berlangganan email pelajaran',
    langAttr: 'id',
    dirAttr: 'ltr',
  },
  pt: {
    reason: (courseName: string) => `Você está recebendo este e-mail porque está matriculado(a) em ${courseName}.`,
    linkText: 'Cancelar inscrição nos e-mails das lições',
    langAttr: 'pt',
    dirAttr: 'ltr',
  },
  vi: {
    reason: (courseName: string) => `Bạn nhận được email này vì bạn đã đăng ký khóa học ${courseName}.`,
    linkText: 'Hủy đăng ký email bài học',
    langAttr: 'vi',
    dirAttr: 'ltr',
  },
  tr: {
    reason: (courseName: string) => `Bu e-postayı ${courseName} kursuna kayıtlı olduğunuz için alıyorsunuz.`,
    linkText: 'Ders e-postalarından aboneliği iptal et',
    langAttr: 'tr',
    dirAttr: 'ltr',
  },
  bg: {
    reason: (courseName: string) => `Получавате този имейл, защото сте записани в ${courseName}.`,
    linkText: 'Отписване от имейлите с уроци',
    langAttr: 'bg',
    dirAttr: 'ltr',
  },
  pl: {
    reason: (courseName: string) => `Otrzymujesz tę wiadomość, ponieważ jesteś zapisany(-a) na kurs ${courseName}.`,
    linkText: 'Wypisz się z e-maili z lekcjami',
    langAttr: 'pl',
    dirAttr: 'ltr',
  },
  ru: {
    reason: (courseName: string) => `Вы получили это письмо, потому что записаны на курс ${courseName}.`,
    linkText: 'Отписаться от писем с уроками',
    langAttr: 'ru',
    dirAttr: 'ltr',
  },
};

export function renderLessonUnsubscribeFooterHtml(params: UnsubscribeFooterParams) {
  const { locale, unsubscribeUrl, courseName, tokens } = params;
  const strings = LESSON_UNSUBSCRIBE_STRINGS[locale] || LESSON_UNSUBSCRIBE_STRINGS.en;
  const lang = strings.langAttr || locale;
  const dir = strings.dirAttr || (locale === 'ar' ? 'rtl' : 'ltr');

  const reasonText = strings.reason(courseName);
  const linkText = strings.linkText;

  return `
    <hr style="margin: 20px 0; border: none; border-top: 1px solid ${tokens.border};">
    <p style="font-size: 12px; color: ${tokens.muted}; text-align: center;" lang="${lang}" dir="${dir}">
      ${reasonText}
      <a href="${unsubscribeUrl}" style="color: ${tokens.muted};">${linkText}</a>
    </p>
  `;
}

type PaymentUnsubscribeFooterParams = {
  locale: Locale;
  unsubscribeUrl: string;
  tokens: EmailTokens;
};

const PAYMENT_UNSUBSCRIBE_STRINGS: Record<
  Locale,
  {
    reason: string;
    linkText: string;
    langAttr?: string;
    dirAttr?: 'ltr' | 'rtl';
  }
> = {
  en: {
    reason: `You're receiving this email because you made a payment on Amanoba.`,
    linkText: 'Unsubscribe from email notifications',
    langAttr: 'en',
    dirAttr: 'ltr',
  },
  'en-GB': {
    reason: `You're receiving this email because you made a payment on Amanoba.`,
    linkText: 'Unsubscribe from email notifications',
    langAttr: 'en-GB',
    dirAttr: 'ltr',
  },
  'en-US': {
    reason: `You're receiving this email because you made a payment on Amanoba.`,
    linkText: 'Unsubscribe from email notifications',
    langAttr: 'en-US',
    dirAttr: 'ltr',
  },
  hu: {
    reason: `Ezt az emailt azért kaptad, mert fizetést végeztél az Amanobán.`,
    linkText: 'Leiratkozás az email értesítésekről',
    langAttr: 'hu',
    dirAttr: 'ltr',
  },
  ar: {
    reason: `تتلقى هذا البريد الإلكتروني لأنك أجريت عملية دفع على أمانوبا.`,
    linkText: 'إلغاء الاشتراك في إشعارات البريد الإلكتروني',
    langAttr: 'ar',
    dirAttr: 'rtl',
  },
  hi: {
    reason: `आपको यह ईमेल इसलिए मिल रहा है क्योंकि आपने Amanoba पर भुगतान किया है।`,
    linkText: 'ईमेल सूचनाओं से सदस्यता समाप्त करें',
    langAttr: 'hi',
    dirAttr: 'ltr',
  },
  id: {
    reason: `Anda menerima email ini karena Anda melakukan pembayaran di Amanoba.`,
    linkText: 'Berhenti berlangganan notifikasi email',
    langAttr: 'id',
    dirAttr: 'ltr',
  },
  pt: {
    reason: `Você está recebendo este e-mail porque fez um pagamento na Amanoba.`,
    linkText: 'Cancelar inscrição nas notificações por e-mail',
    langAttr: 'pt',
    dirAttr: 'ltr',
  },
  vi: {
    reason: `Bạn nhận được email này vì bạn đã thanh toán trên Amanoba.`,
    linkText: 'Hủy đăng ký thông báo email',
    langAttr: 'vi',
    dirAttr: 'ltr',
  },
  tr: {
    reason: `Bu e-postayı Amanoba üzerinden ödeme yaptığınız için alıyorsunuz.`,
    linkText: 'E-posta bildirimlerinden aboneliği iptal et',
    langAttr: 'tr',
    dirAttr: 'ltr',
  },
  bg: {
    reason: `Получавате този имейл, защото извършихте плащане в Amanoba.`,
    linkText: 'Отписване от имейл известия',
    langAttr: 'bg',
    dirAttr: 'ltr',
  },
  pl: {
    reason: `Otrzymujesz tę wiadomość, ponieważ dokonałeś(-aś) płatności w Amanoba.`,
    linkText: 'Wypisz się z powiadomień e-mail',
    langAttr: 'pl',
    dirAttr: 'ltr',
  },
  ru: {
    reason: `Вы получили это письмо, потому что совершили оплату в Amanoba.`,
    linkText: 'Отписаться от email‑уведомлений',
    langAttr: 'ru',
    dirAttr: 'ltr',
  },
};

export function renderPaymentUnsubscribeFooterHtml(params: PaymentUnsubscribeFooterParams) {
  const { locale, unsubscribeUrl, tokens } = params;
  const strings = PAYMENT_UNSUBSCRIBE_STRINGS[locale] || PAYMENT_UNSUBSCRIBE_STRINGS.en;
  const lang = strings.langAttr || locale;
  const dir = strings.dirAttr || (locale === 'ar' ? 'rtl' : 'ltr');

  return `
    <hr style="margin: 20px 0; border: none; border-top: 1px solid ${tokens.border};">
    <p style="font-size: 12px; color: ${tokens.muted}; text-align: center;" lang="${lang}" dir="${dir}">
      ${strings.reason}
      <a href="${unsubscribeUrl}" style="color: ${tokens.muted};">${strings.linkText}</a>
    </p>
  `;
}

type BasicEmailParams = {
  locale: Locale;
  playerName: string;
  courseName: string;
  appUrl: string;
  tokens: Required<Pick<EmailTokens, 'border' | 'muted'>> &
    Pick<EmailTokens, 'bodyText' | 'ctaBg' | 'ctaText'>;
};

function getLocaleStrings(locale: Locale) {
  const stringsByLocale: Record<
    Locale,
    {
      welcomeSubject: (courseName: string) => string;
      welcomeHeading: (courseName: string) => string;
      welcomeIntro: (playerName: string, courseName: string) => string;
      welcomeBody: (durationDays: number) => string;
      welcomeCta: string;

      completionSubject: (courseName: string) => string;
      completionHeading: (playerName: string) => string;
      completionBody: (courseName: string, durationDays: number) => string;
      completionCta: string;
      completionUpsellHeading: string;

      reminderSubject: (dayNumber: number, courseName: string) => string;
      reminderHeading: (playerName: string) => string;
      reminderBody: (dayNumber: number, courseName: string) => string;
      reminderCta: (dayNumber: number) => string;

      paymentSubject: (courseName: string) => string;
      paymentHeading: string;
      paymentThanks: (playerName: string) => string;
      paymentActivated: string;
      paymentDetailsHeading: string;
      paymentLabels: {
        product: string;
        amount: string;
        premiumExpires: string;
        transactionId: string;
      };
      paymentCtaCourse: string;
      paymentCtaBrowse: string;
      paymentSupport: (email: string) => string;
      paymentThanksClosing: string;

      teamSignoff: string;
    }
  > = {
    en: {
      welcomeSubject: courseName => `Welcome to ${courseName}!`,
      welcomeHeading: courseName => `Welcome to ${courseName}!`,
      welcomeIntro: (playerName, courseName) =>
        `Hi ${playerName}, you've successfully enrolled in ${courseName}.`,
      welcomeBody: durationDays =>
        `You’ll receive a daily lesson email as you progress through this ${durationDays}-day journey.`,
      welcomeCta: 'Open your course dashboard',

      completionSubject: courseName => `Congratulations! You’ve completed ${courseName}!`,
      completionHeading: playerName => `Congratulations, ${playerName}!`,
      completionBody: (courseName, durationDays) =>
        `You’ve successfully completed ${courseName}. Finishing all ${durationDays} days is a real achievement.`,
      completionCta: 'Browse more courses',
      completionUpsellHeading: 'Recommended for you',

      reminderSubject: (dayNumber, courseName) => `Don’t miss Day ${dayNumber} of ${courseName}`,
      reminderHeading: playerName => `Hi ${playerName}!`,
      reminderBody: (dayNumber, courseName) =>
        `You haven’t completed Day ${dayNumber} of ${courseName} yet. Continue today to keep your momentum going.`,
      reminderCta: dayNumber => `Complete Day ${dayNumber}`,

      paymentSubject: courseName => `Payment confirmed — ${courseName}`,
      paymentHeading: 'Payment successful!',
      paymentThanks: playerName => `Hi ${playerName},`,
      paymentActivated: 'Thank you for your payment. Your premium access has been activated.',
      paymentDetailsHeading: 'Payment details',
      paymentLabels: {
        product: 'Product',
        amount: 'Amount',
        premiumExpires: 'Premium expires',
        transactionId: 'Transaction ID',
      },
      paymentCtaCourse: 'View course',
      paymentCtaBrowse: 'Browse courses',
      paymentSupport: email => `If you have any questions, contact us at ${email}.`,
      paymentThanksClosing: 'Thank you for learning with Amanoba!',

      teamSignoff: '— The Amanoba Team',
    },
    'en-GB': {
      welcomeSubject: courseName => `Welcome to ${courseName}!`,
      welcomeHeading: courseName => `Welcome to ${courseName}!`,
      welcomeIntro: (playerName, courseName) =>
        `Hi ${playerName}, you've successfully enrolled in ${courseName}.`,
      welcomeBody: durationDays =>
        `You'll receive a daily lesson email as you progress through this ${durationDays}-day journey.`,
      welcomeCta: 'Open your course dashboard',

      completionSubject: courseName => `Congratulations! You've completed ${courseName}!`,
      completionHeading: playerName => `Congratulations, ${playerName}!`,
      completionBody: (courseName, durationDays) =>
        `You've successfully completed ${courseName}. Finishing all ${durationDays} days is a real achievement.`,
      completionCta: 'Browse more courses',
      completionUpsellHeading: 'Recommended for you',

      reminderSubject: (dayNumber, courseName) => `Don't miss Day ${dayNumber} of ${courseName}`,
      reminderHeading: playerName => `Hi ${playerName}!`,
      reminderBody: (dayNumber, courseName) =>
        `You haven't completed Day ${dayNumber} of ${courseName} yet. Continue today to keep your momentum going.`,
      reminderCta: dayNumber => `Complete Day ${dayNumber}`,

      paymentSubject: courseName => `Payment confirmed — ${courseName}`,
      paymentHeading: 'Payment successful!',
      paymentThanks: playerName => `Hi ${playerName},`,
      paymentActivated: 'Thank you for your payment. Your premium access has been activated.',
      paymentDetailsHeading: 'Payment details',
      paymentLabels: {
        product: 'Product',
        amount: 'Amount',
        premiumExpires: 'Premium expires',
        transactionId: 'Transaction ID',
      },
      paymentCtaCourse: 'View course',
      paymentCtaBrowse: 'Browse courses',
      paymentSupport: email => `If you have any questions, contact us at ${email}.`,
      paymentThanksClosing: 'Thank you for learning with Amanoba!',

      teamSignoff: '— The Amanoba Team',
    },
    'en-US': {
      welcomeSubject: courseName => `Welcome to ${courseName}!`,
      welcomeHeading: courseName => `Welcome to ${courseName}!`,
      welcomeIntro: (playerName, courseName) =>
        `Hi ${playerName}, you've successfully enrolled in ${courseName}.`,
      welcomeBody: durationDays =>
        `You'll receive a daily lesson email as you progress through this ${durationDays}-day journey.`,
      welcomeCta: 'Open your course dashboard',

      completionSubject: courseName => `Congratulations! You've completed ${courseName}!`,
      completionHeading: playerName => `Congratulations, ${playerName}!`,
      completionBody: (courseName, durationDays) =>
        `You've successfully completed ${courseName}. Finishing all ${durationDays} days is a real achievement.`,
      completionCta: 'Browse more courses',
      completionUpsellHeading: 'Recommended for you',

      reminderSubject: (dayNumber, courseName) => `Don't miss Day ${dayNumber} of ${courseName}`,
      reminderHeading: playerName => `Hi ${playerName}!`,
      reminderBody: (dayNumber, courseName) =>
        `You haven't completed Day ${dayNumber} of ${courseName} yet. Continue today to keep your momentum going.`,
      reminderCta: dayNumber => `Complete Day ${dayNumber}`,

      paymentSubject: courseName => `Payment confirmed — ${courseName}`,
      paymentHeading: 'Payment successful!',
      paymentThanks: playerName => `Hi ${playerName},`,
      paymentActivated: 'Thank you for your payment. Your premium access has been activated.',
      paymentDetailsHeading: 'Payment details',
      paymentLabels: {
        product: 'Product',
        amount: 'Amount',
        premiumExpires: 'Premium expires',
        transactionId: 'Transaction ID',
      },
      paymentCtaCourse: 'View course',
      paymentCtaBrowse: 'Browse courses',
      paymentSupport: email => `If you have any questions, contact us at ${email}.`,
      paymentThanksClosing: 'Thank you for learning with Amanoba!',

      teamSignoff: '— The Amanoba Team',
    },
    hu: {
      welcomeSubject: courseName => `Üdvözlünk a(z) ${courseName} kurzuson!`,
      welcomeHeading: courseName => `Üdvözlünk a(z) ${courseName} kurzuson!`,
      welcomeIntro: (playerName, courseName) => `Szia ${playerName}! Sikeresen beiratkoztál a(z) ${courseName} kurzusra.`,
      welcomeBody: durationDays =>
        `A fejlődésed során naponta kapsz egy leckemailt ebben a ${durationDays} napos tanulási útban.`,
      welcomeCta: 'Kurzus irányítópult megnyitása',

      completionSubject: courseName => `Gratulálunk! Teljesítetted a(z) ${courseName} kurzust!`,
      completionHeading: playerName => `Gratulálunk, ${playerName}!`,
      completionBody: (courseName, durationDays) =>
        `Sikeresen teljesítetted a(z) ${courseName} kurzust. ${durationDays} nap végigcsinálása komoly eredmény.`,
      completionCta: 'További kurzusok böngészése',
      completionUpsellHeading: 'Javasolt következő kurzusok',

      reminderSubject: (dayNumber, courseName) => `Ne maradj le! ${dayNumber}. nap — ${courseName}`,
      reminderHeading: playerName => `Szia ${playerName}!`,
      reminderBody: (dayNumber, courseName) =>
        `Még nem teljesítetted a(z) ${courseName} ${dayNumber}. napját. Folytasd ma, és tartsd meg a lendületet!`,
      reminderCta: dayNumber => `${dayNumber}. nap teljesítése`,

      paymentSubject: courseName => `Fizetés megerősítve — ${courseName}`,
      paymentHeading: 'Fizetés sikeres!',
      paymentThanks: playerName => `Kedves ${playerName},`,
      paymentActivated: 'Köszönjük a fizetésed! A prémium hozzáférésed aktiválva lett.',
      paymentDetailsHeading: 'Fizetési részletek',
      paymentLabels: {
        product: 'Termék',
        amount: 'Összeg',
        premiumExpires: 'Prémium lejárat',
        transactionId: 'Tranzakció ID',
      },
      paymentCtaCourse: 'Kurzus megtekintése',
      paymentCtaBrowse: 'Kurzusok böngészése',
      paymentSupport: email => `Ha kérdésed van, írj nekünk: ${email}.`,
      paymentThanksClosing: 'Köszönjük, hogy az Amanobával tanulsz!',

      teamSignoff: '— Az Amanoba csapat',
    },
    ar: {
      welcomeSubject: courseName => `مرحبًا بك في ${courseName}!`,
      welcomeHeading: courseName => `مرحبًا بك في ${courseName}!`,
      welcomeIntro: (playerName, courseName) => `مرحبًا ${playerName}، لقد تم تسجيلك بنجاح في ${courseName}.`,
      welcomeBody: durationDays => `ستتلقى رسالة يومية بالدرس أثناء تقدمك في هذه الرحلة التعليمية لمدة ${durationDays} يومًا.`,
      welcomeCta: 'افتح لوحة دوراتك',

      completionSubject: courseName => `تهانينا! لقد أكملت ${courseName}!`,
      completionHeading: playerName => `تهانينا، ${playerName}!`,
      completionBody: (courseName, durationDays) =>
        `لقد أكملت بنجاح ${courseName}. إن إنهاء جميع أيام التعلم (${durationDays} يومًا) إنجاز رائع.`,
      completionCta: 'تصفح دورات أخرى',
      completionUpsellHeading: 'موصى به لك',

      reminderSubject: (dayNumber, courseName) => `لا تفوّت اليوم ${dayNumber} من ${courseName}`,
      reminderHeading: playerName => `مرحبًا ${playerName}!`,
      reminderBody: (dayNumber, courseName) =>
        `لم تُكمل بعد درس اليوم ${dayNumber} من ${courseName}. تابع اليوم للحفاظ على الزخم.`,
      reminderCta: dayNumber => `أكمل اليوم ${dayNumber}`,

      paymentSubject: courseName => `تم تأكيد الدفع — ${courseName}`,
      paymentHeading: 'تم الدفع بنجاح!',
      paymentThanks: playerName => `مرحبًا ${playerName}،`,
      paymentActivated: 'شكرًا لك على الدفع. تم تفعيل وصولك إلى المزايا المدفوعة.',
      paymentDetailsHeading: 'تفاصيل الدفع',
      paymentLabels: {
        product: 'المنتج',
        amount: 'المبلغ',
        premiumExpires: 'انتهاء الاشتراك',
        transactionId: 'رقم العملية',
      },
      paymentCtaCourse: 'عرض الدورة',
      paymentCtaBrowse: 'تصفح الدورات',
      paymentSupport: email => `إذا كانت لديك أي أسئلة، تواصل معنا عبر ${email}.`,
      paymentThanksClosing: 'شكرًا لتعلمك مع أمانوبا!',

      teamSignoff: '— فريق أمانوبا',
    },
    hi: {
      welcomeSubject: courseName => `${courseName} में आपका स्वागत है!`,
      welcomeHeading: courseName => `${courseName} में आपका स्वागत है!`,
      welcomeIntro: (playerName, courseName) => `नमस्ते ${playerName}, आपने ${courseName} में सफलतापूर्वक नामांकन कर लिया है।`,
      welcomeBody: durationDays => `इस ${durationDays}-दिवसीय यात्रा में आगे बढ़ते हुए आपको रोज़ एक पाठ ईमेल मिलेगा।`,
      welcomeCta: 'अपना कोर्स डैशबोर्ड खोलें',

      completionSubject: courseName => `बधाई हो! आपने ${courseName} पूरा कर लिया है!`,
      completionHeading: playerName => `बधाई हो, ${playerName}!`,
      completionBody: (courseName, durationDays) =>
        `आपने ${courseName} सफलतापूर्वक पूरा कर लिया है। पूरे ${durationDays} दिन पूरे करना एक बड़ी उपलब्धि है।`,
      completionCta: 'और कोर्स देखें',
      completionUpsellHeading: 'आपके लिए अनुशंसित',

      reminderSubject: (dayNumber, courseName) => `${courseName} का दिन ${dayNumber} मिस न करें`,
      reminderHeading: playerName => `नमस्ते ${playerName}!`,
      reminderBody: (dayNumber, courseName) =>
        `आपने अभी तक ${courseName} का दिन ${dayNumber} पूरा नहीं किया है। आज आगे बढ़ें और गति बनाए रखें।`,
      reminderCta: dayNumber => `दिन ${dayNumber} पूरा करें`,

      paymentSubject: courseName => `भुगतान पुष्टि — ${courseName}`,
      paymentHeading: 'भुगतान सफल!',
      paymentThanks: playerName => `नमस्ते ${playerName},`,
      paymentActivated: 'आपके भुगतान के लिए धन्यवाद। आपकी प्रीमियम एक्सेस सक्रिय कर दी गई है।',
      paymentDetailsHeading: 'भुगतान विवरण',
      paymentLabels: {
        product: 'उत्पाद',
        amount: 'राशि',
        premiumExpires: 'प्रीमियम समाप्ति',
        transactionId: 'लेन-देन आईडी',
      },
      paymentCtaCourse: 'कोर्स देखें',
      paymentCtaBrowse: 'कोर्स ब्राउज़ करें',
      paymentSupport: email => `किसी भी प्रश्न के लिए, हमसे ${email} पर संपर्क करें।`,
      paymentThanksClosing: 'Amanoba के साथ सीखने के लिए धन्यवाद!',

      teamSignoff: '— Amanoba टीम',
    },
    id: {
      welcomeSubject: courseName => `Selamat datang di ${courseName}!`,
      welcomeHeading: courseName => `Selamat datang di ${courseName}!`,
      welcomeIntro: (playerName, courseName) => `Halo ${playerName}, kamu berhasil mendaftar di ${courseName}.`,
      welcomeBody: durationDays => `Saat kamu belajar dalam perjalanan ${durationDays} hari ini, kamu akan menerima email pelajaran setiap hari.`,
      welcomeCta: 'Buka dasbor kursus',

      completionSubject: courseName => `Selamat! Kamu telah menyelesaikan ${courseName}!`,
      completionHeading: playerName => `Selamat, ${playerName}!`,
      completionBody: (courseName, durationDays) =>
        `Kamu berhasil menyelesaikan ${courseName}. Menuntaskan semua ${durationDays} hari adalah pencapaian besar.`,
      completionCta: 'Jelajahi kursus lain',
      completionUpsellHeading: 'Direkomendasikan untuk Anda',

      reminderSubject: (dayNumber, courseName) => `Jangan lewatkan Hari ${dayNumber} dari ${courseName}`,
      reminderHeading: playerName => `Halo ${playerName}!`,
      reminderBody: (dayNumber, courseName) =>
        `Kamu belum menyelesaikan Hari ${dayNumber} dari ${courseName}. Lanjutkan hari ini untuk menjaga momentum.`,
      reminderCta: dayNumber => `Selesaikan Hari ${dayNumber}`,

      paymentSubject: courseName => `Pembayaran dikonfirmasi — ${courseName}`,
      paymentHeading: 'Pembayaran berhasil!',
      paymentThanks: playerName => `Halo ${playerName},`,
      paymentActivated: 'Terima kasih atas pembayaranmu. Akses premium kamu telah diaktifkan.',
      paymentDetailsHeading: 'Detail pembayaran',
      paymentLabels: {
        product: 'Produk',
        amount: 'Jumlah',
        premiumExpires: 'Premium berakhir',
        transactionId: 'ID transaksi',
      },
      paymentCtaCourse: 'Lihat kursus',
      paymentCtaBrowse: 'Jelajahi kursus',
      paymentSupport: email => `Jika ada pertanyaan, hubungi kami di ${email}.`,
      paymentThanksClosing: 'Terima kasih telah belajar bersama Amanoba!',

      teamSignoff: '— Tim Amanoba',
    },
    pt: {
      welcomeSubject: courseName => `Boas-vindas a ${courseName}!`,
      welcomeHeading: courseName => `Boas-vindas a ${courseName}!`,
      welcomeIntro: (playerName, courseName) => `Olá ${playerName}, você se inscreveu com sucesso em ${courseName}.`,
      welcomeBody: durationDays => `Ao avançar nesta jornada de ${durationDays} dias, você receberá um e-mail de lição por dia.`,
      welcomeCta: 'Abrir painel do curso',

      completionSubject: courseName => `Parabéns! Você concluiu ${courseName}!`,
      completionHeading: playerName => `Parabéns, ${playerName}!`,
      completionBody: (courseName, durationDays) =>
        `Você concluiu ${courseName} com sucesso. Completar todos os ${durationDays} dias é uma grande conquista.`,
      completionCta: 'Ver mais cursos',
      completionUpsellHeading: 'Recomendado para você',

      reminderSubject: (dayNumber, courseName) => `Não perca o Dia ${dayNumber} de ${courseName}`,
      reminderHeading: playerName => `Olá ${playerName}!`,
      reminderBody: (dayNumber, courseName) =>
        `Você ainda não concluiu o Dia ${dayNumber} de ${courseName}. Continue hoje para manter o ritmo.`,
      reminderCta: dayNumber => `Concluir o Dia ${dayNumber}`,

      paymentSubject: courseName => `Pagamento confirmado — ${courseName}`,
      paymentHeading: 'Pagamento aprovado!',
      paymentThanks: playerName => `Olá ${playerName},`,
      paymentActivated: 'Obrigado pelo pagamento. Seu acesso premium foi ativado.',
      paymentDetailsHeading: 'Detalhes do pagamento',
      paymentLabels: {
        product: 'Produto',
        amount: 'Valor',
        premiumExpires: 'Premium expira em',
        transactionId: 'ID da transação',
      },
      paymentCtaCourse: 'Ver curso',
      paymentCtaBrowse: 'Ver cursos',
      paymentSupport: email => `Se tiver dúvidas, fale conosco em ${email}.`,
      paymentThanksClosing: 'Obrigado por aprender com a Amanoba!',

      teamSignoff: '— Equipe Amanoba',
    },
    vi: {
      welcomeSubject: courseName => `Chào mừng bạn đến với ${courseName}!`,
      welcomeHeading: courseName => `Chào mừng bạn đến với ${courseName}!`,
      welcomeIntro: (playerName, courseName) => `Chào ${playerName}, bạn đã đăng ký thành công khóa học ${courseName}.`,
      welcomeBody: durationDays => `Trong hành trình ${durationDays} ngày này, bạn sẽ nhận một email bài học mỗi ngày khi bạn tiến bộ.`,
      welcomeCta: 'Mở bảng điều khiển khóa học',

      completionSubject: courseName => `Chúc mừng! Bạn đã hoàn thành ${courseName}!`,
      completionHeading: playerName => `Chúc mừng, ${playerName}!`,
      completionBody: (courseName, durationDays) =>
        `Bạn đã hoàn thành ${courseName}. Hoàn thành đầy đủ ${durationDays} ngày là một thành tích đáng tự hào.`,
      completionCta: 'Khám phá khóa học khác',
      completionUpsellHeading: 'Đề xuất cho bạn',

      reminderSubject: (dayNumber, courseName) => `Đừng bỏ lỡ Ngày ${dayNumber} của ${courseName}`,
      reminderHeading: playerName => `Chào ${playerName}!`,
      reminderBody: (dayNumber, courseName) =>
        `Bạn chưa hoàn thành Ngày ${dayNumber} của ${courseName}. Hãy tiếp tục hôm nay để giữ đà học tập.`,
      reminderCta: dayNumber => `Hoàn thành Ngày ${dayNumber}`,

      paymentSubject: courseName => `Xác nhận thanh toán — ${courseName}`,
      paymentHeading: 'Thanh toán thành công!',
      paymentThanks: playerName => `Chào ${playerName},`,
      paymentActivated: 'Cảm ơn bạn đã thanh toán. Quyền truy cập premium của bạn đã được kích hoạt.',
      paymentDetailsHeading: 'Chi tiết thanh toán',
      paymentLabels: {
        product: 'Sản phẩm',
        amount: 'Số tiền',
        premiumExpires: 'Premium hết hạn',
        transactionId: 'Mã giao dịch',
      },
      paymentCtaCourse: 'Xem khóa học',
      paymentCtaBrowse: 'Duyệt khóa học',
      paymentSupport: email => `Nếu bạn có câu hỏi, hãy liên hệ chúng tôi qua ${email}.`,
      paymentThanksClosing: 'Cảm ơn bạn đã học cùng Amanoba!',

      teamSignoff: '— Đội ngũ Amanoba',
    },
    tr: {
      welcomeSubject: courseName => `${courseName} kursuna hoş geldin!`,
      welcomeHeading: courseName => `${courseName} kursuna hoş geldin!`,
      welcomeIntro: (playerName, courseName) => `Merhaba ${playerName}, ${courseName} kursuna başarıyla kaydoldun.`,
      welcomeBody: durationDays => `Bu ${durationDays} günlük yolculukta ilerledikçe her gün bir ders e-postası alacaksın.`,
      welcomeCta: 'Kurs panosunu aç',

      completionSubject: courseName => `Tebrikler! ${courseName} kursunu tamamladın!`,
      completionHeading: playerName => `Tebrikler, ${playerName}!`,
      completionBody: (courseName, durationDays) =>
        `${courseName} kursunu başarıyla tamamladın. Tüm ${durationDays} günü bitirmek büyük bir başarı.`,
      completionCta: 'Diğer kurslara göz at',
      completionUpsellHeading: 'Sizin için önerilenler',

      reminderSubject: (dayNumber, courseName) => `${courseName} kursunun ${dayNumber}. gününü kaçırma`,
      reminderHeading: playerName => `Merhaba ${playerName}!`,
      reminderBody: (dayNumber, courseName) =>
        `${courseName} kursunun ${dayNumber}. gününü henüz tamamlamadın. Bugün devam ederek ivmeni koru.`,
      reminderCta: dayNumber => `${dayNumber}. günü tamamla`,

      paymentSubject: courseName => `Ödeme onaylandı — ${courseName}`,
      paymentHeading: 'Ödeme başarılı!',
      paymentThanks: playerName => `Merhaba ${playerName},`,
      paymentActivated: 'Ödemen için teşekkürler. Premium erişimin etkinleştirildi.',
      paymentDetailsHeading: 'Ödeme detayları',
      paymentLabels: {
        product: 'Ürün',
        amount: 'Tutar',
        premiumExpires: 'Premium bitiş',
        transactionId: 'İşlem ID',
      },
      paymentCtaCourse: 'Kursu görüntüle',
      paymentCtaBrowse: 'Kurslara göz at',
      paymentSupport: email => `Soruların için bizimle ${email} üzerinden iletişime geçebilirsin.`,
      paymentThanksClosing: 'Amanoba ile öğrendiğin için teşekkürler!',

      teamSignoff: '— Amanoba Ekibi',
    },
    bg: {
      welcomeSubject: courseName => `Добре дошли в ${courseName}!`,
      welcomeHeading: courseName => `Добре дошли в ${courseName}!`,
      welcomeIntro: (playerName, courseName) => `Здравейте ${playerName}, успешно се записахте в ${courseName}.`,
      welcomeBody: durationDays => `Докато напредвате в това ${durationDays}-дневно обучение, ще получавате по един урок по имейл на ден.`,
      welcomeCta: 'Отворете таблото на курса',

      completionSubject: courseName => `Поздравления! Завършихте ${courseName}!`,
      completionHeading: playerName => `Поздравления, ${playerName}!`,
      completionBody: (courseName, durationDays) =>
        `Успешно завършихте ${courseName}. Да преминете през всички ${durationDays} дни е сериозно постижение.`,
      completionCta: 'Разгледайте още курсове',
      completionUpsellHeading: 'Препоръчано за вас',

      reminderSubject: (dayNumber, courseName) => `Не пропускайте Ден ${dayNumber} от ${courseName}`,
      reminderHeading: playerName => `Здравейте ${playerName}!`,
      reminderBody: (dayNumber, courseName) =>
        `Още не сте завършили Ден ${dayNumber} от ${courseName}. Продължете днес, за да запазите инерцията.`,
      reminderCta: dayNumber => `Завършете Ден ${dayNumber}`,

      paymentSubject: courseName => `Потвърдено плащане — ${courseName}`,
      paymentHeading: 'Плащането е успешно!',
      paymentThanks: playerName => `Здравейте ${playerName},`,
      paymentActivated: 'Благодарим за плащането. Премиум достъпът ви е активиран.',
      paymentDetailsHeading: 'Детайли за плащането',
      paymentLabels: {
        product: 'Продукт',
        amount: 'Сума',
        premiumExpires: 'Премиум изтича',
        transactionId: 'ID на транзакция',
      },
      paymentCtaCourse: 'Виж курса',
      paymentCtaBrowse: 'Разгледай курсове',
      paymentSupport: email => `Ако имате въпроси, свържете се с нас на ${email}.`,
      paymentThanksClosing: 'Благодарим, че учите с Amanoba!',

      teamSignoff: '— Екипът на Amanoba',
    },
    pl: {
      welcomeSubject: courseName => `Witamy w ${courseName}!`,
      welcomeHeading: courseName => `Witamy w ${courseName}!`,
      welcomeIntro: (playerName, courseName) => `Cześć ${playerName}, pomyślnie zapisano Cię na kurs ${courseName}.`,
      welcomeBody: durationDays => `W trakcie tej ${durationDays}-dniowej ścieżki będziesz otrzymywać codziennie e-mail z lekcją.`,
      welcomeCta: 'Otwórz panel kursu',

      completionSubject: courseName => `Gratulacje! Ukończyłeś(-aś) ${courseName}!`,
      completionHeading: playerName => `Gratulacje, ${playerName}!`,
      completionBody: (courseName, durationDays) =>
        `Ukończyłeś(-aś) ${courseName}. Przejście przez wszystkie ${durationDays} dni to duże osiągnięcie.`,
      completionCta: 'Zobacz więcej kursów',
      completionUpsellHeading: 'Polecane dla Ciebie',

      reminderSubject: (dayNumber, courseName) => `Nie przegap Dnia ${dayNumber} kursu ${courseName}`,
      reminderHeading: playerName => `Cześć ${playerName}!`,
      reminderBody: (dayNumber, courseName) =>
        `Nie ukończyłeś(-aś) jeszcze Dnia ${dayNumber} kursu ${courseName}. Kontynuuj dziś, aby utrzymać tempo.`,
      reminderCta: dayNumber => `Ukończ Dzień ${dayNumber}`,

      paymentSubject: courseName => `Płatność potwierdzona — ${courseName}`,
      paymentHeading: 'Płatność zakończona sukcesem!',
      paymentThanks: playerName => `Cześć ${playerName},`,
      paymentActivated: 'Dziękujemy za płatność. Dostęp premium został aktywowany.',
      paymentDetailsHeading: 'Szczegóły płatności',
      paymentLabels: {
        product: 'Produkt',
        amount: 'Kwota',
        premiumExpires: 'Premium wygasa',
        transactionId: 'ID transakcji',
      },
      paymentCtaCourse: 'Zobacz kurs',
      paymentCtaBrowse: 'Przeglądaj kursy',
      paymentSupport: email => `Jeśli masz pytania, skontaktuj się z nami: ${email}.`,
      paymentThanksClosing: 'Dziękujemy za naukę z Amanoba!',

      teamSignoff: '— Zespół Amanoba',
    },
    ru: {
      welcomeSubject: courseName => `Добро пожаловать на курс «${courseName}»!`,
      welcomeHeading: courseName => `Добро пожаловать на курс «${courseName}»!`,
      welcomeIntro: (playerName, courseName) => `Здравствуйте, ${playerName}! Вы успешно записались на курс «${courseName}».`,
      welcomeBody: durationDays => `По мере прохождения этой ${durationDays}-дневной программы вы будете получать по одному уроку в день по электронной почте.`,
      welcomeCta: 'Открыть панель курса',

      completionSubject: courseName => `Поздравляем! Вы завершили «${courseName}»!`,
      completionHeading: playerName => `Поздравляем, ${playerName}!`,
      completionBody: (courseName, durationDays) =>
        `Вы успешно завершили «${courseName}». Пройти все ${durationDays} дней — это большое достижение.`,
      completionCta: 'Посмотреть другие курсы',
      completionUpsellHeading: 'Рекомендуем вам',

      reminderSubject: (dayNumber, courseName) => `Не пропустите день ${dayNumber} курса «${courseName}»`,
      reminderHeading: playerName => `Здравствуйте, ${playerName}!`,
      reminderBody: (dayNumber, courseName) =>
        `Вы ещё не завершили день ${dayNumber} курса «${courseName}». Продолжайте сегодня, чтобы сохранить темп.`,
      reminderCta: dayNumber => `Завершить день ${dayNumber}`,

      paymentSubject: courseName => `Платёж подтверждён — ${courseName}`,
      paymentHeading: 'Платёж успешно выполнен!',
      paymentThanks: playerName => `Здравствуйте, ${playerName}!`,
      paymentActivated: 'Спасибо за оплату. Ваш премиум‑доступ активирован.',
      paymentDetailsHeading: 'Детали платежа',
      paymentLabels: {
        product: 'Продукт',
        amount: 'Сумма',
        premiumExpires: 'Премиум до',
        transactionId: 'ID транзакции',
      },
      paymentCtaCourse: 'Открыть курс',
      paymentCtaBrowse: 'Посмотреть курсы',
      paymentSupport: email => `Если у вас есть вопросы, напишите нам: ${email}.`,
      paymentThanksClosing: 'Спасибо, что учитесь с Amanoba!',

      teamSignoff: '— Команда Amanoba',
    },
  };

  return stringsByLocale[locale] || stringsByLocale.en;
}

function getDirection(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

export function renderWelcomeEmailHtml(params: BasicEmailParams & { durationDays: number }) {
  const { locale, playerName, courseName, durationDays, appUrl, tokens } = params;
  const s = getLocaleStrings(locale);
  const dir = getDirection(locale);

  const ctaBg = tokens.ctaBg || '#FAB908';
  const ctaText = tokens.ctaText || '#111827';
  const bodyText = tokens.bodyText || '#333333';

  const dashboardUrl = `${appUrl}/${locale}/my-courses`;
  const border = tokens.border || '#dddddd';

  const brandName = 'Amanoba';
  return `
    <!DOCTYPE html>
    <html lang="${locale}" dir="${dir}">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${s.welcomeHeading(courseName)}</title>
      </head>
      <body dir="${dir}" style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: ${bodyText}; background: #f5f5f5; font-size: 16px;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px 16px;">
          <div style="background: #ffffff; border: 1px solid ${border}; border-radius: 12px; padding: 32px 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
            <p style="margin: 0 0 24px; font-size: 14px; font-weight: 600; color: ${tokens.muted || '#666666'};">${escapeHtml(brandName)}</p>
            <h1 style="margin: 0 0 16px; font-size: 22px; line-height: 1.3; color: ${bodyText};">${s.welcomeHeading(courseName)}</h1>
            <p style="margin: 0 0 12px;">${s.welcomeIntro(playerName, courseName)}</p>
            <p style="margin: 0 0 28px;">${s.welcomeBody(durationDays)}</p>
            <p style="margin: 0;">
              <a href="${dashboardUrl}" style="background-color: ${ctaBg}; color: ${ctaText}; padding: 14px 28px; min-height: 44px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; line-height: 1.2; box-sizing: border-box;">
                ${s.welcomeCta}
              </a>
            </p>
            <p style="margin: 28px 0 0; font-size: 14px; color: ${tokens.muted || '#666666'};">${s.teamSignoff}</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function renderWelcomeEmailSubject(params: { locale: Locale; courseName: string }) {
  const s = getLocaleStrings(params.locale);
  return s.welcomeSubject(params.courseName);
}

export type RecommendedCourse = { name: string; courseId: string };

export type CompletionSegment = 'beginner' | 'intermediate' | 'advanced';

/** Segment-specific upsell intro line (completion email). EN only; others fall back to no intro. */
function getCompletionUpsellIntro(locale: Locale, segment?: CompletionSegment | null): string {
  if (!segment || locale !== 'en') return '';
  const intros: Record<CompletionSegment, string> = {
    beginner: 'Pick one of the courses below and take it step by step.',
    intermediate: 'Consider one of these to build on what you\'ve learned.',
    advanced: 'Challenge yourself with one of these next.',
  };
  return intros[segment];
}

export function renderCompletionEmailHtml(
  params: BasicEmailParams & {
    durationDays: number;
    recommendedCourses?: RecommendedCourse[];
    segment?: CompletionSegment | null;
    messageId?: string;
  }
) {
  const { locale, playerName, courseName, durationDays, appUrl, tokens, recommendedCourses, segment, messageId } = params;
  const s = getLocaleStrings(locale);
  const dir = getDirection(locale);

  const ctaBg = tokens.ctaBg || '#FAB908';
  const ctaText = tokens.ctaText || '#111827';
  const bodyText = tokens.bodyText || '#333333';
  const muted = tokens.muted || '#666666';

  const browseUrlRaw = `${appUrl}/${locale}/courses`;
  const browseUrl =
    messageId
      ? `${appUrl}/api/email/click/${messageId}?url=${encodeURIComponent(browseUrlRaw)}`
      : browseUrlRaw;

  const courseLink = (c: RecommendedCourse) => {
    const hrefRaw = `${appUrl}/${locale}/courses/${encodeURIComponent(c.courseId)}`;
    const href = messageId
      ? `${appUrl}/api/email/click/${messageId}?url=${encodeURIComponent(hrefRaw)}`
      : hrefRaw;
    return `<li style="margin: 8px 0;"><a href="${href}" style="color: ${ctaBg}; text-decoration: none;">${escapeHtml(c.name)}</a></li>`;
  };

  const upsellIntro = getCompletionUpsellIntro(locale, segment);
  const upsellSection =
    recommendedCourses && recommendedCourses.length > 0
      ? `
        <hr style="margin: 24px 0; border: none; border-top: 1px solid ${tokens.border};">
        <p style="font-weight: bold; color: ${bodyText};">${s.completionUpsellHeading}</p>
        ${upsellIntro ? `<p style="color: ${bodyText}; margin-bottom: 12px;">${escapeHtml(upsellIntro)}</p>` : ''}
        <ul style="list-style: none; padding: 0; margin: 12px 0;">
          ${recommendedCourses.map(courseLink).join('')}
        </ul>
      `
      : '';

  const openPixel =
    messageId
      ? `<img src="${appUrl}/api/email/open/${messageId}" width="1" height="1" alt="" style="display:block;" />`
      : '';

  return `
    <html>
      <body dir="${dir}" style="font-family: Arial, sans-serif; line-height: 1.6; color: ${bodyText};">
        <h1>${escapeHtml(s.completionHeading(playerName))}</h1>
        <p>${escapeHtml(s.completionBody(courseName, durationDays))}</p>
        <p style="margin-top: 24px;">
          <a href="${browseUrl}" style="background-color: ${ctaBg}; color: ${ctaText}; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            ${escapeHtml(s.completionCta)}
          </a>
        </p>
        ${upsellSection}
        <p style="margin-top: 20px; color: ${muted};">${escapeHtml(s.teamSignoff)}</p>
        ${openPixel}
      </body>
    </html>
  `;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderCompletionEmailSubject(params: { locale: Locale; courseName: string }) {
  const s = getLocaleStrings(params.locale);
  return s.completionSubject(params.courseName);
}

export function renderReminderEmailHtml(params: BasicEmailParams & { dayNumber: number; courseSlug: string }) {
  const { locale, playerName, courseName, dayNumber, courseSlug, appUrl, tokens } = params;
  const s = getLocaleStrings(locale);
  const dir = getDirection(locale);

  const ctaBg = tokens.ctaBg || '#FAB908';
  const ctaText = tokens.ctaText || '#111827';
  const bodyText = tokens.bodyText || '#333333';

  const dayUrl = `${appUrl}/${locale}/courses/${courseSlug}/day/${dayNumber}`;

  return `
    <html>
      <body dir="${dir}" style="font-family: Arial, sans-serif; line-height: 1.6; color: ${bodyText};">
        <h1>${s.reminderHeading(playerName)}</h1>
        <p>${s.reminderBody(dayNumber, courseName)}</p>
        <p style="margin-top: 24px;">
          <a href="${dayUrl}" style="background-color: ${ctaBg}; color: ${ctaText}; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            ${s.reminderCta(dayNumber)}
          </a>
        </p>
        <p style="margin-top: 20px;">${s.teamSignoff}</p>
      </body>
    </html>
  `;
}

export function renderReminderEmailSubject(params: { locale: Locale; dayNumber: number; courseName: string }) {
  const s = getLocaleStrings(params.locale);
  return s.reminderSubject(params.dayNumber, params.courseName);
}

export function renderPaymentConfirmationEmail(params: {
  locale: Locale;
  playerName: string;
  courseName: string;
  courseSlug: string | null;
  appUrl: string;
  tokens: Required<Pick<EmailTokens, 'border' | 'muted'>> & Required<Pick<EmailTokens, 'bodyText' | 'ctaBg' | 'ctaText'>>;
  formattedAmount: string;
  formattedExpiryDate: string;
  transactionId: string;
  supportEmail: string;
}): { subject: string; html: string } {
  const { locale, playerName, courseName, courseSlug, appUrl, tokens, formattedAmount, formattedExpiryDate, transactionId, supportEmail } = params;
  const s = getLocaleStrings(locale);
  const dir = getDirection(locale);

  const courseUrl = courseSlug ? `${appUrl}/${locale}/courses/${courseSlug}` : `${appUrl}/${locale}/courses`;
  const ctaText = courseSlug ? s.paymentCtaCourse : s.paymentCtaBrowse;

  const html = `
    <html>
      <body dir="${dir}" style="font-family: Arial, sans-serif; line-height: 1.6; color: ${tokens.bodyText}; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: ${tokens.ctaBg}; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: ${tokens.ctaText}; margin: 0;">${s.paymentHeading}</h1>
        </div>
        <div style="background-color: #fff; padding: 30px; border: 2px solid ${tokens.ctaBg}; border-top: none; border-radius: 0 0 8px 8px;">
          <p>${s.paymentThanks(playerName)}</p>
          <p>${s.paymentActivated}</p>

          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: ${tokens.ctaText};">${s.paymentDetailsHeading}</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: ${tokens.muted};"><strong>${s.paymentLabels.product}:</strong></td>
                <td style="padding: 8px 0; text-align: right; color: ${tokens.ctaText};">${courseName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: ${tokens.muted};"><strong>${s.paymentLabels.amount}:</strong></td>
                <td style="padding: 8px 0; text-align: right; color: ${tokens.ctaText}; font-weight: bold;">${formattedAmount}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: ${tokens.muted};"><strong>${s.paymentLabels.premiumExpires}:</strong></td>
                <td style="padding: 8px 0; text-align: right; color: ${tokens.ctaText};">${formattedExpiryDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: ${tokens.muted};"><strong>${s.paymentLabels.transactionId}:</strong></td>
                <td style="padding: 8px 0; text-align: right; color: ${tokens.muted}; font-size: 12px;">${transactionId}</td>
              </tr>
            </table>
          </div>

          <p style="margin-top: 30px;">
            <a href="${courseUrl}" style="background-color: ${tokens.ctaBg}; color: ${tokens.ctaText}; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              ${ctaText}
            </a>
          </p>

          <p style="margin-top: 30px; font-size: 14px; color: ${tokens.muted};">
            ${s.paymentSupport(supportEmail)}
          </p>

          <p style="margin-top: 20px;">${s.paymentThanksClosing}</p>
          <p>${s.teamSignoff}</p>
        </div>
      </body>
    </html>
  `;

  return {
    subject: s.paymentSubject(courseName),
    html,
  };
}
