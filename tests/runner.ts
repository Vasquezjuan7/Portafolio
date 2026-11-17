import { testReadingTime } from './readingTime.test';
import { testMathUtils } from './math.test';
import { testDateUtils } from './date.test';
import { testValidationUtils } from './validation.test';
import { testI18nIntegrity } from './i18n.test';
import { testPortfolioUniqueIds } from './portfolio.test';
import { testCombatCalculations } from './combat.test';
import { testStorageFallback } from './storage.test';
import { testLinkSecurity } from './security.test';
import { testSpringDamping } from './spring.test';
import { testThemeModes } from './theme.test';
import { testGridDimensions } from './radar.test';
import { testCvFileName } from './cv.test';

export function runAllUnitTests() {
  try {
    testReadingTime();
    testMathUtils();
    testDateUtils();
    testValidationUtils();
    testI18nIntegrity();
    testPortfolioUniqueIds();
    testCombatCalculations();
    testStorageFallback();
    testLinkSecurity();
    testSpringDamping();
    testThemeModes();
    testGridDimensions();
    testCvFileName();
    return { success: true, testsRun: 13 };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}
